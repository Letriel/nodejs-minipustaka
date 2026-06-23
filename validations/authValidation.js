const Joi = require('joi')

// Skema validasi pendaftaran akun.
const registerSchema = Joi.object({
    name: Joi.string().max(100).required().messages({
        'string.empty': 'Nama wajib diisi',
        'any.required': 'Nama wajib diisi',
        'string.max': 'Nama maksimal 100 karakter'
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.empty': 'Email wajib diisi',
        'any.required': 'Email wajib diisi',
        'string.email': 'Format email tidak valid'
    }),
    password: Joi.string().min(8).max(72).required().messages({
        'string.empty': 'Password wajib diisi',
        'any.required': 'Password wajib diisi',
        'string.min': 'Password minimal 8 karakter'
    }),
    // Harus sama persis dengan field password (lihat Joi.ref).
    password_confirmation: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Konfirmasi password tidak cocok',
        'any.required': 'Konfirmasi password wajib diisi'
    })
})

// Skema validasi login.
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email wajib diisi',
        'any.required': 'Email wajib diisi',
        'string.email': 'Format email tidak valid'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password wajib diisi',
        'any.required': 'Password wajib diisi'
    })
})

module.exports = { registerSchema, loginSchema }