const express = require('express')
const router = express.Router()
const BookController = require('../controllers/BookController')
const CategoryController = require('../controllers/CategoryController')
const { requireAuth, requireAdmin } = require('../middlewares/auth')
const { Book, Category } = require('../models')

// Semua rute di bawah ini wajib login.
router.use(requireAuth)

// di bagian atas routes/web.js:
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

// CRUD Buku — tambah & hapus untuk semua user login; edit khusus admin.
router.get('/books', BookController.index)
router.get('/books/create', BookController.create)
router.post('/books/create', BookController.store)
router.get('/books/:id/edit', requireAdmin, BookController.edit)
router.post('/books/:id/edit', requireAdmin, BookController.update)
router.post('/books/:id/delete', BookController.destroy)

// CRUD Kategori — khusus admin.
router.get('/categories', requireAdmin, CategoryController.index)
router.get('/categories/create', requireAdmin, CategoryController.create)
router.post('/categories/create', requireAdmin, CategoryController.store)
router.get('/categories/:id/edit', requireAdmin, CategoryController.edit)
router.post('/categories/:id/edit', requireAdmin, CategoryController.update)
router.post('/categories/:id/delete', requireAdmin, CategoryController.destroy)

module.exports = router