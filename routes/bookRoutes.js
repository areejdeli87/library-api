const express = require('express');
const router = express.Router();
const {
  getAllBooks, getBookById, createBook, updateBook, deleteBook
} = require('../controllers/bookController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation création livre
const bookValidation = [
  body('title').notEmpty().withMessage('Titre requis'),
  body('author').notEmpty().withMessage('Auteur requis'),
  body('isbn').notEmpty().withMessage('ISBN requis'),
  body('publishedAt')
    .isInt({ min: 1000, max: 9999 })
    .withMessage('Année invalide (4 chiffres)')
];

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', protect, bookValidation, createBook);
router.put('/:id', protect, restrictTo('admin'), updateBook);
router.delete('/:id', protect, restrictTo('admin'), deleteBook);

module.exports = router;