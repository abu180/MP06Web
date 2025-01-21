const { getAllProducts, getProductById, addProductValues } = require('./ProductsModel');


async function getProducts(req, res) {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch(error) {
        console.error("Error al obtener los productos", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
}


async function getProduct(req, res) {
    const { id } = req.params;
    try {
        const product = await getProductById(id);
        res.json(product);
    } catch(error) {
        res.status(500).json({error: 'Error al obtener el producto'});
    }
}


async function addProduct(req, res) {
    const { ProductName, UnitPrice, Quantity, UnitsOnOrder } = req.body;

    try {
        const newProduct = await addProductValues({
            ProductName,
            UnitPrice,
            Quantity,
            UnitsOnOrder,
        });
        res.status(201).json(newProduct);
    } catch(error) {
        res.status(500).json({error: 'Error al añadir el producto, l'});
    };
};


module.exports = {
    getProducts,
    getProduct,
    addProduct,
}