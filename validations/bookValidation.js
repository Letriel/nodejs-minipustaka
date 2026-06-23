const Joi = require('joi')

const tahunSekarang = new Date().getFullYear()

// Skema validasi data buku.
// .empty('') mengubah string kosong dari form menjadi "tidak ada" agar tidak masuk ke kolom angka.
const bookSchema = Joi.object({
    title: Joi.string().max(200).required().messages({
        'string.empty': 'Judul wajib diisi',
        'any.required': 'Judul wajib diisi',
        'string.max': 'Judul maksimal 200 karakter'
    }),
    author: Joi.string().max(100).required().messages({
        'string.empty': 'Penulis wajib diisi',
        'any.required': 'Penulis wajib diisi',
        'string.max': 'Penulis maksimal 100 karakter'
    }),
    year: Joi.number().integer().min(1900).max(tahunSekarang).empty('').allow(null).messages({
        'number.base': 'Tahun harus berupa angka',
        'number.min': 'Tahun minimal 1900',
        'number.max': `Tahun maksimal ${tahunSekarang}`
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'Stok harus berupa angka',
        'number.min': 'Stok tidak boleh negatif',
        'number.integer': 'Stok harus bilangan bulat',
        'any.required': 'Stok wajib diisi'
    }),
    category_id: Joi.number().integer().empty('').allow(null).messages({
        'number.base': 'Kategori tidak valid'
    })
})

module.exports = { bookSchema }