from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from src.db import db
from src.model import Event
from dotenv import load_dotenv
from bson import ObjectId


load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET","supersecretkey")
ALGORITHM = "HS256"

app = FastAPI()
security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try :
        payload = jwt.decode(credentials.credentials, SECRET_KEY,algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401,detail = "Invalid token")

@app.post("/events")
async def create_event(event: Event, user: dict= Depends(verify_token)):
    if user["role"] != "organizer":
        raise HTTPException(status_code=403,detail="Acces interdit")
    event_dict = event.dict()
    event_dict["organizer_id"] = user["id"]

    new_event = await db.events.insert_one(event_dict)
    return {"message" : "Evenement crée","event_id": str(new_event.inserted_id)}

@app.patch("/events/{events_id}")
async def update_event(event_id: str, update_data: dict, user: dict = Depends(verify_token)):
    if user["role"] != "organizer":
        raise HTTPException(status_code=403, detail="Accès interdit")

    event = await db.events.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")

    if event["organizer_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que vos propres événements")

    # Mise à jour des champs envoyés
    update_fields = {key: value for key, value in update_data.items() if key in ["title", "description", "date"]}
    if not update_fields:
        raise HTTPException(status_code=400, detail="Aucune mise à jour valide fournie")

    await db.events.update_one({"_id": ObjectId(event_id)}, {"$set": update_fields})
    return {"message": "Événement mis à jour avec succès"}


@app.delete("/events/{event_id}")
async def delete_events(event_id: str, user: dict = Depends(verify_token)):
    event = await db.events.find_one({"_id": ObjectId(event_id)})
    if not event or event["organizer_id"]!= user["id"]:
        raise HTTPException(status_code=403,detail = "Acces interdit")
    await db.events.delete_one({"_id" : event_id})
    return{"message":"Evenement supprimé"}

@app.get("/events")
async def get_approved_events():
    events = await db.events.find({"status": "approved"}).to_list(length = 100)
    return events

@app.put("/events/{event_id}/approve")
async def approve_event(event_id: str, user: dict = Depends(verify_token)):
    if user["role"]!="moderator":
        raise HTTPException(status_code = 404,detail = "Moderateur Uniquement")
    result = await db.events.update_one({"_id":ObjectId(event_id)},{"$set":{"status":"approved"}})
    if result.modified_count == 0:
        raise HTTPException(status_code = 404,detail='Evenement non trouvé')
    return {"message":"Evenement approuvé"}

@app.put("/events/{event_id}/refuse")
async def approve_event(event_id: str, user: dict = Depends(verify_token)):
    if user["role"]!="moderator":
        raise HTTPException(status_code = 404,detail = "Moderateur Uniquement")
    result = await db.events.update_one({"_id":ObjectId(event_id)},{"$set":{"status":"refused"}})
    if result.modified_count == 0:
        raise HTTPException(status_code = 404,detail='Evenement non trouvé')
    return {"message":"Evenement refusé"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=8000)




