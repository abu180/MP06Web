// src/Components/Menu/Menu.tsx
import './Menu.css';
import { Link } from 'react-router-dom';
import Perfil from '../Perfil/Perfil';

function Menu() {
  return (
    <nav className="menu">
      <div className="menu-left">
        <h1 className="menu-title">Panaderia</h1>
        <ul className="menu-links">
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/Customers">CUSTOMERS</Link>
          </li>
          <li>
            <Link to="/Users">USERS</Link>
          </li>
          <li>
            <Link to="/Products">PRODUCTS</Link>
          </li>
          <li>
            <Link to="/login">LOGIN</Link>
          </li>
          <li>
            <Link to="/logout">LOGOUT</Link>
          </li>
        </ul>
      </div>
      <div className="menu-right">
        <Perfil />
      </div>
    </nav>
  );
}

export default Menu;
