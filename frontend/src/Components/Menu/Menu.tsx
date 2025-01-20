import './Menu.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
    return (
        <nav className='menu'>
            <h1 className="menu-title">Tienda Ropa</h1>
            <ul className="menu-links">
                <li>
                    <Link to="/">HOME</Link>
                </li>
                <li>
                    <Link to="/Customers">CUSTOMERS</Link>
                    <Link to="/Products">PRODUCTS</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Menu;