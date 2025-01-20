const { getAllProducts, getProductById } = require('./ProductsModel');


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

module.exports = {
    getProducts,
    getProduct,
}