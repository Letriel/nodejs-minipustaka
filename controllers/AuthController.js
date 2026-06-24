const bcrypt = require('bcryptjs')
const { User, Role } = require('../models')
const { loginSchema } = require('../validations/authValidation')

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

        const user = await User.findOne({
            where: { email: value.email },
            include: [{ model: Role, as: 'role' }]
        })
        // Pesan sengaja dibuat umum demi keamanan (tidak membocorkan email mana yang terdaftar).
        const pesanGagal = 'Email atau password salah'
        if (!user || !(await bcrypt.compare(value.password, user.password))) {
            return res.status(401).render('auth/login', {
                title: 'Login', errors: [pesanGagal], old: req.body
            })
        }

        // Simpan identitas di session (JANGAN simpan password).
        const role = user.role ? user.role.name : 'user'
        req.session.userId = user.id
        req.session.user = { id: user.id, name: user.name, email: user.email, role }

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