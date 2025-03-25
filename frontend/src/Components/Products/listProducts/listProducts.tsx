import './listProducts.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
    Product_id: string,
    ProductName: string,
    UnitPrice: string,
    Quantity: string,
    UnitsOnOrder: string,
    supplier_id: string
}

const ListProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    //const [success, setSuccess] = useState<boolean>(false);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/Products');

            if(!response.ok) {
                throw new Error('Error al obtener los productos');
            }

            const data: Product[] = await response.json();
            setProducts(data);
        } catch(error: unknown) {
            if(error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error desconocido');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    if (loading) {
        return <div>Loading Products...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div>
            <h1>PRODUCTS</h1>
            {error && <div>Error: {error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>PRODUCT NAME</th>
                        <th>UNIT PRICE</th>
                        <th>QUANTITY</th>
                        <th>UNITS ON ORDER</th>
                        <th>SUPPLIER ID</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.Product_id}>
                            <td>{product.Product_id}</td>
                            <td>{product.ProductName}</td>
                            <td>{product.UnitPrice}</td>
                            <td>{product.Quantity}</td>
                            <td>{product.UnitsOnOrder}</td>
                            <td>{product.supplier_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to={'/Products/addProduct'}>
                <button>ADD PRODUCT</button>
            </Link>
        </div>
    );
}

export default ListProducts;