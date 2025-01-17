import pytest
from typing import Generator, Dict
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.session import Base, get_db
from app.main import app
from app.models.user import User
from app.core.security import get_password_hash
import alembic.config

# テスト用のデータベースURL
SQLALCHEMY_DATABASE_URL = (
    "postgresql://adms_user:adms_password@localhost:5432/adms_test"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    alembic_args = [
        "--raiseerr",
        "upgrade",
        "head",
    ]
    alembic.config.main(argv=alembic_args)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db() -> Generator:
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")  # scopeをfunctionに変更
def client(db) -> Generator:
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")  # scopeをfunctionに変更
def test_user(db) -> Dict[str, str]:
    user_data = {
        "email": "test@example.com",
        "hashed_password": get_password_hash("testpassword"),
        "first_name": "Test",
        "last_name": "User",
    }
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    user_data["id"] = str(db_user.id)
    return user_data
