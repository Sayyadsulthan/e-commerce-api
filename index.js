const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const {
    db,
    createTableCart,
    createTableCategories,
    createTableOrder,
    createTableProducts,
    createTableUser,
    createUpdateTimestampTrigger,
} = require('./queries.js');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

// app.use('/api', userController);
// app.use('/api/products', productsController);
// app.use('/api/order', orderController);

async function initializeTable() {
    await createTableUser();
    await createTableCart();
    await createTableCategories();
    await createTableProducts();
    await createTableOrder();
}
// initializeTable();

function dropAllTAble() {
    const tablesWithUpdatedAt = ['users', 'products', 'category', 'cart', 'orders'];
    tablesWithUpdatedAt.forEach(async (element) => {
        await db.query(`DROP TABLE IF EXISTS ${element}`);
    });
}
// dropAllTAble();

async function insertDefaultData() {
    try {
        fs.readFile('./data.json', 'utf-8', async (err, data) => {
            const Data = JSON.parse(data);
            const category = ["men's clothing", 'jewelery', 'electronics', "women's clothing"];
            await category.forEach(async (element) => {
                await db.query(
                    `INSERT INTO category(name,qty)
                    VALUES($1,$2)`,
                    [element, 0]
                );
                console.log(element + ' category data inserted...');
            });
            const categoryList = (await db.query(`SELECT * FROM category;`)).rows;
            // console.log('categories are: ', categoryList);
            // console.log(Data);
            await Data.forEach(async (val) => {
                const currentCategory = categoryList.filter((item) => item.name === val.category);
                const price = Number(Number(val.price).toFixed(2));
                await db.query(
                    `
                INSERT INTO products (category_id, title, price, description, availability)
                VALUES ($1,$2,$3,$4,$5)
                `,
                    [currentCategory[0].id, val.title, price, val.description, true]
                );
            });
        });
    } catch (err) {
        console.error(err.message);
    }
}

// insertDefaultData();

app.listen(PORT, () => {
    console.log('Server running on port: ', PORT);
});
