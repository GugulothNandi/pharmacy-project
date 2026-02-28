from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database Connection Function
def get_connection():
    return sqlite3.connect("pharmacy.db")


# Create Table
conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS medicines(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
stock INTEGER,
price INTEGER,
status TEXT
)
""")

conn.commit()
conn.close()


# Model
class Medicine(BaseModel):
    name: str
    stock: int
    price: int
    status: str


# GET Medicines
@app.get("/medicines")
def get_medicines():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM medicines")
    data = cursor.fetchall()

    conn.close()

    result = []

    for row in data:

        result.append({
            "id": row[0],
            "name": row[1],
            "stock": row[2],
            "price": row[3],
            "status": row[4]
        })

    return result


# ADD Medicine
@app.post("/medicines")
def add_medicine(medicine: Medicine):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO medicines(name,stock,price,status) VALUES (?,?,?,?)",
        (medicine.name, medicine.stock, medicine.price, medicine.status)
    )

    conn.commit()
    conn.close()

    return {"message": "Medicine Added"}


# DASHBOARD
@app.get("/dashboard")
def dashboard():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM medicines")
    total_items = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM medicines WHERE stock < 10")
    low_stock = cursor.fetchone()[0]

    conn.close()

    return {
        "total_items": total_items,
        "low_stock": low_stock
    }



@app.put("/update/{id}")
def update_medicine(id: int, name: str, stock: int, price: int):

    conn = sqlite3.connect("pharmacy.db")
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE medicines SET name=?, stock=?, price=? WHERE id=?",
        (name, stock, price, id)
    )

    conn.commit()
    conn.close()

    return {"message": "Medicine Updated"}


# DELETE ALL DATA
@app.delete("/delete_all")
def delete_all():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM medicines")

    conn.commit()
    conn.close()

    return {"message": "All data deleted"}


# UPDATE Medicine
@app.put("/medicines/{medicine_id}")
def update_medicine(medicine_id: int, medicine: Medicine):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE medicines
    SET name=?, stock=?, price=?, status=?
    WHERE id=?
    """,
    (medicine.name, medicine.stock, medicine.price, medicine.status, medicine_id)
    )

    conn.commit()
    conn.close()

    return {"message": "Medicine Updated"}


# UPDATE STATUS
@app.put("/status/{medicine_id}")
def update_status(medicine_id: int, status: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE medicines SET status=? WHERE id=?",
        (status, medicine_id)
    )

    conn.commit()
    conn.close()

    return {"message": "Status Updated"}