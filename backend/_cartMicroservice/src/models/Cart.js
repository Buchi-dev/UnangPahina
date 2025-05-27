const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', function(next) {
    this.total = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 