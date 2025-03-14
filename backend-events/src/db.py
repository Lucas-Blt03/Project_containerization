import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password@mongodb-events:27017/events_db?authSource=admin")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.events_db
