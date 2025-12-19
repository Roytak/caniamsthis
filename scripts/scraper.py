import asyncio
import aiohttp
import re
import json
import bs4 as BeautifulSoup
import sys
import argparse
from typing import Dict, List, Tuple, Any

RAIDS = {
    "Manaforge Omega": 16178,
}

DUNGEONS = {
    "Ara-Kara, City of Echoes": 15093,
    "The Dawnbreaker": 14971,
    "Priory of the Sacred Flame": 14954,
    "Operation: Floodgate": 15452,
    "Eco-Dome Al'dani": 16104,
    "Halls of Atonement": 12831,
    "Tazavesh, the Veiled Market": 13577,
}

class WoWScraper:
    def __init__(self, max_concurrent_requests: int = 10):
        self.semaphore = asyncio.Semaphore(max_concurrent_requests)

    async def get_content(self, session: aiohttp.ClientSession, url: str) -> str:
        """Get content with rate limiting via semaphore"""
        async with self.semaphore:
            try:
                async with session.get(url) as response:
                    if response.status == 200:
                        return await response.text()
                    return ""
            except Exception as e:
                print(f"Error fetching {url}: {e}")
                return ""

    def parse_spell_details(self, html_content: str) -> Tuple[str, List[str]]:
        """Parse spell school and flags from HTML content"""
        if not html_content:
            return "Unknown", []

        soup = BeautifulSoup.BeautifulSoup(html_content, 'html.parser')

        spell_school_row = soup.find('th', string="School")
        school = spell_school_row.find_next_sibling('td').text.strip() if spell_school_row else "Unknown"

        flags_row = soup.find('th', string="Flags")
        flags = []
        if flags_row:
            flags_td = flags_row.find_next_sibling('td')
            if flags_td:
                flags = [li.text.strip() for li in flags_td.find_all('li')]

        return school, flags

    async def scrape_spell_details(self, session: aiohttp.ClientSession, spell_id: int) -> Tuple[str, List[str]]:
        """Scrape spell details asynchronously"""
        url = f"https://www.wowhead.com/spell={spell_id}"
        html_content = await self.get_content(session, url)
        return self.parse_spell_details(html_content)

    async def scrape_spells(self, session: aiohttp.ClientSession, npc_id: int) -> List[Dict[str, Any]]:
        """Scrape spells for an NPC asynchronously"""
        url = f"https://www.wowhead.com/npc={npc_id}#abilities;mode:m"
        html_content = await self.get_content(session, url)

        if not html_content:
            return []

        spells_list = re.search(r"new Listview\({template: 'spell'.*?data: (\[.*?\])}\);", html_content, re.DOTALL)
        if not spells_list:
            return []

        try:
            # Replace unquoted keys with quoted keys
            spells_json_str = spells_list.group(1).replace("modes:", "\"modes\":")
            spells_json = json.loads(spells_json_str)
        except json.JSONDecodeError:
            return []

        # Create tasks for all spell detail requests
        spell_detail_tasks = []
        for spell in spells_json:
            spell_id = spell.get('id')
            if spell_id:
                task = self.scrape_spell_details(session, spell_id)
                spell_detail_tasks.append((spell, task))

        # Execute all spell detail requests concurrently
        spells_with_details = []
        if spell_detail_tasks:
            for spell, task in spell_detail_tasks:
                school, flags = await task
                spells_with_details.append({
                    'name': spell.get('name'),
                    'id': spell.get('id'),
                    'school': school,
                    'flags': flags
                })

        # Remove duplicates
        unique_spells = {spell['id']: spell for spell in spells_with_details}.values()
        return list(unique_spells)

    def get_screenshot_url(self, html_content, npc_name):
        image_id = None

        # STRATEGY 1: Direct ID Extraction (Most Robust)
        # Instead of parsing the full complex JSON, we just grab the first "id"
        # inside the lv_screenshots definition. This bypasses JSON syntax errors.
        # We verify it looks like: var lv_screenshots = [{"id":12345

        # Matches: var lv_screenshots = [{"id":12345
        simple_pattern = r'var\s+lv_screenshots\s*=\s*\[\{\"id\":(\d+)'
        match = re.search(simple_pattern, html_content)

        if match:
            image_id = match.group(1)

        # STRATEGY 2: Full JSON Parsing (Fallback for "Sticky" logic)
        # Only necessary if you specifically need the "sticky" image over the first one.
        if not image_id:
            try:
                # Capture everything from 'var lv_screenshots = [' until the closing '];'
                # We use a greedy match up to the specific variable terminator to handle nested brackets
                json_pattern = r'var\s+lv_screenshots\s*=\s*(\[.*?\]);'
                m = re.search(json_pattern, html_content, re.DOTALL)

                if m:
                    data = json.loads(m.group(1))
                    # Find sticky, or default to first
                    if data:
                        chosen = next((s for s in data if s.get('sticky') == 1), data[0])
                        image_id = chosen.get('id')
            except (json.JSONDecodeError, AttributeError):
                pass

        # URL CONSTRUCTION
        if image_id:
            # Create a simple slug if name is provided, otherwise simple fallback
            if npc_name:
                slug = re.sub(r"[^a-z0-9]+", "-", npc_name.lower()).strip("-")
                return f"https://wow.zamimg.com/uploads/screenshots/normal/{image_id}-{slug}.jpg"
            else:
                # Wowhead images often load with just the ID, or you can use a generic slug
                return f"https://wow.zamimg.com/uploads/screenshots/normal/{image_id}.jpg"

        return ""

    def parse_npc_image(self, html_content: str, npc_name: str | None = None) -> str:
        """Parse NPC image URL from HTML content"""
        if not html_content:
            return ""

        soup = BeautifulSoup.BeautifulSoup(html_content, 'html.parser')

        # 1) Prefer Open Graph meta image from <head>
        og_image = soup.find('meta', attrs={'property': 'og:image'})
        if og_image:
            content = og_image.get('content')
            if content and content != "https://wow.zamimg.com/images/logos/share-icon.png":
                return content

        # 2) Fallback to secure_url variant or Twitter image
        og_image_secure = soup.find('meta', attrs={'property': 'og:image:secure_url'})
        if og_image_secure:
            content = og_image_secure.get('content')
            if content and content != "https://wow.zamimg.com/images/logos/share-icon.png":
                return content

        twitter_image = soup.find('meta', attrs={'name': 'twitter:image'})
        if twitter_image:
            content = twitter_image.get('content')
            if content and content != "https://wow.zamimg.com/images/logos/share-icon.png":
                return content

        # 3) Final fallback: extract screenshot id from inline JS and forge URL
        url = self.get_screenshot_url(html_content, npc_name)
        return url

    async def scrape_npc_image(self, session: aiohttp.ClientSession, npc_id: int, npc_name: str | None = None) -> str:
        """Scrape NPC image URL asynchronously"""
        url = f"https://www.wowhead.com/npc={npc_id}"
        html_content = await self.get_content(session, url)
        return self.parse_npc_image(html_content, npc_name)

    def parse_npcs_from_html(self, html_content: str, boss_only: bool = False) -> List[Dict[str, Any]]:
        """Parse NPC data from HTML content"""
        if not html_content:
            return []

        npcs_list = re.search(r"new Listview\({template: 'npc'.*?data: (\[.*?\])}\);", html_content, re.DOTALL)
        if not npcs_list:
            return []

        try:
            npcs_json = json.loads(npcs_list.group(1))
        except json.JSONDecodeError:
            return []

        if boss_only:
            # Keep only entries with 'boss': 1
            npcs_json = [npc for npc in npcs_json if npc.get('boss') == 1]

        # Filter out non-hostile npcs ('react': [1,1])
        npcs_json = [npc for npc in npcs_json if npc.get('react') != [1, 1]]

        return npcs_json

    async def scrape_npcs(self, session: aiohttp.ClientSession, html_content: str, boss_only: bool = False) -> List[Dict[str, Any]]:
        """Scrape NPCs and their spells asynchronously"""
        npcs_json = self.parse_npcs_from_html(html_content, boss_only)

        if not npcs_json:
            return []

        print(f"Found {len(npcs_json)} NPCs to process")

        # Create tasks for all NPC spell scraping
        npc_tasks = []
        for npc in npcs_json:
            npc_id = npc.get('id')
            if npc_id:
                task = self.scrape_spells(session, npc_id)
                npc_tasks.append((npc, task))

        # Execute all NPC spell scraping and image scraping concurrently
        npcs_with_spells = []
        for npc, task in npc_tasks:
            spells = await task
            npc_id = npc.get('id')
            image_url = await self.scrape_npc_image(session, npc_id, npc.get('name')) if npc_id else ""
            npc_data = {
                'name': npc.get('name'),
                'id': npc_id,
                'is_boss': npc.get('boss') == 1,
                'spells': spells,
                'image_url': image_url
            }
            npcs_with_spells.append(npc_data)
            print(f"NPC: {npc_data['name']} (ID: {npc_data['id']}) - {len(spells)} spells")

        return npcs_with_spells

    async def scrape_instance(self, session: aiohttp.ClientSession, name: str, instance_id: int, boss_only: bool = False) -> Tuple[str, Dict[str, Any]]:
        """Scrape a single instance (raid or dungeon)"""
        url = f"https://www.wowhead.com/zone={instance_id}"
        print(f"Scraping {'raid' if boss_only else 'dungeon'}: {name} (ID: {instance_id}) with URL: {url}")

        html_content = await self.get_content(session, url)
        if html_content:
            mob_data = await self.scrape_npcs(session, html_content, boss_only)
            return name, {
                'id': instance_id,
                'npcs': mob_data
            }
        else:
            return name, {'id': instance_id, 'npcs': []}

    async def scrape_raids(self, session: aiohttp.ClientSession) -> Dict[str, Any]:
        """Scrape all raids concurrently"""
        tasks = [
            self.scrape_instance(session, name, raid_id, boss_only=True)
            for name, raid_id in RAIDS.items()
        ]

        results = await asyncio.gather(*tasks)
        return dict(results)

    async def scrape_dungeons(self, session: aiohttp.ClientSession) -> Dict[str, Any]:
        """Scrape all dungeons concurrently"""
        tasks = [
            self.scrape_instance(session, name, dungeon_id, boss_only=False)
            for name, dungeon_id in DUNGEONS.items()
        ]

        results = await asyncio.gather(*tasks)
        return dict(results)

    async def scrape_all(self) -> Dict[str, Any]:
        """Scrape all raids and dungeons"""
        connector = aiohttp.TCPConnector(limit=20, limit_per_host=10)
        timeout = aiohttp.ClientTimeout(total=30)

        async with aiohttp.ClientSession(
            connector=connector,
            timeout=timeout,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        ) as session:
            # Run raids and dungeons concurrently
            raids_task = self.scrape_raids(session)
            dungeons_task = self.scrape_dungeons(session)

            raids, dungeons = await asyncio.gather(raids_task, dungeons_task)

            return {
                'raids': raids,
                'dungeons': dungeons
            }

