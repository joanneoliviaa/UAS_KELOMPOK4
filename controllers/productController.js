// controllers/productController.js
const Product = require('../model/product');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        const message = req.query.message || null;
        products.forEach(product => {

        });
        res.render('shop/indexshop', { products, activePage: '/indexshop', message });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving products');
    }
};



module.exports = { getAllProducts };