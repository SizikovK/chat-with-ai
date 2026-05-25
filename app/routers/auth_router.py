from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import EmailStr, BaseModel
from bson import ObjectId
from bson.errors import InvalidId

from app.database import users_collection

router = APIRouter(tags=["auth", "users"])

class UserCreate(BaseModel):
    nickname: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    nickname: str | None = None
    password: str | None = None

@router.post("/auth/register")
def register_user(user: UserCreate):
    exists = users_collection.find_one({"email": user.email})
    if exists:
        raise HTTPException(400, "email already exists")

    doc = {
        "nickname": user.nickname,
        "email": user.email,
        "password": user.password,
        "created_at": datetime.utcnow(),
    }

    res = users_collection.insert_one(doc)
    return {"id": str(res.inserted_id)}

@router.post("/auth/login")
def login_user(data: UserLogin):
    user = users_collection.find_one({
        "email": data.email,
        "password": data.password,
    })
    if not user:
        raise HTTPException(401, "user not found")

    return {
        "id": str(user["_id"]),
        "nickname": user["nickname"],
        "email": user["email"],
    }

@router.get("/users/{user_id}")
def get_user(user_id: str):
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(400, "invalid user_id")

    doc = users_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(404, "not found")

    return {
        "id": str(doc["_id"]),
        "nickname": doc["nickname"],
        "email": doc["email"],
    }

@router.patch("/users/{user_id}")
def update_user(user_id: str, data: UserUpdate):
    payload = {}
    raw_payload = data.model_dump()

    nickname = raw_payload.get("nickname")
    if nickname is not None:
        nickname = nickname.strip()
        if nickname:
            payload["nickname"] = nickname

    password = raw_payload.get("password")
    if password is not None:
        if len(password) < 8:
            raise HTTPException(400, "password must be at least 8 characters")
        payload["password"] = password

    if not payload:
        raise HTTPException(400, "empty update")

    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(400, "invalid user_id")

    res = users_collection.update_one({"_id": oid}, {"$set": payload})
    if res.matched_count == 0:
        raise HTTPException(404, "not found")

    doc = users_collection.find_one({"_id": oid})
    return {
        "id": str(doc["_id"]),
        "nickname": doc["nickname"],
        "email": doc["email"],
        "updated": True,
    }

@router.delete("/users/{user_id}")
def delete_user(user_id: str):
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(400, "invalid user_id")

    res = users_collection.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(404, "not found")

    return {"deleted": True}
