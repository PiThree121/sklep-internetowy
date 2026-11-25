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

function formatPrice(value) {
  const [whole, cents] = Number(value).toFixed(2).split('.');
  return `${Number(whole).toLocaleString('pl-PL')},${cents} zł`;
}

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

function ProductCard({ item, liked, compared, onLike, onCompare, onOpen, onAddToCart }) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

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

      <div
        className="card-buy"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        <Price value={item.price} />
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={handleAdd}
          style={{
            padding: '9px 14px',
            borderRadius: '8px',
            border: '1px solid #6366f1',
            background: justAdded ? '#16a34a' : '#4f46e5',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {justAdded ? 'Dodano ✓' : 'Dodaj do koszyka'}
        </button>
      </div>
    </article>
  );
}

function CartDrawer({ isOpen, onClose, cartItems, onChangeQty, onRemove, onClear }) {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <aside
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          background: '#141417',
          color: '#fff',
          borderLeft: '1px solid #2e2e32',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Koszyk</h2>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #3f3f46',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p style={{ color: '#a1a1aa' }}>Twój koszyk jest pusty.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map(({ item, qty }) => (
                <li
                  key={item.id}
                  style={{
                    border: '1px solid #27272a',
                    borderRadius: '10px',
                    padding: '12px',
                    background: '#1c1c21'
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '6px' }}>{item.name}</div>
                  <div style={{ color: '#d4d4d8', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {formatPrice(item.price * qty)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onChangeQty(item.id, qty - 1)}
                      style={{ padding: '2px 8px', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      onClick={() => onChangeQty(item.id, qty + 1)}
                      style={{ padding: '2px 8px', cursor: 'pointer' }}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      style={{
                        marginLeft: 'auto',
                        background: 'transparent',
                        border: 'none',
                        color: '#f87171',
                        cursor: 'pointer'
                      }}
                    >
                      Usuń
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ borderTop: '1px solid #2e2e32', paddingTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>
            <span>Razem:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #3f3f46',
                background: '#27272a',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Wyczyść koszyk
            </button>
          )}
        </div>
      </aside>
    </div>
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
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, entry) => sum + entry.qty, 0);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === product.id);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === product.id ? { ...entry, qty: entry.qty + 1 } : entry
        );
      }
      return [...prev, { item: product, qty: 1 }];
    });
  };

  const handleChangeQty = (productId, nextQty) => {
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((entry) => entry.item.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((entry) =>
        entry.item.id === productId ? { ...entry, qty: nextQty } : entry
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

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

  const renderTopbar = () => (
    <header
      className="topbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px'
      }}
    >
      <span className="logo">Sklep GSM</span>
      <button
        type="button"
        className="cart-btn"
        onClick={() => setCartOpen(true)}
        style={{
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid #3f3f46',
          background: '#18181b',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        🛒 Koszyk ({totalCartCount})
      </button>
    </header>
  );

  // Widok po kliknięciu w telefon
  if (selectedProduct) {
    return (
      <div className="page">
        {renderTopbar()}
        <main className="container">
          <button className="back" onClick={() => setSelectedProduct(null)}>
            ← Wróć do listy
          </button>
          <h1 className="page-title">{selectedProduct.name}</h1>
          <img className="mockup" src="/karta.jpg" alt="Makieta podstrony produktu" />
        </main>
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cart}
          onChangeQty={handleChangeQty}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
        />
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
      {renderTopbar()}

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
              onAddToCart={handleAddToCart}
            />
          ))}
        </section>
      </main>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
      />
    </div>
  );
}