import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'joes_menu_data';

function Admin() {
  const [data, setData] = useState({
    whatsappNumber: '+971552740061',
    promoActive: false,
    promoCodes: [],
    categories: [],
    items: [],
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Handlers for inputs
  const setWhatsApp = (e) => {
    setData(d => ({ ...d, whatsappNumber: e.target.value }));
  };

  const togglePromoActive = () => {
    setData(d => ({ ...d, promoActive: !d.promoActive }));
  };

  // Promo codes handlers
  const addPromoCode = () => {
    const code = prompt('Enter promo code (text):');
    const discount = prompt('Enter discount percentage (number):');
    if (code && discount && !isNaN(discount)) {
      setData(d => ({ ...d, promoCodes: [...d.promoCodes, { code: code.toUpperCase(), discount: Number(discount) }] }));
    }
  };

  const removePromoCode = (code) => {
    setData(d => ({ ...d, promoCodes: d.promoCodes.filter(p => p.code !== code) }));
  };

  // Category handlers
  const addCategory = () => {
    const name = prompt('Enter category name:');
    if (name) {
      setData(d => ({ ...d, categories: [...d.categories, { id: Date.now(), name }] }));
    }
  };

  const removeCategory = (id) => {
    if(window.confirm('Remove category and all its items?')) {
      setData(d => ({
        ...d,
        categories: d.categories.filter(c => c.id !== id),
        items: d.items.filter(i => i.categoryId !== id)
      }));
    }
  };

  // Items handlers
  const addItem = (categoryId) => {
    const name = prompt('Enter item name:');
    const price = prompt('Enter item price (number):');
    if (name && price && !isNaN(price)) {
      setData(d => ({ ...d, items: [...d.items, { id: Date.now(), categoryId, name, price: Number(price) }] }));
    }
  };

  const removeItem = (id) => {
    setData(d => ({ ...d, items: d.items.filter(i => i.id !== id) }));
  };

  // Update whatsapp number input validation
  const validNumber = (num) => /^\+?\d{7,15}$/.test(num);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h1>Admin Panel - Joe's Menu</h1>
      <div>
        <label>WhatsApp Number to receive orders:</label><br />
        <input
          type="text"
          value={data.whatsappNumber}
          onChange={setWhatsApp}
          style={{ width: '100%', padding: 5, fontSize: 18 }}
          placeholder="+971552740061"
        />
        {!validNumber(data.whatsappNumber) && <p style={{color:'red'}}>Enter valid WhatsApp number with country code</p>}
      </div>
      <hr />
      <div>
        <h2>Promo Codes</h2>
        <label>
          <input
            type="checkbox"
            checked={data.promoActive}
            onChange={togglePromoActive}
          /> Activate Promo Codes
        </label>
        <button onClick={addPromoCode} style={{ marginLeft: 10 }}>Add Promo Code</button>
        {data.promoCodes.length === 0 && <p>No promo codes added</p>}
        <ul>
          {data.promoCodes.map(p => (
            <li key={p.code}>
              {p.code} - {p.discount}% <button onClick={() => removePromoCode(p.code)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div>
        <h2>Categories and Items</h2>
        <button onClick={addCategory}>Add Category</button>
        {data.categories.length === 0 && <p>No categories added</p>}
        {data.categories.map(cat => (
          <div key={cat.id} style={{ border: '1px solid #ccc', marginTop: 10, padding: 10 }}>
            <h3>{cat.name} <button onClick={() => removeCategory(cat.id)} style={{color:'red'}}>Remove Category</button></h3>
            <button onClick={() => addItem(cat.id)}>Add Item</button>
            <ul>
              {data.items.filter(i => i.categoryId === cat.id).map(item => (
                <li key={item.id}>
                  {item.name} - {item.price.toFixed(2)} AED
                  <button onClick={() => removeItem(item.id)} style={{ marginLeft: 10, color: 'red' }}>Remove</button>
                </li>
              ))}
              {data.items.filter(i => i.categoryId === cat.id).length === 0 && <li>No items in this category</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
