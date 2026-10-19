from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Sklep Internetowy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/products")
def get_products():
    return [
        {"id": 1, "name": "Nowoczesny T-Shirt", "price": 89.99, "description": "Wygodna koszulka.", "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"},
        {"id": 2, "name": "Eleganckie Buty", "price": 299.99, "description": "Lekkie buty.", "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"}
    ]