import React, { useState, useEffect } from 'react';

const ProductDescription: React.FC<{ Product_id: string }> = ({ Product_id }) => {
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const response = await fetch(`http://localhost:8000/Product/${Product_id}`);
            }
        }
    })
}

export default ProductDescription;