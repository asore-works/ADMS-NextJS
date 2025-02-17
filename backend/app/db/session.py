# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import (
    sessionmaker,
    declarative_base,
)  # declarative_baseをインポート

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()  # 新しい書き方


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
