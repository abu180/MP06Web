// App.tsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./Components/Menu/Menu";  
import ListCustomers from "./Components/Customers/listCustomers/listCustomers"; 
import EditCustomer from "./Components/Customers/editCustomer/editCustomer"; 
import ListCustomersRemove from "./Components/Customers/listCustomers/ListUsersRemove.tsx"; 
import AddCustomer from "./Components/Customers/addCustomer/addCustomer"; 
import ListProducts from "./Components/Products/listProducts/listProducts"; 
import AddProduct from "./Components/Products/addProducts/addProducts";  
import Login from "./Components/Login/SyncUp/SyncUp"; 
import SyncDown from "./Components/Login/SyncDown/SyncDown"; 
import { AuthProvider } from "./Components/Login/Auth/Auth"; 
import ListUsers from "./Components/Users/listUser/listUsers"; 
import EditUser from "./Components/Users/editUser/editUser"; 
import ListUsersRemove from "./Components/Users/listUser/listUsersRemove"; 
import MultiStepRegister from "./Components/Register/MultiStepRegister";  
import AddUserPerfil from "./Components/Users/addUser/addUserPerfil"; 

const Home = () => {
  return <h2>Bienvenido a la Panadería</h2>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<SyncDown />} />
          <Route path="/register" element={<MultiStepRegister />} />

          <Route path="/Customers" element={<ListCustomers />} />
          <Route path="/Customers/editCustomer/:id" element={<EditCustomer />} />
          <Route path="/Customers/addCustomer" element={<AddCustomer />} />
          {/* Ruta para ver clientes eliminados */}
          <Route path="/Customers/removed" element={<ListCustomersRemove />} />

          <Route path="/Products" element={<ListProducts />} />
          <Route path="/Products/addProduct" element={<AddProduct />} />
          <Route path="/orders" element={<h2>Gestión de Pedidos</h2>} />

          <Route path="/Users" element={<ListUsers />} />
          <Route path="/Users/editUser/:id" element={<EditUser />} />
          <Route path="/Users/deleted" element={<ListUsersRemove />} />
          {/* Nueva ruta para agregar usuarios desde el perfil */}
          <Route path="/Users/addUserPerfil" element={<AddUserPerfil />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
