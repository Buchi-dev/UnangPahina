const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const config = require('../config');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRY
        });

        // Publish user created event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.USER_CREATED,
            Buffer.from(JSON.stringify(user))
        );

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRY
        });

        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    res.json(req.user);
});

// Update user profile
router.put('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        const updatedUser = await req.user.save();

        // Publish user updated event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.USER_UPDATED,
            Buffer.from(JSON.stringify(updatedUser))
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 