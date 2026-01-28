# AK Fast Track Vehicles 🚗⚡
A full-stack CRUD application built with **FastAPI + PostgreSQL (SQLAlchemy)** and a **React** frontend to manage vehicle records (create, view, update, delete).

## Features
- ✅ FastAPI REST API (CRUD)
- ✅ PostgreSQL database integration
- ✅ SQLAlchemy ORM models + table creation
- ✅ DB seed data (adds sample vehicles if table is empty)
- ✅ React dashboard UI (search, sort, add/edit/delete)
- ✅ Clean API testing via Swagger UI (`/docs`)

---

## Tech Stack
**Backend**
- FastAPI
- SQLAlchemy
- PostgreSQL
- psycopg2-binary

**Frontend**
- React
- Axios

---

## Project Structure
Fast-Api/
├─ main.py
├─ database.py
├─ database_models.py
├─ models.py
├─ frontend/
│ ├─ src/
│ ├─ package.json
│ └─ package-lock.json
└─ .gitignore


---

## Setup & Run (Backend)
> Make sure PostgreSQL is running and the database is created (example DB name: `fast-api`).

### 1) Create & activate virtual environment
```bash
python3 -m venv myenv
source myenv/bin/activate
2) Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary
3) Update database URL
In database.py, confirm:

postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/fast-api
4) Run the API
uvicorn main:app --reload
API will run at:

http://127.0.0.1:8000
Swagger docs:

http://127.0.0.1:8000/docs

Setup & Run (Frontend)
Open a new terminal:

cd frontend
npm install
npm start
Frontend runs at:

http://localhost:3000

