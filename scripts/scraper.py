import asyncio
import aiohttp
import re
import json
import bs4 as BeautifulSoup
from typing import Dict, List, Tuple, Any

RAIDS = {
    "Liberation of Undermine": 15522,
}

DUNGEONS = {
    "Operation: Floodgate": 15452,
    "Operation: Mechagon": 10225,
    "Theater of Pain": 12841,
    "The MOTHERLODE!!": 8064,
    "Priory of the Sacred Flame": 14954,
    "The Rookery": 14938,
    "Darkflame Cleft": 14882,
    "Cinderbrew Meadery": 15103
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

        # Execute all NPC spell scraping concurrently
        npcs_with_spells = []
        for npc, task in npc_tasks:
            spells = await task
            npc_data = {
                'name': npc.get('name'),
                'id': npc.get('id'),
                'is_boss': npc.get('boss') == 1,
                'spells': spells
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

if __name__ == "__main__":
    asyncio.run(main())
