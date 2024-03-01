const mongoose = require('mongoose');

// Define a Mongoose schema for the newsletter fields
const newsLetterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// Create a Mongoose model using the schema
const Newsletter = mongoose.model('Newsletter', newsLetterSchema);

module.exports = Newsletter;
