import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './Components/Menu/Menu';
import ListCustomers from './Components/Customers/listCustomers/listCustomers';
import AddCustomer from './Components/Customers/addCustomer/addCustomer';
import EditCustomer from './Components/Customers/editCustomer/editCustomer';
import ListProducts from './Components/Products/listProducts/listProducts';
import AddProduct from './Components/Products/addProducts/addProducts';


function App() {
  return (
    //ENRUTADOR
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<h2>Bienvenido a la Tienda de Ropa</h2>} />
        <Route path="/Customers" element={<ListCustomers />} />
        <Route path="/Customers/addCustomer" element={<AddCustomer />} />
        <Route path="/Customers/editCustomer/:id" element={<EditCustomer />} />
        <Route path="/Products" element={<ListProducts />} />
        <Route path="/Products/addProduct" element={<AddProduct />} />
        <Route path="/orders" element={<h2>Gestión de Pedidos</h2>} />
      </Routes>
    </Router>
  )
}

export default App
