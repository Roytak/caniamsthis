from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas

def get_instance(db: Session, id: int):
    return db.query(models.Instance).filter(models.Instance.id == id).first()


def get_instances(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Instance).offset(skip).limit(limit).all()


def get_raids(db: Session, skip: int = 0, limit: int = 0):
    query = db.query(models.Instance).filter(models.Instance.type == "raids")
    if limit > 0:
        query = query.offset(skip).limit(limit)
    return query.all()


def get_dungeons(db: Session, skip: int = 0, limit: int = 0):
    query = db.query(models.Instance).filter(models.Instance.type == "dungeons")
    if limit > 0:
        query = query.offset(skip).limit(limit)
    return query.all()


def get_spells(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Spell).offset(skip).limit(limit).all()


def search_spells(db: Session, query: str, page: int = 1, limit: int = 20):
    offset = (page - 1) * limit
    # Case-insensitive search
    search_query = db.query(models.Spell).filter(
        func.lower(models.Spell.name).contains(query.lower())
    )
    total = search_query.count()
    spells = search_query.offset(offset).limit(limit).all()
    return spells, total


def get_instance_by_id_and_type(db: Session, id: int, type: str):
    return (
        db.query(models.Instance)
        .filter(models.Instance.id == id, models.Instance.type == type)
        .first()
    )
