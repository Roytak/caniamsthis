from pydantic import BaseModel


class SpellBase(BaseModel):
    id: int
    name: str
    school: str
    can_immune: bool


class Spell(SpellBase):
    npc_id: int

    class Config:
        orm_mode = True


class NpcBase(BaseModel):
    id: int
    name: str


class Npc(NpcBase):
    instance_id: int
    spells: list[Spell] = []

    class Config:
        orm_mode = True


class InstanceBase(BaseModel):
    id: int
    name: str
    type: str


class Instance(InstanceBase):
    npcs: list[Npc] = []

    class Config:
        orm_mode = True
