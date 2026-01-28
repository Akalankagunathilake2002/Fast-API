from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import database_models
from models import Vehicle
from database import engine, session  # session = sessionmaker factory (SessionLocal)

app = FastAPI(title="AK Fast Track Vehicles")

# ✅ CORS (needed for React localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
database_models.Base.metadata.create_all(bind=engine)

# Seed data (only if table is empty)
seed_vehicles = [
    Vehicle(id=1, name="Car", description="A fast car", price=20000, quantity=5),
    Vehicle(id=2, name="Bike", description="A mountain bike", price=1500, quantity=10),
    Vehicle(id=3, name="Truck", description="A large truck", price=30000, quantity=2),
    Vehicle(id=4, name="Bus", description="A city bus", price=50000, quantity=3),
    Vehicle(id=5, name="Van", description="A spacious van", price=25000, quantity=4),
]

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = session()
    try:
        count = db.query(database_models.Vehicle).count()
        if count == 0:
            for v in seed_vehicles:
                db.add(database_models.Vehicle(**v.model_dump()))
            db.commit()
    finally:
        db.close()

init_db()

@app.get("/")
def greet():
    return {"message": "Hello, welcome to AK Fast Track Vehicles API 🚀"}

@app.get("/vehicles")
def get_all_vehicles(db: Session = Depends(get_db)):
    return db.query(database_models.Vehicle).all()

@app.get("/vehicles/{vehicle_id}")
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    db_vehicle = (
        db.query(database_models.Vehicle)
        .filter(database_models.Vehicle.id == vehicle_id)
        .first()
    )
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle

@app.post("/vehicles")
def add_vehicle(vehicle: Vehicle, db: Session = Depends(get_db)):
    # Prevent duplicate ID
    exists = (
        db.query(database_models.Vehicle)
        .filter(database_models.Vehicle.id == vehicle.id)
        .first()
    )
    if exists:
        raise HTTPException(status_code=400, detail="Vehicle ID already exists")

    db_vehicle = database_models.Vehicle(**vehicle.model_dump())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@app.put("/vehicles/{vehicle_id}")
def update_vehicle(vehicle_id: int, vehicle: Vehicle, db: Session = Depends(get_db)):
    db_vehicle = (
        db.query(database_models.Vehicle)
        .filter(database_models.Vehicle.id == vehicle_id)
        .first()
    )
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db_vehicle.name = vehicle.name
    db_vehicle.description = vehicle.description
    db_vehicle.price = vehicle.price
    db_vehicle.quantity = vehicle.quantity

    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@app.delete("/vehicles/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    db_vehicle = (
        db.query(database_models.Vehicle)
        .filter(database_models.Vehicle.id == vehicle_id)
        .first()
    )
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(db_vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}
