
from .database import Base, engine
from .populate_db import populate_db

def reset_database():
    """
    Drops all tables, recreates them, and populates the database with initial data.
    """
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Tables dropped.")

    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    print("Populating database...")
    populate_db()
    print("Database populated successfully.")

if __name__ == "__main__":
    reset_database()
