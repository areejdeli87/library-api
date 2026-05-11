const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true },
  genre: {
    type: String,
    enum: ['roman', 'sci-fi', 'histoire', 'technique', 'autre']
  },
  available: { type: Boolean, default: true },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: { type: Number }
});

// Index sur isbn pour optimiser les recherches
bookSchema.index({ isbn: 1 });

module.exports = mongoose.model('Book', bookSchema);