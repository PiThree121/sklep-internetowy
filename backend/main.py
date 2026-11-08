from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCTS = [
    {"id": 1, "name": "Samsung Galaxy S26 512GB", "system": "Android", "price": 4599.00},
    {"id": 2, "name": "Google Pixel 10 5G 12/128GB", "system": "Android", "price": 2499.00},
    {"id": 3, "name": "Motorola edge 70 5G 12/512GB", "system": "Android", "price": 2599.00},
    {"id": 4, "name": "Samsung Galaxy A37 5G 6/128GB", "system": "Android", "price": 1499.00},
    {"id": 5, "name": "Google Pixel 11 5G 12/256GB", "system": "Android", "price": 3199.00},
    {"id": 6, "name": "iPhone 18 Pro 256GB", "system": "iOS", "price": 6299.00},
    {"id": 7, "name": "iPhone 17 Pro 25GB", "system": "iOS", "price": 5399.00},
    {"id": 8, "name": "iPhone 17 256GB", "system": "iOS", "price": 3599.00},
    {"id": 9, "name": "iPhone Duo 512GB", "system": "iOS", "price": 10499.00},
    {"id": 10, "name": "iPhone Air 256", "system": "iOS", "price": 3499.00}
]

@app.get("/api/products")
def get_products():
    return PRODUCTS