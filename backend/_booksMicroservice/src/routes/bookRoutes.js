const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const config = require('../config');

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search books by query
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Search in title, author, or description with case-insensitive search
        const books = await Book.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        });

        res.json(books);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get book by ID
router.get('/:id', async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }
        
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new book
router.post('/', async (req, res) => {
    try {
        // Validate required fields
        const { title, author, price, description, category } = req.body;
        
        if (!title || !author || price === undefined || !description || !category) {
            return res.status(400).json({ 
                message: 'Missing required fields. Title, author, price, description, and category are required.' 
            });
        }
        
        // Validate price is a non-negative number
        if (isNaN(Number(price)) || Number(price) < 0) {
            return res.status(400).json({ message: 'Price must be a valid non-negative number' });
        }
        
        // Validate stock if provided
        if (req.body.stock !== undefined && (isNaN(Number(req.body.stock)) || Number(req.body.stock) < 0)) {
            return res.status(400).json({ message: 'Stock must be a valid non-negative number' });
        }
        
        // Ensure numeric fields are stored as numbers
        req.body.price = Number(price);
        if (req.body.stock !== undefined) req.body.stock = Number(req.body.stock);
        
        const book = new Book(req.body);
        const newBook = await book.save();
        
        // Publish book created event
        if (global.channel) {
            try {
                global.channel.publish(
                    config.EXCHANGE_NAME,
                    config.ROUTING_KEYS.BOOK_CREATED,
                    Buffer.from(JSON.stringify(newBook))
                );
            } catch (publishError) {
                console.error('Failed to publish book creation event:', publishError);
                // Continue with response even if publishing fails
            }
        } else {
            console.warn('RabbitMQ channel not available, skipping event publication');
        }
        
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update book
router.put('/:id', async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }
        
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Validate price and stock if provided
        if (req.body.price !== undefined && (isNaN(Number(req.body.price)) || Number(req.body.price) < 0)) {
            return res.status(400).json({ message: 'Price must be a valid non-negative number' });
        }
        
        if (req.body.stock !== undefined && (isNaN(Number(req.body.stock)) || Number(req.body.stock) < 0)) {
            return res.status(400).json({ message: 'Stock must be a valid non-negative number' });
        }

        // Ensure numeric fields are stored as numbers
        if (req.body.price !== undefined) req.body.price = Number(req.body.price);
        if (req.body.stock !== undefined) req.body.stock = Number(req.body.stock);

        Object.assign(book, req.body);
        const updatedBook = await book.save();

        // Publish book updated event
        if (global.channel) {
            try {
                global.channel.publish(
                    config.EXCHANGE_NAME,
                    config.ROUTING_KEYS.BOOK_UPDATED,
                    Buffer.from(JSON.stringify(updatedBook))
                );
            } catch (publishError) {
                console.error('Failed to publish update event:', publishError);
                // Continue with response even if publishing fails
            }
        } else {
            console.warn('RabbitMQ channel not available, skipping event publication');
        }

        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete book
router.delete('/:id', async (req, res) => {
    try {
        // Validate ObjectId format to avoid CastError
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }
        
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        // Publish book deleted event
        if (global.channel) {
            try {
                global.channel.publish(
                    config.EXCHANGE_NAME,
                    config.ROUTING_KEYS.BOOK_UPDATED, // Reusing the update key, or you could add BOOK_DELETED to config
                    Buffer.from(JSON.stringify({ bookId: book._id, deleted: true }))
                );
            } catch (publishError) {
                console.error('Failed to publish delete event:', publishError);
                // Continue with response even if publishing fails
            }
        }
        
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update book stock
router.patch('/:id/stock', async (req, res) => {
    try {
        const { stock } = req.body;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        // Validate stock is a valid number
        if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({ message: 'Stock must be a valid non-negative number' });
        }

        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.stock = Number(stock);
        const updatedBook = await book.save();

        // Publish stock updated event
        if (global.channel) {
            try {
                global.channel.publish(
                    config.EXCHANGE_NAME,
                    config.ROUTING_KEYS.STOCK_UPDATED,
                    Buffer.from(JSON.stringify({ bookId: book._id, stock: Number(stock) }))
                );
            } catch (publishError) {
                console.error('Failed to publish stock update event:', publishError);
                // Continue with response even if publishing fails
            }
        } else {
            console.warn('RabbitMQ channel not available, skipping event publication');
        }

        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;