from pydantic import BaseModel
from typing import Optional


class SpellBase(BaseModel):
    id: int
    name: str
    school: str
    can_immune: bool


class Spell(SpellBase):
    npc_id: Optional[int] = None

    class Config:
        orm_mode = True


class NpcBase(BaseModel):
    id: int
    name: str


class Npc(NpcBase):
    instance_id: Optional[int] = None
    instance_ids: list[int] = []
    is_boss: bool = False
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


class InstancesResponse(BaseModel):
    dungeons: list[Instance]
    raids: list[Instance]


class SpellSearchResponse(BaseModel):
    results: list[Spell]
    total: int
    page: int
    limit: int
