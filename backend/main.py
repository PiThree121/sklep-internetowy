from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

import database
from database import ProductDB, SessionLocal

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# schemat przy dodawaniu i edycji telefonu 
class ProductCreate(BaseModel):
    name: str
    system: str
    ram: int
    storage: int
    price: float
    image: str = "/images/default.jpg"

# wypelnienie bazy telefonami startowymi przy pierwszym uruchomieniu 
@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    if db.query(ProductDB).count() == 0:
        initial_products = [
            ProductDB(name="Samsung Galaxy S26 512GB", system="Android", ram=12, storage=512, price=4599.00, image="/images/s26.jpg"),
            ProductDB(name="Google Pixel 10 5G 12/128GB", system="Android", ram=12, storage=128, price=2499.00, image="/images/pixel10.jpg"),
            ProductDB(name="Motorola edge 70 5G 12/512GB", system="Android", ram=12, storage=512, price=2599.00, image="/images/edge70.jpg"),
            ProductDB(name="Samsung Galaxy A37 5G 6/128GB", system="Android", ram=6, storage=128, price=1499.00, image="/images/a37.jpg"),
            ProductDB(name="Google Pixel 11 5G 12/256GB", system="Android", ram=12, storage=256, price=3199.00, image="/images/pixel11.jpg"),
            ProductDB(name="iPhone 18 Pro 256GB", system="iOS", ram=8, storage=256, price=6299.00, image="/images/iphone18pro.jpg"),
            ProductDB(name="iPhone 17 Pro 256GB", system="iOS", ram=8, storage=256, price=5399.00, image="/images/iphone17pro.jpg"),
            ProductDB(name="iPhone 17 256GB", system="iOS", ram=8, storage=256, price=3599.00, image="/images/iphone17.jpg"),
            ProductDB(name="iPhone Duo 512GB", system="iOS", ram=12, storage=512, price=10499.00, image="/images/iphoneduo.jpg"),
            ProductDB(name="iPhone Air 256", system="iOS", ram=8, storage=256, price=3499.00, image="/images/iphoneair.jpg"),
        ]
        db.add_all(initial_products)
        db.commit()
    db.close()

# pobieranie produktu z filtrami z SQLite
@app.get("/api/products")
def get_products(
    search: Optional[str] = None,
    system: Optional[str] = None,
    ram: Optional[List[int]] = Query(None),
    storage: Optional[List[int]] = Query(None),
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProductDB)

    if search:
        query = query.filter(ProductDB.name.ilike(f"%{search}%"))
    if system and system.lower() != "all":
        query = query.filter(ProductDB.system.ilike(system))
    if ram:
        query = query.filter(ProductDB.ram.in_(ram))
    if storage:
        query = query.filter(ProductDB.storage.in_(storage))

    if sort == "asc":
        query = query.order_by(ProductDB.price.asc())
    elif sort == "desc":
        query = query.order_by(ProductDB.price.desc())

    return query.all()

# endpoint zwracajacy opcje filtrow z bazy 
@app.get("/api/filters")
def get_filter_options(db: Session = Depends(get_db)):
    rams = sorted([r[0] for r in db.query(ProductDB.ram).distinct().all()], reverse=True)
    storages = sorted([s[0] for s in db.query(ProductDB.storage).distinct().all()], reverse=True)
    systems = [sys[0] for sys in db.query(ProductDB.system).distinct().all()]
    return {"systems": systems, "ram": rams, "storage": storages}

# dodanie produktu
@app.post("/api/products")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = ProductDB(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# edycja produktu
@app.put("/api/products/{product_id}")
def update_product(product_id: int, updated_data: ProductCreate, db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Nie znaleziono produktu")
    
    for key, value in updated_data.model_dump().items():
        setattr(product, key, value)
        
    db.commit()
    db.refresh(product)
    return product

# usuwanie produktu
@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Nie znaleziono produktu")
    db.delete(product)
    db.commit()
    return {"message": "Usunięto produkt"}