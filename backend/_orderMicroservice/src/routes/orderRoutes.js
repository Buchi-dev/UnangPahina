const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const config = require('../config');

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        const newOrder = await order.save();

        // Publish order created event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.ORDER_CREATED,
            Buffer.from(JSON.stringify(newOrder))
        );

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!Object.values(config.ORDER_STATUS).includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        // Publish order status changed event
        global.channel.publish(
            config.EXCHANGE_NAME,
            config.ROUTING_KEYS.ORDER_STATUS_CHANGED,
            Buffer.from(JSON.stringify(updatedOrder))
        );

        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all orders (admin only)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 