import { useState, useEffect } from 'react';

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Samsung Galaxy S26 512GB", system: "Android", price: 4599.00 },
  { id: 2, name: "Google Pixel 10 5G 12/128GB", system: "Android", price: 2499.00 },
  { id: 3, name: "Motorola edge 70 5G 12/512GB", system: "Android", price: 2599.00 },
  { id: 4, name: "Samsung Galaxy A37 5G 6/128GB", system: "Android", price: 1499.00 },
  { id: 5, name: "Google Pixel 11 5G 12/256GB", system: "Android", price: 3199.00 },
  { id: 6, name: "iPhone 18 Pro 256GB", system: "iOS", price: 6299.00 },
  { id: 7, name: "iPhone 17 Pro 25GB", system: "iOS", price: 5399.00 },
  { id: 8, name: "iPhone 17 256GB", system: "iOS", price: 3599.00 },
  { id: 9, name: "iPhone Duo 512GB", system: "iOS", price: 10499.00 },
  { id: 10, name: "iPhone Air 256", system: "iOS", price: 3499.00 }
];

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {
      });
  }, []);

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.system.toLowerCase() === filter.toLowerCase());

  const countAll = products.length;
  const countAndroid = products.filter(p => p.system.toLowerCase() === 'android').length;
  const countIOS = products.filter(p => p.system.toLowerCase() === 'ios').length;

  // Widok po kliknięciu w telefon:
  if (selectedProduct) {
    return (
      <div style={{ padding: 20, fontFamily: 'Times New Roman, serif' }}>
        <p>
          <a href="#" onClick={(e) => { e.preventDefault(); setSelectedProduct(null); }}>
            &lt;-- POWRÓT STRONA GŁÓWNA
          </a>
        </p>
        <hr />
        <div>
          <img 
            src="/karta.jpg" 
            alt="Makieta podstrony" 
            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #000' }} 
          />
        </div>
      </div>
    );
  }

  // strona glowna tabela + wizualizacja przyszłego wyglądu
  return (
    <div style={{ padding: 20, fontFamily: 'Times New Roman, serif', color: '#000' }}>
      <h1>Sklep GSM</h1>
      <hr />

      <p>
        <b>Kategoria:</b>{' '}
        [<a href="#" onClick={(e) => { e.preventDefault(); setFilter('all'); }}>Wszystkie ({countAll})</a>]{' '}
        [<a href="#" onClick={(e) => { e.preventDefault(); setFilter('Android'); }}>Android ({countAndroid})</a>]{' '}
        [<a href="#" onClick={(e) => { e.preventDefault(); setFilter('iOS'); }}>iOS ({countIOS})</a>]
      </p>

      <table width="100%" border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa telefonu</th>
            <th>System operacyjny</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((item) => (
            <tr key={item.id}>
              <td align="center">{item.id}</td>
              <td>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setSelectedProduct(item); }}
                >
                  <b>{item.name}</b>
                </a>
              </td>
              <td align="center">{item.system}</td>
              <td align="right">{item.price.toFixed(2)} PLN</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <hr />
      <br />

      <h3>Wizualizacja docelowego wyglądu strony:</h3>
      <div>
        <img 
          src="/glowna.jpg" 
          style={{ maxWidth: '800px', width: '100%', height: 'auto', border: '1px solid #000' }} 
        />
      </div>
    </div>
  );
}