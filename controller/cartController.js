const { db } = require('../queries.js');

const createcart = async (req, res) => {
    try {
        const { qty = 0 } = req.body;
        const { userid, productid } = req.query;
        if (!userid || !productid)
            res.status(400).json({ message: 'UserId and ProductId Required!!', success: false });

        await db.query(`INSERT INTO cart(user_id, product_id, qty) VALUES($1,$2,$3)`, [
            userid,
            productid,
            qty,
        ]);

        res.status(201).json({ message: 'Added To cart', success: true });
    } catch (err) {
        res.status(200).json({ message: err.message, success: false });
    }
};
const getcarts = async (req, res) => {
    try {
        const { userid } = req.params;

        const data = (await db.query(`SELECT * FROM cart WHERE user_id= $1`, [userid])).rows;
        res.status(200).json({ message: 'Cart data from userid ', data, success: false });
    } catch (err) {
        res.status(200).json({ message: err.message, success: false });
    }
};
const updatecart = async (req, res) => {
    try {
        const { id } = req.params;
        const { qty = 0 } = req.body;
        if (!id) res.status(400).json({ message: 'cart Data not Found...', success: false });

        const data = (await db.query(`UPDATE cart SET qty=$1 WHERE id=$2`, [qty, id])).rows;
        res.status(200).json({ message: 'Cart updated success full...', data, success: true });
    } catch (err) {
        res.status(200).json({ message: err.message, success: false });
    }
};

module.exports = {
    createcart,
    getcarts,
    updatecart,
};
