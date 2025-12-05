from sqlalchemy.orm import Session

from . import models, schemas


def get_instance(db: Session, instance_id: int):
    return db.query(models.Instance).filter(models.Instance.id == instance_id).first()


def get_instances(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Instance).offset(skip).limit(limit).all()


def get_raids(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Instance).filter(models.Instance.type == "raids").offset(skip).limit(limit).all()


def get_dungeons(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Instance).filter(models.Instance.type == "dungeons").offset(skip).limit(limit).all()


def get_spells(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Spell).offset(skip).limit(limit).all()
