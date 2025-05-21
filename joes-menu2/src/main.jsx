import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Customer from './pages/Customer';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/*" element={<Customer />} />
    </Routes>
  </BrowserRouter>
);
