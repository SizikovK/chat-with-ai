from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import EmailStr, BaseModel
from bson import ObjectId
from bson.errors import InvalidId

from app.database import users_collection

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    nickname: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    nickname: str | None = None
    password: str | None = None

 
@router.get("/")
def root():
    return {"message": "Chikenburbe"}
 
@router.post("/users")
def create_users(user: UserCreate):
    exists = users_collection.find_one({
        "email": user.email
    })

    if exists:
        raise HTTPException(400, "email already exists")
    
    doc = {
        "nickname": user.nickname,
        "email": user.email,
        "password": user.password,
        "created_at": datetime.utcnow()
    }

    res = users_collection.insert_one(doc)
    return {"id": str(res.inserted_id)}

@router.get("/users/{user_id}")
def get_user(user_id: str):
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(400, "invalid user_id")
    doc = users_collection.find_one({
        "_id": oid
    })
    if not doc:
        raise HTTPException(404, "not found")
    
    return {
        "id": str(doc["_id"]),
        "nickname": doc["nickname"],
        "email": doc["email"]
    }

@router.patch("/users/{user_id}")
def update_user(user_id: str, data: UserUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    if not payload:
        raise HTTPException(400, "empty update")
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(400, "invalid user_id")
    
    res = users_collection.update_one(
        {"_id": oid},
        {"$set": payload})
    
    if res.matched_count == 0:
        raise HTTPException(404, "not found")
    return {"updated": True}

@router.delete("/users/{user_id}")
def delete_user(user_id: str):
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(400, "invalid user_id")
    res = users_collection.delete_one({
        "_id": oid
    })
    if res.deleted_count == 0:
        raise HTTPException(404, "not found")
    return {"deleted": True}
