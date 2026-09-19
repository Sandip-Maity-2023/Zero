const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'zero-hunger-development-secret';

const createToken = (_id) => {
    return jwt.sign({ _id }, JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res) => {
    const { firstName, lastName, orgName, registrationNo, email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    if (!['organization', 'volunteer', 'donor', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role selected' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            orgName,
            registrationNo,
            email,
            password: hashedPassword,
            role
        });

        const token = createToken(user._id);

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                orgName: user.orgName
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = createToken(user._id);

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                orgName: user.orgName
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const me = (req, res) => {
    res.status(200).json({ user: req.user });
};

module.exports = {
    signup,
    login,
    me
};
