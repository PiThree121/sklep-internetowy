from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

# sklep.db w folderze backend
SQLALCHEMY_DATABASE_URL = "sqlite:///./sklep.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model tabeli w bazie sql
class ProductDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    system = Column(String)
    ram = Column(Integer)
    storage = Column(Integer)
    price = Column(Float)
    image = Column(String)