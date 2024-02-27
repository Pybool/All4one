const mongoose = require('mongoose');

// Define a Mongoose schema for the message fields
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// Create a Mongoose model using the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
