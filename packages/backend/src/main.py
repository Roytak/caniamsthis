from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/instances/", response_model=list[schemas.Instance])
def read_instances(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    instances = crud.get_instances(db, skip=skip, limit=limit)
    return instances


@app.get("/raids/", response_model=list[schemas.Instance])
def read_raids(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    raids = crud.get_raids(db, skip=skip, limit=limit)
    return raids


@app.get("/dungeons/", response_model=list[schemas.Instance])
def read_dungeons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    dungeons = crud.get_dungeons(db, skip=skip, limit=limit)
    return dungeons


@app.get("/instances/{instance_id}", response_model=schemas.Instance)
def read_instance(instance_id: int, db: Session = Depends(get_db)):
    db_instance = crud.get_instance(db, instance_id=instance_id)
    if db_instance is None:
        raise HTTPException(status_code=404, detail="Instance not found")
    return db_instance


@app.get("/spells/", response_model=list[schemas.Spell])
def read_spells(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    spells = crud.get_spells(db, skip=skip, limit=limit)
    return spells
