import json
from database import SessionLocal, Instance, Npc, Spell

def populate_db():
    db = SessionLocal()
    with open('../../scripts/instances.json', 'r') as f:
        data = json.load(f)

    for instance_type, instances in data['instances'].items():
        for instance_name, instance_data in instances.items():
            instance = db.query(Instance).filter(Instance.id == instance_data['id']).first()
            if not instance:
                instance = Instance(
                    id=instance_data['id'],
                    name=instance_name,
                    type=instance_type
                )
                db.add(instance)
                db.commit()

            for npc_data in instance_data['npcs']:
                npc = db.query(Npc).filter(Npc.id == npc_data['id']).first()
                if not npc:
                    npc = Npc(
                        id=npc_data['id'],
                        name=npc_data['name'],
                        instance_id=instance.id
                    )
                    db.add(npc)
                    db.commit()

                for spell_data in npc_data['spells']:
                    spell = db.query(Spell).filter(Spell.id == spell_data['id']).first()
                    if not spell:
                        spell = Spell(
                            id=spell_data['id'],
                            name=spell_data['name'],
                            school=spell_data['school'],
                            can_immune=spell_data['can_immune'],
                            npc_id=npc.id
                        )
                        db.add(spell)
                        db.commit()
    db.close()

if __name__ == "__main__":
    populate_db()
    print("Database populated successfully.")
