import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../src/config/db';

const authRoute = Router();


authRoute.post('/signup', async (req, res) => {
    //assume name,email,password is coming from req body
    const { name, email, password } = req.body

    //do a server side validation before interacting with db
    //if name is a string 
    //if email is of correct format
    //if password met the criteria-i need 6 digits
    if (typeof name != 'string' || typeof email != 'string' || typeof password != 'string') {
        // ideally req body comes asa string right ?do i really need to check again?
        //  invalid input
        return res.status(400).json({ error: "invalid input" })
    }
    //how do i check fromat of email??? and password character crietria
    //invalid input if anything is missing
    //are tehse empty checks not amd ein client?
    //still do i need in server?
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim().length || !email.trim().length || !password.trim().length) {
        return res.status(400).json({ error: 'invalid request' })
    }

    if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }
    if (password.length < 8) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long'
        });
    }
    try {
        const userAlreadyExists = await pool.query(
            `SELECT id FROM users WHERE email = $1`, [normalizedEmail]
        )
        if (userAlreadyExists.rows.length) {
            return res.status(409).json({ message: "conflict" })
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const normalisedName = name.trim();
        const createdUser = await pool.query(
            `INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id`,
            [normalisedName, normalizedEmail, hashedPassword]
        )
        return res.status(201).json({ message: `${createdUser.rows[0].id}` })
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        ) {
            return res.status(409).json({
                message: 'An account with this email already exists'
            });
        }
        return res.status(500).json({ message: "db error" })
    }
    //that is all i belive coems under server side validation

    //next if everything passess
    //do db intercation verify if email alreday exists in db?
    //is email the main column for checking ?ye si belive based on blow point
    //in db we have ids but from clinet we wont get ids crct??
    //SELECT email FROM users where id = $1 through parameterised inputs
    //if (result.rows.length)
    //{ email alreday exists
    //dont proceed
    //}else insret inte user table but befor ethta
    //us ebcypt to has password
    //then insert
    //if any db error shpw

    //amy reasoning iam still missing  befor eactual impleenation

})
authRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (typeof email != 'string' || typeof password != 'string') {
        // ideally req body comes asa string right ?do i really need to check again?
        //  invalid input
        return res.status(400).json({ error: "invalid input" })
    }
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email.trim().length || !password.trim().length) {
    //     return res.status(400).json({ error: 'invalid request' })
    // }
    //this dont require crct it is for signup

    if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }

    // if (password.length < 8) {
    //     return res.status(400).json({
    //         message: 'Password must be at least 8 characters long'
    //     });
    // }
    //client will handle this;
    try {
        //verify if user email exists or not if yes verify if password macthes
        const userExists = await pool.query(
            `SELECT id,password FROM users WHERE email = $1`, [normalizedEmail]
        )

        if (userExists.rows.length == 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = userExists.rows[0];

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured');
        }
        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: '15m' }

        )
        return res.status(200).json({
            message: "login successful",
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
})
export default authRoute;