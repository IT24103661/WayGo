const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    tourist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tourName: {
        type: String,
        required: true,
        default: 'General Tour'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true
    },
    helpful: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
