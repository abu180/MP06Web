const { getProductById } = require('./ProductsModel');

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
    getProduct,
}