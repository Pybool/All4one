const mongoose = require('mongoose');

// Define a Mongoose schema for the message fields
const blogs = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    blogItems:[],

    createdAt: {
        type: Date,
        required: true
    }
});

// Create a Mongoose model using the schema
const Blogs = mongoose.model('Blogs', blogs);

module.exports = Blogs;
