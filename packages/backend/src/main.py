from fastapi import APIRouter, Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router = APIRouter(prefix="/api")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/instances/", response_model=schemas.InstancesResponse)
def read_instances(db: Session = Depends(get_db)):
    dungeons = crud.get_dungeons(db, skip=0, limit=0)
    raids = crud.get_raids(db, skip=0, limit=0)
    return {"dungeons": dungeons, "raids": raids}


@router.get("/spells/search", response_model=schemas.SpellSearchResponse)
def search_spells(
    query: str, page: int = 1, limit: int = 20, db: Session = Depends(get_db)
):
    spells, total = crud.search_spells(db, query, page, limit)
    return {"results": spells, "total": total, "page": page, "limit": limit}


@router.get("/dungeons/{id}", response_model=schemas.Instance)
def get_dungeon(id: int, db: Session = Depends(get_db)):
    dungeon = crud.get_instance_by_id_and_type(db, id, "dungeons")
    if not dungeon:
        raise HTTPException(status_code=404, detail="Dungeon not found")
    return dungeon


@router.get("/raids/{id}", response_model=schemas.Instance)
def get_raid(id: int, db: Session = Depends(get_db)):
    raid = crud.get_instance_by_id_and_type(db, id, "raids")
    if not raid:
        raise HTTPException(status_code=404, detail="Raid not found")
    return raid


@router.get("/instances/{id}", response_model=schemas.Instance)
def get_instance(id: int, db: Session = Depends(get_db)):
    instance = crud.get_instance(db, id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
    return instance

app.include_router(router)
