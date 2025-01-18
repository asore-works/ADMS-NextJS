# app/schemas/user.py
from typing import Optional, List
from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime


# 共通の属性
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = True


# リクエスト時のスキーマ
class UserCreate(UserBase):
    email: EmailStr
    password: str
    first_name: str
    last_name: str


class UserUpdate(UserBase):
    password: Optional[str] = None


# レスポンス時のスキーマ
class UserInDBBase(UserBase):
    id: UUID4
    email: EmailStr
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


# トークン関連のスキーマ
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None


# app/schemas/user.py に追加
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None
