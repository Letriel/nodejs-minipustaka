const { Category, Book } = require('../models')
const { categorySchema } = require('../validations/categoryValidation')

// GET /categories — daftar kategori
exports.index = async (req, res, next) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] })
        res.render('categories/index', { title: 'Daftar Kategori', categories })
    } catch (err) {
        next(err)
    }
}

// GET /categories/create — form tambah
exports.create = (req, res) => {
    res.render('categories/create', { title: 'Tambah Kategori', errors: [], old: {} })
}

// POST /categories/create — simpan kategori baru
exports.store = async (req, res, next) => {
    try {
        const { error, value } = categorySchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            return res.status(422).render('categories/create', {
                title: 'Tambah Kategori',
                errors: error.details.map(d => d.message),
                old: req.body
            })
        }
        await Category.create(value)
        req.flash('success', 'Kategori berhasil ditambahkan.')
        res.redirect('/categories')
    } catch (err) {
        next(err)
    }
}

// GET /categories/:id/edit — form edit
exports.edit = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id)
        if (!category) {
            req.flash('error', 'Kategori tidak ditemukan.')
            return res.redirect('/categories')
        }
        res.render('categories/edit', {
            title: 'Edit Kategori', category, errors: [], old: category.toJSON()
        })
    } catch (err) {
        next(err)
    }
}

// POST /categories/:id/edit — proses update
exports.update = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id)
        if (!category) {
            req.flash('error', 'Kategori tidak ditemukan.')
            return res.redirect('/categories')
        }
        const { error, value } = categorySchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            return res.status(422).render('categories/edit', {
                title: 'Edit Kategori',
                category,
                errors: error.details.map(d => d.message),
                old: { ...category.toJSON(), ...req.body }
            })
        }
        await category.update(value)
        req.flash('success', 'Kategori berhasil diperbarui.')
        res.redirect('/categories')
    } catch (err) {
        next(err)
    }
}

// POST /categories/:id/delete — hapus
exports.destroy = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id)
        if (!category) {
            req.flash('error', 'Kategori tidak ditemukan.')
            return res.redirect('/categories')
        }
        // Cegah hapus bila kategori masih dipakai oleh buku.
        const jumlahBuku = await Book.count({ where: { category_id: category.id } })
        if (jumlahBuku > 0) {
            req.flash('error', 'Kategori masih dipakai oleh buku, tidak bisa dihapus.')
            return res.redirect('/categories')
        }
        await category.destroy()
        req.flash('success', 'Kategori berhasil dihapus.')
        res.redirect('/categories')
    } catch (err) {
        next(err)
    }
}
