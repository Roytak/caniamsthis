from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .database import Base

instance_npc_association = Table(
    "instance_npc_association",
    Base.metadata,
    Column("instance_id", Integer, ForeignKey("instances.id")),
    Column("npc_id", Integer, ForeignKey("npcs.id")),
)

npc_spell_association = Table(
    "npc_spell_association",
    Base.metadata,
    Column("npc_id", Integer, ForeignKey("npcs.id")),
    Column("spell_id", Integer, ForeignKey("spells.id")),
)


class Instance(Base):
    __tablename__ = "instances"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    image_filename = Column(String, nullable=True)

    npcs = relationship(
        "Npc", secondary=instance_npc_association, back_populates="instances"
    )


class Npc(Base):
    __tablename__ = "npcs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    is_boss = Column(Boolean, default=False)
    image_url = Column(String, nullable=True)

    instances = relationship(
        "Instance", secondary=instance_npc_association, back_populates="npcs"
    )
    spells = relationship(
        "Spell", secondary=npc_spell_association, back_populates="npcs"
    )

    @property
    def instance_ids(self) -> list[int]:
        """Return a list of related instance IDs for serialization."""
        try:
            return [inst.id for inst in self.instances]
        except Exception:
            return []


class Spell(Base):
    __tablename__ = "spells"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    school = Column(String)
    can_immune = Column(Boolean)

    npcs = relationship(
        "Npc", secondary=npc_spell_association, back_populates="spells"
    )
