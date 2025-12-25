const mongoose = require('mongoose');
const { CATEGORIES, TAGS } = require('../utils/constants');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [
      {
        type: String,
        enum: CATEGORIES,
      },
    ],
    tags: [
      {
        type: String,
        enum: TAGS,
      },
    ],
    media: [
      {
        type: String, // Filenames
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We're using createdAt manually
  }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;


