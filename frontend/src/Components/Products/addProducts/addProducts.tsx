import './addProducts.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const AddProduct: React.FC = () => {
    const [productName, setProductName] = useState<string>('');
    const [unitPrice, setUnitPrice] = useState<string>('');
    const [quantity, setQuanity] = useState<string>('');
    const [unitsOnOrder, setUnitsOnOrder] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://localhost:8000/Products/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName, unitPrice, quantity, unitsOnOrder }),
            });

            if(!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            setSuccess(true);
            setProductName('');
            setUnitPrice('');
            setQuanity('');
            setUnitsOnOrder('');

        } catch(error: unknown) {
            if(error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error desconocido');
            }
        }
    }


    return (
        <div>
            <h2>Agregar Producto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name:</label>
                    <input 
                        type='text'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Unit Price</label>
                    <input 
                        type='text'
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Quantity</label>
                    <input 
                        type='text'
                        value={quantity}
                        onChange={(e) => setQuanity(e.target.value)}
                    />
                </div>
                <div>
                    <label>Units On Order</label>
                    <input 
                        type='text'
                        value={unitsOnOrder}
                        onChange={(e) => setUnitsOnOrder(e.target.value)}
                    />
                </div>

                <button type='submit'>ADD</button>
                <Link to="/Products">
                    <button>BACK</button>
                </Link>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Producto agreado correctamente</p>}
        </div>
    );
}

export default AddProduct;