const pool = require('../model/db');

const getCartItems = async (req, res) => {
    const userId = req.session.userId; // Ambil userId dari session

    if (!userId) {
        return res.status(401).json({ message: 'User  not logged in' });
    }

    try {
        // Ambil semua item di cart untuk user ini dengan join ke tabel products
        const result = await pool.query(`
            SELECT c.*, p.name AS product_name, p.price AS product_price 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = $1`, [userId]);
        
        const cartItems = result.rows;

        // Hitung total harga
        let total = 0;

        // Menghitung total berdasarkan harga produk dan kuantitas
        for (const item of cartItems) {
            total += item.product_price * item.quantity; // Menghitung total
        }

        // Render view cart dengan cartItems dan total
        res.render('shop/cart', { cartItems, total});
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Error fetching cart items' });
    }
};

const updateCartItem = async (req, res) => {
    console.log('Update Cart Item:', req.params.productId, req.body.action);
    const productId = req.params.productId; // Ambil productId dari parameter
    const { action } = req.body; // Ambil action (increase/decrease) dari body

    try {
        const userId = req.session.userId; // Ambil userId dari session
        const item = await pool.query('SELECT * FROM cart WHERE product_id = $1 AND user_id = $2', [productId, userId]);

        if (item.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        let newQuantity = item.rows[0].quantity;

        if (action === 'increase') {
            newQuantity += 1;
        } else if (action === 'decrease') {
            newQuantity = Math.max(1, newQuantity - 1); // Pastikan quantity tidak kurang dari 1
        }

        await pool.query('UPDATE cart SET quantity = $1 WHERE product_id = $2 AND user_id = $3', [newQuantity, productId, userId]);

        res.redirect('/cart'); // Redirect kembali ke halaman cart
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Error updating cart item' });
    }
};

const deleteCartItem = async (req, res) => {
    const productId = req.params.productId; // Ambil productId dari parameter
    const userId = req.session.userId; // Ambil userId dari session

    if (!userId) {
        return res.status(401).json({ message: 'User  not logged in' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.redirect('/cart'); // Redirect kembali ke halaman cart
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Error deleting cart item' });
    }
};

const addItemToCart = async (req, res) => {
    const { productId } = req.body; // Ambil productId dari body
    const userId = req.session.userId; // Ambil userId dari session

    if (!userId) {
        return res.status(401).json({ message: 'User  not logged in' });
    }

    try {
        // Cek apakah item sudah ada di cart
        const existingItem = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if (existingItem.rowCount > 0) {
            // Jika item sudah ada, update quantity
            const newQuantity = existingItem.rows[0].quantity + 1;
            await pool.query(
                'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
                [newQuantity, userId, productId]
            );
        } else {
            // Jika item belum ada, tambahkan item baru ke cart
            await pool.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, productId, 1] // Set quantity ke 1 saat menambahkan item baru
            );
        }

        res.redirect('/indexshop'); // Redirect ke halaman cart setelah menambahkan
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart' });
    }
};

module.exports = {
    getCartItems,
    updateCartItem,
    deleteCartItem,
    addItemToCart
};