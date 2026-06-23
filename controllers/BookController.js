const { Book, Category } = require('../models')
const { bookSchema } = require('../validations/bookValidation')

// Mengambil daftar kategori untuk dropdown form (dipakai create & edit).
async function getCategories() {
    return Category.findAll({ order: [['name', 'ASC']] })
}

// GET /books — daftar buku beserta kategorinya
exports.index = async (req, res, next) => {
    try {
        const books = await Book.findAll({
            include: [{ model: Category, as: 'category' }],
            order: [['createdAt', 'DESC']]
        })
        res.render('books/index', { title: 'Daftar Buku', books })
    } catch (err) {
        next(err)
    }
}

// GET /books/create — form tambah
exports.create = async (req, res, next) => {
    try {
        const categories = await getCategories()
        res.render('books/create', { title: 'Tambah Buku', categories, errors: [], old: {} })
    } catch (err) {
        next(err)
    }
}

// POST /books/create — simpan buku baru
exports.store = async (req, res, next) => {
    try {
        const { error, value } = bookSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            const categories = await getCategories()
            return res.status(422).render('books/create', {
                title: 'Tambah Buku',
                categories,
                errors: error.details.map(d => d.message),
                old: req.body
            })
        }
        await Book.create(value)
        req.flash('success', 'Buku berhasil ditambahkan.')
        res.redirect('/books')
    } catch (err) {
        next(err)
    }
}

// GET /books/:id/edit — form edit
exports.edit = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id)
        if (!book) {
            req.flash('error', 'Buku tidak ditemukan.')
            return res.redirect('/books')
        }
        const categories = await getCategories()
        res.render('books/edit', {
            title: 'Edit Buku', book, categories, errors: [], old: book.toJSON()
        })
    } catch (err) {
        next(err)
    }
}

// POST /books/:id/edit — proses update
exports.update = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id)
        if (!book) {
            req.flash('error', 'Buku tidak ditemukan.')
            return res.redirect('/books')
        }
        const { error, value } = bookSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            const categories = await getCategories()
            return res.status(422).render('books/edit', {
                title: 'Edit Buku',
                book,
                categories,
                errors: error.details.map(d => d.message),
                old: { ...book.toJSON(), ...req.body }
            })
        }
        await book.update(value)
        req.flash('success', 'Buku berhasil diperbarui.')
        res.redirect('/books')
    } catch (err) {
        next(err)
    }
}

// POST /books/:id/delete — hapus
exports.destroy = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id)
        if (!book) {
            req.flash('error', 'Buku tidak ditemukan.')
            return res.redirect('/books')
        }
        await book.destroy()
        req.flash('success', 'Buku berhasil dihapus.')
        res.redirect('/books')
    } catch (err) {
        next(err)
    }
}