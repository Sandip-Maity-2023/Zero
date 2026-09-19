const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'zero-hunger-development-secret';

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(_id).select('_id email role firstName lastName orgName registrationNo');

        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = requireAuth;
