import json
from pathlib import Path
from .database import SessionLocal
from . import models

def populate_db(instances_path: str = "C:\\Users\\mNoCZ\\Documents\\FIT\\caniamsthis\\scripts\\instances.json") -> None:
    inst_path = Path(__file__).parent.joinpath(instances_path).resolve()
    if not inst_path.exists():
        raise FileNotFoundError(f"Instances file not found: {inst_path}")

    with inst_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    instances_dict = data['instances']

    session = SessionLocal()
    try:
        for inst_type, insts in instances_dict.items():
            for inst_name, inst_data in insts.items():
                inst_id = inst_data.get('id')
                if inst_id is None:
                    continue
                instance = session.query(models.Instance).filter(models.Instance.id == inst_id).first()
                if not instance:
                    instance = models.Instance(id=inst_id, name=inst_name, type=inst_type)
                    session.add(instance)
                    session.commit()

                for npc_data in inst_data.get('npcs', []):
                    npc_id = npc_data.get('id')
                    if npc_id is None:
                        continue
                    npc = session.query(models.Npc).filter(models.Npc.id == npc_id).first()
                    if not npc:
                        npc = models.Npc(id=npc_id, name=npc_data.get('name'), is_boss=npc_data.get('is_boss', False))
                        session.add(npc)
                        session.commit()

                    # ensure association between instance and npc
                    if npc not in instance.npcs:
                        instance.npcs.append(npc)
                        session.commit()

                    for spell_data in npc_data.get('spells', []):
                        sid = spell_data.get('id')
                        if sid is None:
                            continue
                        spell = session.query(models.Spell).filter(models.Spell.id == sid).first()
                        if not spell:
                            can_immune = spell_data.get('can_immune')
                            if can_immune is None:
                                # fall back to previous flags-based heuristic
                                can_immune = "Immune" not in spell_data.get('flags', [])
                            spell = models.Spell(id=sid, name=spell_data.get('name'), school=spell_data.get('school'), can_immune=bool(can_immune))
                            session.add(spell)
                            session.commit()

                        # ensure association between npc and spell
                        if spell not in npc.spells:
                            npc.spells.append(spell)
                            session.commit()
    finally:
        session.close()
