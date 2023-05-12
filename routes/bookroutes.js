const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookcontroller');
const checkauth = require('../middleware/check-auth')
router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBook);
router.post('/books', checkauth, bookController.createBook);
router.put('/books/:id', checkauth, bookController.updateBook);
router.delete('/books/:id', checkauth, bookController.deleteBook);

module.exports = router;