# tests/test_auth.py
from typing import Dict
import pytest
from fastapi.testclient import TestClient


def test_login_access_token(client: TestClient, test_user: Dict[str, str]):
    login_data = {
        "username": test_user["email"],
        "password": "testpassword",
    }
    r = client.post("/api/v1/login/access-token", data=login_data)
    token = r.json()
    assert r.status_code == 200
    assert "access_token" in token
    assert token["token_type"] == "bearer"


def test_login_access_token_wrong_password(
    client: TestClient, test_user: Dict[str, str]
):
    login_data = {
        "username": test_user["email"],
        "password": "wrongpassword",
    }
    r = client.post("/api/v1/login/access-token", data=login_data)
    assert r.status_code == 400
