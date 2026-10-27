import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        jwt.verify(token, jwtSecret);
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authenticateToken;