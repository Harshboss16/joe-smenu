import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'joes_menu_data';
const DELIVERY_CHARGE = 15;

function generateWhatsAppUrl(number, message) {
  const base = "https://wa.me/";
  const phone = number.replace(/[^0-9]/g, '');
  return `${base}${phone}?text=${encodeURIComponent(message)}`;
}

export default function Customer() {
  const [data, setData] = useState({
    whatsappNumber: '+971552740061',
    promoActive: false,
    promoCodes: [],
    categories: [],
    items: [],
  });
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', location: '' });
  const [promoCode, setPromoCode] = useState('');
  const [promoValid, setPromoValid] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Validate promo code
  useEffect(() => {
    if (promoCode.trim() === '') {
      setPromoValid(null);
      return;
    }
    if (!data.promoActive) {
      setPromoValid(null);
      return;
    }
    const found = data.promoCodes.find(p => p.code.toLowerCase() === promoCode.trim().toLowerCase());
    setPromoValid(found || null);
  }, [promoCode, data.promoCodes, data.promoActive]);

  // Add item to cart
  const addToCart = (item) => {
    setCart(c => {
      const exists = c.find(ci => ci.id === item.id);
      if (exists) {
        return c.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...c, { ...item, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(c => c.filter(i => i.id !== id));
  };

  // Update quantity in cart
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCart(c => c.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  // Calculate totals
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discount = promoValid ? (subtotal * promoValid.discount) / 100 : 0;
  const total = subtotal - discount + DELIVERY_CHARGE;

  // Build order message
  const orderMessage = () => {
    let msg = "New order from Joe's Menu:%0A";
    msg += `Name: ${customer.name}%0A`;
    msg += `Phone: ${customer.phone}%0A`;
    msg += `Location: ${customer.location}%0A%0A`;
    msg += "Order details:%0A";
    cart.forEach(i => {
      msg += `- ${i.name} x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} AED%0A`;
    });
    msg += `%0ASubtotal: ${subtotal.toFixed(2)} AED%0A`;
    if (promoValid) {
      msg += `Promo (${promoValid.code}) discount: -${discount.toFixed(2)} AED%0A`;
    }
    msg += `Delivery charge: ${DELIVERY_CHARGE} AED%0A`;
    msg += `Total: ${total.toFixed(2)} AED%0A`;
    return msg;
  };

  // Place order handler
  const placeOrder = () => {
    if (!customer.name || !customer.phone || !customer.location) {
      alert('Please fill in all your details.');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    const url = generateWhatsAppUrl(data.whatsappNumber, orderMessage());
    window.open(url, '_blank');
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h1>Welcome to Joe's Menu</h1>
      <h2>Menu</h2>
      {data.categories.length === 0 && <p>No categories added yet.</p>}
      {data.categories.map(cat => (
        <div key={cat.id} style={{ marginBottom: 20 }}>
          <h3>{cat.name}</h3>
          <ul>
            {data.items.filter(i => i.categoryId === cat.id).map(item => (
              <li key={item.id}>
                {item.name} - {item.price.toFixed(2)} AED{' '}
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Cart</h2>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      {cart.length > 0 && (
        <table border="1" cellPadding="5" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price AED</th>
              <th>Total AED</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(({ id, name, price, quantity }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => updateQuantity(id, parseInt(e.target.value) || 1)}
                    style={{ width: 50 }}
                  />
                </td>
                <td>{price.toFixed(2)}</td>
                <td>{(price * quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => removeFromCart(id)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Customer Details</h3>
      <input
        placeholder="Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 5 }}
      />
      <input
        placeholder="Phone"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 5 }}
      />
      <input
        placeholder="Location"
        value={customer.location}
        onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 5 }}
      />

      {data.promoActive && (
        <>
          <h3>Promo Code</h3>
          <input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            style={{ width: '100%', marginBottom: 5, padding: 5 }}
          />
          {promoCode && (
            <p>
              {promoValid
                ? `Promo applied! ${promoValid.discount}% off.`
                : 'Invalid promo code.'}
            </p>
          )}
        </>
      )}

      <h3>
        Subtotal: {subtotal.toFixed(2)} AED
        <br />
        {promoValid && <>Discount: -{discount.toFixed(2)} AED<br /></>}
        Delivery Charge: {DELIVERY_CHARGE} AED
        <br />
        <b>Total: {total.toFixed(2)} AED</b>
      </h3>

      <button onClick={placeOrder} style={{ fontSize: 20, padding: '10px 20px' }}>
        Place Order (WhatsApp)
      </button>
    </div>
  );
}
