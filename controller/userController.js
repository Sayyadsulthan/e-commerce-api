const { db } = require('../queries.js');

const createUser = async (req, res) => {
    try {
        const { firstName, lastName = '', email, password } = req.body;

        if (!firstName || !email || !password) {
            res.status(400).json({
                message: 'Please fill the required fields: \n firstName, lastName, email, password',
                success: false,
            });
        }

        await db.query(
            `INSERT INTO users (first_name,last_name,email,password) VALUES ($1,$2,$3,$4)`,
            [firstName, lastName, email, password]
        );
        res.status(201).json({ message: 'User account created Successfull...', success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.paramams;
        const { email, password, firstName, lastName } = req.body;
        if (!id) res.status(400).json({ message: 'Invalid User', success: false });

        // adding the query accouding the data availability
        let query = `UPDATE users SET`;
        if (firstName) query += `first_name = ${firstName}`;
        if (lastName) query += `last_name = ${lastName}`;
        if (email) query += `email = ${email}`;
        if (password) query += `password = ${password}`;

        // updating the user on basis of id
        query += `WHERE id = ${id}`;
        await db.query(query);
        // if required then the sending the updated user data

        res.status(200).json({ message: 'User data Updated successfull...', success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

const getUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            res.status(400).json({ message: 'email and password required...' });

        const user = (
            await db.query(
                `SELECT id,first_name,last_name,email FROM users WHERE email=$1 and password=$2 `,
                [email, password]
            )
        ).rows;
        if (!user[0]) res.status(400).json({ message: 'User not found..', success: false });

        res.status(200).json({ message: 'User Found', data: user, success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

module.exports = {
    getUser,
    createUser,
    updateUser,
};
