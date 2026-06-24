const Joi = require('joi')

// Skema validasi data kategori.
const categorySchema = Joi.object({
    name: Joi.string().max(100).required().messages({
        'string.empty': 'Nama kategori wajib diisi',
        'any.required': 'Nama kategori wajib diisi',
        'string.max': 'Nama kategori maksimal 100 karakter'
    })
})

module.exports = { categorySchema }
