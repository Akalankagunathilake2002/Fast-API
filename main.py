from fastapi import FastAPI

from models import Vehicle;

app=FastAPI()


@app.get("/")
def greet():
    return"hello welcome to fast api"


vehicles=[
    Vehicle(id=1, name="Car", description="A fast car", price=20000, quantity=5),
    Vehicle(id=2, name="Bike", description="A mountain bike", price=1500, quantity=10),
    Vehicle(id=3, name="Truck", description="A large truck", price=30000, quantity=2),
    Vehicle(id=4, name="Bus", description="A city bus", price=50000, quantity=3),
    Vehicle(id=5, name="Van", description="A spacious van", price=25000, quantity=4)
]

@app.get("/vehicles")
def get_all_vehicles():
    return vehicles

@app.get("/vehicles/{vehicle_id}")
def get_vehicle(vehicle_id: int):
    for vehicle in vehicles:
        if vehicle.id == vehicle_id:
            return vehicle
    return {"error": "Vehicle not found"}

@app.post("/vehicles")
def add_vehicle(vehicle: Vehicle):
    vehicles.append(vehicle)
    return vehicle

@app.put("/vehicles/{vehicle_id}")
def update_vehicle(vehicle_id: int, Vehicle: Vehicle):
    for i in range(len(vehicles)):
        if vehicles[i].id == vehicle_id:
            vehicles[i] = Vehicle
            return Vehicle
    return {"error": "Vehicle not found"}


@app.delete("/vehicles/{vehicle_id}")
def delete_vehicle(vehicle_id: int):
    for i in range(len(vehicles)):
        if vehicles[i].id == vehicle_id:
            del vehicles[i]
            return {"message": "Vehicle deleted successfully"}
    return {"error": "Vehicle not found"}