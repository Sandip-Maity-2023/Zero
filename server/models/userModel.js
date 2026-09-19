const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    orgName: {
        type: String,
        trim: true
    },
    registrationNo: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['organization', 'volunteer', 'donor', 'admin'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
