import json

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

# Iterate through all raids, NPCs, and spells
for raid_name, raid_data in data['instances']['raids'].items():
    if 'npcs' in raid_data:
        for npc in raid_data['npcs']:
            if 'spells' in npc:
                for spell in npc['spells']:
                    # Check if school is "Physical" or flags contain "Unaffected by invulnerability"
                    school_is_physical = spell.get('school') == 'Physical'
                    has_unaffected_flag = 'Unaffected by invulnerability' in spell.get('flags', [])

                    # Set can_immune based on the conditions
                    if school_is_physical or has_unaffected_flag:
                        spell['can_immune'] = False
                    else:
                        spell['can_immune'] = True

for dungeon_name, dungeon_data in data['instances']['dungeons'].items():
    if 'npcs' in dungeon_data:
        for npc in dungeon_data['npcs']:
            if 'spells' in npc:
                for spell in npc['spells']:
                    # Check if school is "Physical" or flags contain "Unaffected by invulnerability"
                    school_is_physical = spell.get('school') == 'Physical'
                    has_unaffected_flag = 'Unaffected by invulnerability' in spell.get('flags', [])

                    # Set can_immune based on the conditions
                    if school_is_physical or has_unaffected_flag:
                        spell['can_immune'] = False
                    else:
                        spell['can_immune'] = True

# Save the modified data back to the file
with open('instances.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Processing complete. All spells have been updated with the 'can_immune' flag.")