async def main():
    scraper = WoWScraper(max_concurrent_requests=15)  # Adjust based on your needs
    instances = await scraper.scrape_all()

    with open('instances.json', 'w') as f:
        json.dump(instances, f, indent=4)

    print("Scraping completed successfully!")


def refine():
    """Refine the instances.json file by adding can_immune flags to spells"""
    # Load the instances.json file
    with open('instances.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Ensure backward-compatibility with scraper output that writes
    # top-level 'raids' and 'dungeons' instead of wrapping them in
    # an 'instances' object. Create the wrapper if it's missing.
    if 'instances' not in data:
        raids = data.get('raids', {})
        dungeons = data.get('dungeons', {})
        data = { 'instances': { 'raids': raids, 'dungeons': dungeons } }
        print("Added missing 'instances' wrapper to JSON data.")

    # Spell names to remove from both raids and dungeons
    spells_to_remove = {
        "Radiant Focus",
        "Blinding Sleet",
        "Bursting Shot",
        "Encounter Event",
        "Shattered Essence",
        "Meerah's Jukebox",
    }

    # NPC names to remove from dungeons
    npcs_to_remove_from_dungeons = {
        "Void Emissary",
        "Orb of Ascendance"
    }

    def should_remove_spell(spell_name: str) -> bool:
        """Check if a spell should be removed"""
        if not isinstance(spell_name, str):
            return False
        return spell_name in spells_to_remove

    def remove_duplicate_spells(spells: List[Dict]) -> List[Dict]:
        """Remove duplicate spells based on spell ID"""
        seen = {}
        for spell in spells:
            spell_name = spell.get('name')
            if spell_name not in seen:
                seen[spell_name] = spell
        return list(seen.values())

    # Iterate through all raids, NPCs, and spells
    for raid_name, raid_data in data['instances']['raids'].items():
        if 'npcs' in raid_data:
            for npc in raid_data['npcs']:
                if 'spells' in npc:
                    # Filter out unwanted spells and remove duplicates
                    npc['spells'] = [
                        spell for spell in npc['spells']
                        if not should_remove_spell(spell.get('name'))
                    ]
                    npc['spells'] = remove_duplicate_spells(npc['spells'])

                    for spell in npc['spells']:
                        # Check if school is "Physical" or flags contain "Unaffected by invulnerability"
                        school_is_physical = spell.get('school') == 'Physical'
                        has_unaffected_flag = 'Unaffected by invulnerability' in spell.get('flags', [])

                        # Set can_immune based on the conditions
                        if school_is_physical or has_unaffected_flag:
                            spell['can_immune'] = False
                        else:
                            spell['can_immune'] = True

            # Remove NPCs with 0 spells
            raid_data['npcs'] = [
                npc for npc in raid_data['npcs']
                if npc.get('spells') and len(npc['spells']) > 0
            ]

    for dungeon_name, dungeon_data in data['instances']['dungeons'].items():
        if 'npcs' in dungeon_data:
            # First, remove specific NPCs by name
            dungeon_data['npcs'] = [
                npc for npc in dungeon_data['npcs']
                if npc.get('name') not in npcs_to_remove_from_dungeons
            ]

            for npc in dungeon_data['npcs']:
                if 'spells' in npc:
                    # Filter out unwanted spells and remove duplicates
                    npc['spells'] = [
                        spell for spell in npc['spells']
                        if not should_remove_spell(spell.get('name'))
                    ]
                    npc['spells'] = remove_duplicate_spells(npc['spells'])

                    for spell in npc['spells']:
                        # Check if school is "Physical" or flags contain "Unaffected by invulnerability"
                        school_is_physical = spell.get('school') == 'Physical'
                        has_unaffected_flag = 'Unaffected by invulnerability' in spell.get('flags', [])

                        # Set can_immune based on the conditions
                        if school_is_physical or has_unaffected_flag:
                            spell['can_immune'] = False
                        else:
                            spell['can_immune'] = True

            # Remove NPCs that now have zero spells
            dungeon_data['npcs'] = [
                npc for npc in dungeon_data['npcs']
                if npc.get('spells') and len(npc['spells']) > 0
            ]

    # Save the modified data back to the file
    with open('instances.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print("Processing complete. All spells have been updated with the 'can_immune' flag.")


async def main_with_scrape():
    """Main entry point that optionally scrapes then refines"""
    await main()
    refine()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape and refine WoW instance data')
    parser.add_argument('--scrape', action='store_true', help='Scrape data from Wowhead (default: only refine existing data)')
    args = parser.parse_args()

    if args.scrape:
        asyncio.run(main_with_scrape())
    else:
        refine()
