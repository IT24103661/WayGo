const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    make:  { type: String, required: true },
    model: { type: String, required: true },
    year:  { type: Number, required: true },
    type: {
        type: String,
        enum: ['Sedan', 'SUV', 'Van', 'Bus', 'Minivan', 'Luxury'],
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    color: { type: String },
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    managedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'Under Maintenance', 'Retired'],
        default: 'Available'
    },
    lastServiceDate: { type: Date, default: null },
    insuranceExpiry: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
