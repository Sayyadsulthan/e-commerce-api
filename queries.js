const { Client } = require('pg');
require('dotenv').config();

const db = new Client(process.env.DB_URL);

db.connect()
    .then(() => console.log('db connected...'))
    .catch((err) => console.log('error in connect to db \n', err));

const createTableUser = async () => {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    first_name VARCHAR(20),
                    last_name VARCHAR(20),
                    email VARCHAR(20),
                    password VARCHAR(10) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
        );
        console.log('Table created: users');
    } catch (err) {
        console.error('Error creating table users:', err);
    }
};

const createTableProducts = async () => {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS products (
                    product_id SERIAL PRIMARY KEY,
                    category_id INT,
                    title VARCHAR(255),
                    price NUMERIC(10,2),
                    description VARCHAR,
                    availability BOOLEAN,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
        );
        console.log('Table created: products');
    } catch (err) {
        console.error('Error creating table products:', err);
    }
};

const createTableCategories = async () => {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS category (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    qty INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
        );
        console.log('Table created: category');
    } catch (err) {
        console.error('Error creating table category:', err);
    }
};

const createTableCart = async () => {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS cart (
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id),
                    product_id INT REFERENCES products(product_id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
        );
        console.log('Table created: cart');
    } catch (err) {
        console.error('Error creating table cart:', err);
    }
};

const createTableOrder = async () => {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS orders (
                    order_id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id),
                    cart_id INT REFERENCES cart(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
        );
        console.log('Table created: orders');
    } catch (err) {
        console.error('Error creating table orders:', err);
    }
};

const createUpdateTimestampTrigger = async () => {
    try {
        // Create a trigger function to update updated_at timestamp on row update
        await db.query(`
        CREATE OR REPLACE FUNCTION update_timestamp_trigger()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                `);

        // Get a list of tables with an updated_at column
        const tablesWithUpdatedAt = ['users', 'products', 'category', 'cart', 'orders'];

        // Apply the trigger to each table
        for (const tableName of tablesWithUpdatedAt) {
            await db.query(`
            CREATE TRIGGER  ${tableName}_updated_at_trigger
            BEFORE UPDATE ON ${tableName}
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp_trigger();
            `);
        }

        console.log('Update timestamp triggers created successfully.');
    } catch (err) {
        console.error('Error creating update timestamp triggers:', err);
    }
};

// Call the function to create update timestamp triggers

module.exports = {
    db,
    createTableUser,
    createTableProducts,
    createTableCategories,
    createTableCart,
    createTableOrder,
    createUpdateTimestampTrigger,
};
