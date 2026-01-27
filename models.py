
from pydantic import BaseModel


class Vehicle(BaseModel):
    id: int
    name: str
    description: str
    price: int
    quantity: int
