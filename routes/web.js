const express = require('express')
const router = express.Router()
const BookController = require('../controllers/BookController')
const { requireAuth } = require('../middlewares/auth')

// Semua rute di bawah ini wajib login.
router.use(requireAuth)

// Dashboard
// di bagian atas routes/web.js:
const { Book, Category } = require('../models')

// ganti rute dashboard menjadi async + kirim jumlah data:
router.get('/', async (req, res, next) => {
  try {
    const [totalBuku, totalKategori] = await Promise.all([
      Book.count(),
      Category.count()
    ])
    res.render('dashboard', { title: 'Dashboard', totalBuku, totalKategori })
  } catch (err) {
    next(err)
  }
})

// CRUD Buku
router.get('/books', BookController.index)
router.get('/books/create', BookController.create)
router.post('/books/create', BookController.store)
router.get('/books/:id/edit', BookController.edit)
router.post('/books/:id/edit', BookController.update)
router.post('/books/:id/delete', BookController.destroy)

module.exports = router