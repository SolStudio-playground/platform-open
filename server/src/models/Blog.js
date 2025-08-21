const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    avatarUrl: {
        type: String,
    },
}, { _id: false });

const blogSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    publish: {
        type: Boolean,
    },
    content: {
        type: String,
        required: true
    },
    coverUrl: {
        type: String,
        required: true
    },
    metaTitle: {
        type: String,
        required: true
    },
    metaDescription: {
        type: String,
        required: true
    },
    metaKeywords: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: authorSchema,
        default: {
            name: 'Solstudio Team',
            avatarUrl: 'https://api.solstudio.so/uploads/parachute-ag-logo.png'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },


});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
