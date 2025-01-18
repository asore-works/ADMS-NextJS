from typing import Dict
import pytest
from fastapi.testclient import TestClient


def test_create_user(client: TestClient):
    data = {
        "email": "newuser@example.com",
        "password": "newpassword",
        "first_name": "New",
        "last_name": "User",
        "phone_number": "1234567890",
    }
    response = client.post("/api/v1/users/", json=data)
    assert response.status_code == 200  # ユーザー作成が成功する場合
    created_user = response.json()
    assert created_user["email"] == data["email"]
    assert created_user["first_name"] == data["first_name"]
    assert created_user["last_name"] == data["last_name"]


def test_read_current_user(client: TestClient, test_user: Dict[str, str]):
    # まずログインしてトークンを取得
    login_data = {
        "username": test_user["email"],
        "password": "testpassword",
    }
    login_response = client.post("/api/v1/login/access-token", data=login_data)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["email"] == test_user["email"]


# tests/test_users.py に追加
def test_update_user(client: TestClient, test_user: Dict[str, str]):
    # まずログインしてトークンを取得
    login_data = {
        "username": test_user["email"],
        "password": "testpassword",
    }
    login_response = client.post("/api/v1/login/access-token", data=login_data)
    token = login_response.json()["access_token"]

    # プロフィールを更新
    headers = {"Authorization": f"Bearer {token}"}
    update_data = {
        "first_name": "Updated",
        "last_name": "Name",
        "phone_number": "9876543210",
    }
    response = client.put(
        f"/api/v1/users/{test_user['id']}", headers=headers, json=update_data
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["first_name"] == update_data["first_name"]
    assert updated_user["last_name"] == update_data["last_name"]
    assert updated_user["phone_number"] == update_data["phone_number"]
