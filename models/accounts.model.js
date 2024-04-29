const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: true
    },
    role: {
        type: String,
        default: 'USER',
        enum: ['USER', 'ADMIN', 'ROOT']
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// Create a Mongoose model using the schema
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
