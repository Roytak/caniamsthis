from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Instance(Base):
    __tablename__ = "instances"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)

    npcs = relationship("Npc", back_populates="instance")


class Npc(Base):
    __tablename__ = "npcs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    instance_id = Column(Integer, ForeignKey("instances.id"))

    instance = relationship("Instance", back_populates="npcs")
    spells = relationship("Spell", back_populates="npc")


class Spell(Base):
    __tablename__ = "spells"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    school = Column(String)
    can_immune = Column(Boolean)
    npc_id = Column(Integer, ForeignKey("npcs.id"))

    npc = relationship("Npc", back_populates="spells")
