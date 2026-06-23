const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { registerSchema, loginSchema } = require('../validations/authValidation')

// GET /register
exports.showRegister = (req, res) => {
    res.render('auth/register', { title: 'Daftar', errors: [], old: {} })
}

// POST /register
exports.register = async (req, res, next) => {
    try {
        // 1) Validasi input dengan Joi
        const { error, value } = registerSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            return res.status(422).render('auth/register', {
                title: 'Daftar',
                errors: error.details.map(d => d.message),
                old: req.body
            })
        }

        // 2) Pastikan email belum dipakai
        const existing = await User.findOne({ where: { email: value.email } })
        if (existing) {
            return res.status(422).render('auth/register', {
                title: 'Daftar',
                errors: ['Email sudah terdaftar'],
                old: req.body
            })
        }

        // 3) Hash password lalu simpan
        const hashed = await bcrypt.hash(value.password, 10)
        await User.create({ name: value.name, email: value.email, password: hashed })

        req.flash('success', 'Pendaftaran berhasil. Silakan login.')
        res.redirect('/login')
    } catch (err) {
        next(err)
    }
}

// GET /login
exports.showLogin = (req, res) => {
    res.render('auth/login', { title: 'Login', errors: [], old: {} })
}

// POST /login
exports.login = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })
        if (error) {
            return res.status(422).render('auth/login', {
                title: 'Login',
                errors: error.details.map(d => d.message),
                old: req.body
            })
        }

        const user = await User.findOne({ where: { email: value.email } })
        // Pesan sengaja dibuat umum demi keamanan (tidak membocorkan email mana yang terdaftar).
        const pesanGagal = 'Email atau password salah'
        if (!user || !(await bcrypt.compare(value.password, user.password))) {
            return res.status(401).render('auth/login', {
                title: 'Login', errors: [pesanGagal], old: req.body
            })
        }

        // Simpan identitas di session (JANGAN simpan password).
        req.session.userId = user.id
        req.session.user = { id: user.id, name: user.name, email: user.email }

        req.flash('success', `Selamat datang, ${user.name}!`)
        res.redirect('/')
    } catch (err) {
        next(err)
    }
}

// POST /logout
exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err)
        res.clearCookie('connect.sid')
        res.redirect('/login')
    })
}