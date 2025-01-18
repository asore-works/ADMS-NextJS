# app/api/v1/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
from app import crud
from app.api import deps
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[UserSchema])
async def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve users."""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """Create new user."""
    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.create_user(db, user_in=user_in)
    return user


@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get current user."""
    return current_user


@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: str,
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """Update user profile."""
    if str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile",
        )

    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user = crud.update_user(db, user=user, user_in=user_in)
    return user
