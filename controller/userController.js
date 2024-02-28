const { db } = require('../queries.js');
const jwt = require('jsonwebtoken');
const bcrpt = require('bcrypt');
require('dotenv').config();

const createUser = async (req, res) => {
    try {
        let { firstName, lastName = '', email, password } = req.body;

        if (!firstName || !email || !password) {
            return res.status(400).json({
                message:
                    'Please fill the required fields: \n firstName, lastName= ?option, email, password',
                success: false,
            });
        }

        const userData = (await db.query(`SELECT * FROM users WHERE email = $1`, [email])).rows;

        if (userData[0]) {
            console.log('user exist');
            res.status(409).json({ message: 'User account already Exist!!!', success: false });
            return;
        }
        const hashedPass = await bcrpt.hash(password.toString(), Number(process.env.SALT_ROUNDS));

        await db.query(
            `INSERT INTO users (first_name,last_name,email,password) VALUES ($1,$2,$3,$4)`,
            [firstName, lastName, email, hashedPass]
        );

        // await db.query(` DELETE FROM users WHERE email =$1 `, [email]);
        res.status(201).json({ message: 'User account created Successfull...', success: true });
    } catch (err) {
        console.log('err**, ', err.stack);
        res.status(500).json({ message: err.message, success: false });
    }
};

const getUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            res.status(400).json({ message: 'email and password required...', success: false });

        const user = (
            await db.query(
                `SELECT id,first_name,last_name,email, password FROM users WHERE email=$1  `,
                [email]
            )
        ).rows;
        if (!user[0]) return res.status(400).json({ message: 'User not found..', success: false });

        const isValidPassword = await bcrpt.compare(password.toString(), user[0].password);
        if (!isValidPassword)
            return res.status(401).json({ message: 'Invalid password', success: false });

        const token = jwt.sign(
            {
                name: user[0].name,
                email: user[0].email,
                firstName: user[0].first_name,
                lastName: user[0].last_name,
            },
            process.env.SECRET_KEY,
            { algorithm: 'HS256', expiresIn: 60 * 60 * 24 }
        );
        // expire 60 seconds, 60 minutes* 24 = 1day (1hr= 60min)
        res.status(200).json({ message: 'User Found', data: { token }, success: true });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ message: err.message, success: false });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.paramams;
        const { email, password, firstName, lastName } = req.body;
        if (!id) res.status(400).json({ message: 'Invalid User', success: false });

        const isValiduser = (await db.query(`select email, id FROM users WHERE id=$1`, [id]))
            .rows[0];

        if (!isValiduser) res.status(404).json({ message: 'User not found..', success: false });
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

module.exports = {
    getUser,
    createUser,
    updateUser,
};
