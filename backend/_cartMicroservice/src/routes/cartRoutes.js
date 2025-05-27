const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const config = require('../config');

// Get cart by user ID
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/:userId/items', async (req, res) => {
    try {
        const { bookId, title, price, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
        }

        // Check if item already exists
        const existingItem = cart.items.find(item => item.bookId.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ bookId, title, price, quantity });
        }

        const updatedCart = await cart.save();

        // Publish cart updated event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.CART_UPDATED,
            Buffer.from(JSON.stringify(updatedCart))
        );

        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update cart item quantity
router.put('/:userId/items/:bookId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.bookId.toString() === req.params.bookId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        const updatedCart = await cart.save();

        // Publish cart updated event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.CART_UPDATED,
            Buffer.from(JSON.stringify(updatedCart))
        );

        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/:userId/items/:bookId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.bookId.toString() !== req.params.bookId);
        const updatedCart = await cart.save();

        // Publish cart updated event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.CART_UPDATED,
            Buffer.from(JSON.stringify(updatedCart))
        );

        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Clear cart
router.delete('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        const updatedCart = await cart.save();

        // Publish cart updated event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.CART_UPDATED,
            Buffer.from(JSON.stringify(updatedCart))
        );

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Checkout cart
router.post('/:userId/checkout', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        if (cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Publish checkout event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.CART_CHECKED_OUT,
            Buffer.from(JSON.stringify(cart))
        );

        // Clear the cart after checkout
        cart.items = [];
        await cart.save();

        res.json({ message: 'Checkout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 