import { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Samsung Galaxy S26 512GB", system: "Android", price: 4599.00, ram: 12, storage: 512 },
  { id: 2, name: "Google Pixel 10 5G 12/128GB", system: "Android", price: 2499.00, ram: 12, storage: 128 },
  { id: 3, name: "Motorola edge 70 5G 12/512GB", system: "Android", price: 2599.00, ram: 12, storage: 512 },
  { id: 4, name: "Samsung Galaxy A37 5G 6/128GB", system: "Android", price: 1499.00, ram: 6, storage: 128 },
  { id: 5, name: "Google Pixel 11 5G 12/256GB", system: "Android", price: 3199.00, ram: 12, storage: 256 },
  { id: 6, name: "iPhone 18 Pro 256GB", system: "iOS", price: 6299.00, ram: 12, storage: 256 },
  { id: 7, name: "iPhone 17 Pro 256GB", system: "iOS", price: 5399.00, ram: 12, storage: 256 },
  { id: 8, name: "iPhone 17 256GB", system: "iOS", price: 3599.00, ram: 8, storage: 256 },
  { id: 9, name: "iPhone Duo 512GB", system: "iOS", price: 10499.00, ram: 12, storage: 512 },
  { id: 10, name: "iPhone Air 256GB", system: "iOS", price: 3499.00, ram: 12, storage: 256 }
];

function Price({ value }) {
  const [whole, cents] = value.toFixed(2).split('.');
  return (
    <div className="price">
      {Number(whole).toLocaleString('pl-PL')}
      <sup>{cents}</sup> zł
    </div>
  );
}

function PhoneImage({ item }) {
  if (item.image) {
    return <img src={item.image} alt={item.name} />;
  }
  return <div className="phone-art" aria-hidden="true" />;
}

function ProductCard({ item, liked, compared, onLike, onCompare, onOpen }) {
  return (
    <article className="card">
      <div className="card-main">
        <div className="card-image" onClick={onOpen}>
          <PhoneImage item={item} />
        </div>

        <div className="card-info">
          <div className="card-title-row">
            <h2>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpen(); }}>
                {item.name}
              </a>
            </h2>
            <button
              className={`heart ${liked ? 'active' : ''}`}
              onClick={onLike}
              aria-label={liked ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              aria-pressed={liked}
            >
              {liked ? '♥' : '♡'}
            </button>
          </div>

          <ul className="specs">
            <li>System: <b>{item.system}</b></li>
            <li>Pamięć RAM: <b>{item.ram} GB</b></li>
            <li>Pamięć wbudowana: <b>{item.storage} GB</b></li>
          </ul>

          <label className="compare">
            <input type="checkbox" checked={compared} onChange={onCompare} />
            Porównaj
          </label>
        </div>
      </div>

      <div className="card-buy">
        <Price value={item.price} />
      </div>
    </article>
  );
}

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [allProducts, setAllProducts] = useState(DEFAULT_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [storageFilter, setStorageFilter] = useState([]);
  const [ramFilter, setRamFilter] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [liked, setLiked] = useState([]);
  const [compared, setCompared] = useState([]);

  // Pobranie pełnej listy na start 
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(() => {});
  }, []);

  // Pobieranie przefiltrowanych produktów z bazy przy zmianie wyszukiwania lub filtrów
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim() !== '') params.append('search', search.trim());
    if (filter !== 'all') params.append('system', filter);
    if (sort !== 'default') params.append('sort', sort);
    storageFilter.forEach(s => params.append('storage', s));
    ramFilter.forEach(r => params.append('ram', r));

    fetch(`http://127.0.0.1:8000/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, [search, filter, sort, storageFilter, ramFilter]);

  const storageOptions = [...new Set(allProducts.map(p => Number(p.storage)))].sort((a, b) => b - a);
  const ramOptions = [...new Set(allProducts.map(p => Number(p.ram)))].sort((a, b) => b - a);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

  const countAll = allProducts.length;
  const countAndroid = allProducts.filter(p => p.system.toLowerCase() === 'android').length;
  const countIOS = allProducts.filter(p => p.system.toLowerCase() === 'ios').length;

  const visible = products;

  // Widok po kliknięciu w telefon
  if (selectedProduct) {
    return (
      <div className="page">
        <header className="topbar">
          <span className="logo">Sklep GSM</span>
        </header>
        <main className="container">
          <button className="back" onClick={() => setSelectedProduct(null)}>
            ← Wróć do listy
          </button>
          <h1 className="page-title">{selectedProduct.name}</h1>
          <img className="mockup" src="/karta.jpg" alt="Makieta podstrony produktu" />
        </main>
      </div>
    );
  }

  const chips = [
    { key: 'all', label: `Wszystkie (${countAll})` },
    { key: 'Android', label: `Android (${countAndroid})` },
    { key: 'iOS', label: `iOS (${countIOS})` },
  ];

  return (
    <div className="page">
      <header className="topbar">
        <span className="logo">Sklep GSM</span>
      </header>

      <main className="container">
        <h1 className="page-title">Smartfony</h1>

        <input
          type="text"
          className="search-input"
          placeholder="Szukaj telefonu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #2e2e32',
            background: '#18181b',
            color: '#fff',
            marginBottom: '14px'
          }}
        />

        <div className="toolbar">
          <div className="chips">
            {chips.map(c => (
              <button
                key={c.key}
                className={`chip ${filter.toLowerCase() === c.key.toLowerCase() ? 'active' : ''}`}
                onClick={() => setFilter(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sortuj: domyślnie</option>
            <option value="asc">Cena: od najniższej</option>
            <option value="desc">Cena: od najwyższej</option>
          </select>
        </div>

        <details className="filters">
          <summary>Filtry</summary>

          <details className="filter-group" open>
            <summary>Pamięć wbudowana</summary>
            {storageOptions.map(v => (
              <label key={v}>
                <input
                  type="checkbox"
                  checked={storageFilter.includes(v)}
                  onChange={() => toggle(storageFilter, setStorageFilter, v)}
                />
                {v} GB
              </label>
            ))}
          </details>

          <details className="filter-group" open>
            <summary>Pamięć RAM</summary>
            {ramOptions.map(v => (
              <label key={v}>
                <input
                  type="checkbox"
                  checked={ramFilter.includes(v)}
                  onChange={() => toggle(ramFilter, setRamFilter, v)}
                />
                {v} GB
              </label>
            ))}
          </details>
        </details>

        <section className="list">
          {visible.length === 0 && <p className="empty">Brak telefonów dla wybranych filtrów.</p>}
          {visible.map(item => (
            <ProductCard
              key={item.id}
              item={item}
              liked={liked.includes(item.id)}
              compared={compared.includes(item.id)}
              onLike={() => toggle(liked, setLiked, item.id)}
              onCompare={() => toggle(compared, setCompared, item.id)}
              onOpen={() => setSelectedProduct(item)}
            />
          ))}
        </section>

      </main>
    </div>
  );
}