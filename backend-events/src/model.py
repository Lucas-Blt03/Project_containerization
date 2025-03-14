from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Event(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    location: str
    organizer_id: str
    status: str
