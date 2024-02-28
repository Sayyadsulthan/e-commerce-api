const { json } = require('body-parser');
const { db } = require('../queries.js');

const createProducts = async (req, res) => {
    try {
        const { categoryId } = req.query;

        let { price = 0, title, description, availability = true } = req.body;
        if (!categoryId || !title || !description || price === 0)
            return res.status(400).json({
                message:
                    'Some fields are required to create Product \n eg: price = 0, title="sbc", description="xyz", availability=true',
                success: false,
            });
        price = Number(Number(price).toFixed(2));
        await db.query(
            `
        INSERT INTO products (category_id, title, price, description, availability)
        VALUES ($1,$2,$3,$4,$5)
        `,
            [categoryId, title, price, description, availability]
        );

        res.status(200).json({ message: 'Product created successfull...', success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

const getProducts = async (req, res) => {
    try {
        const { catogory } = req.query;

        if (catogory) {
            const data = (
                await db.query(
                    'SELECT p.product_id,p.title,p.price,p.description,p.availability, c.name as category FROM products as p  JOIN category as c ON p.category_id = c.id WHERE c.name =$1 LIMIT 50',
                    [catogory]
                )
            ).rows;
            return res
                .status(200)
                .json({ message: 'List of Products on Category', data, success: true });
        }

        const data = (
            await db.query(
                'SELECT p.product_id, p.title, p.price, p.description, p.availability, c.name as category FROM products as p  JOIN  category as c ON p.category_id = c.id  LIMIT 50'
            )
        ).rows;
        return res.status(200).json({ message: 'List of Products', data, success: true });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: err.message, success: false });
    }
};

const getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product must have id', success: false });
        }

        const data = (await db.query('SELECT * FROM products WHERE product_id=$1', [id])).rows;
        return res.status(200).json({ message: 'Product found', data: data[0], success: true });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ message: err.message, success: false });
    }
};

const updateProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, title, price, description, availability } = req.body;

        const categoryData = (await db.query(`SELECT id FROM category WHERE name= ${category}`))
            .rows;
        let query = `UPDATE products SET `;
        // first find the caregory name from category table
        if (category && categoryData[0]) query += ` category_id = ${categoryData[0].id}`;

        if (title) query += ` title = ${title} `;

        if (price) query += ` price = ${price} `;

        if (description) query += ` description = ${description} `;

        if (availability) query += ` availability ${availability} `;

        query += `WHERE product_id = ${id}`;
        await db.query(query);

        res.status(200).json({ message: 'Product data updated successfull...', success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

module.exports = {
    createProducts,
    getProducts,
    getOneProduct,
    updateProducts,
};
