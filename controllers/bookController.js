const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// GET /api/books
exports.getAllBooks = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.available !== undefined)
      filter.available = req.query.available === 'true';

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find(filter).skip(skip).limit(limit);
    res.status(200).json({ results: books.length, page, data: books });
  } catch (err) {
    next(err);
  }
};

// GET /api/books/:id
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// POST /api/books
exports.createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const book = await Book.create({ ...req.body, addedBy: req.user.id });
    res.status(201).json(book);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'ISBN déjà existant' });
    next(err);
  }
};

// PUT /api/books/:id (admin)
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/books/:id (admin)
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};