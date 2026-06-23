require('dotenv').config()
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const flash = require('connect-flash')
const { connectAndSync } = require('./models')

const app = express()

// View engine: Pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middleware global
app.use(morgan('dev'))                                   // log setiap request di terminal
app.use(express.urlencoded({ extended: false }))         // membaca body form (req.body)
app.use(express.static(path.join(__dirname, 'public')))  // file statis (CSS, gambar)

// Session untuk menyimpan status login
app.use(session({
    secret: process.env.SESSION_SECRET || 'ubah-rahasia-ini',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,        // cookie tidak bisa dibaca JavaScript klien
        maxAge: 1000 * 60 * 60 // berlaku 1 jam
        // secure: true,        // aktifkan saat sudah memakai HTTPS (produksi)
    }
}))

// Pesan flash (sekali tampil)
app.use(flash())

// Sediakan data umum untuk SEMUA view: pesan flash + user yang sedang login
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.session.user || null
    next()
})

// Rute
app.use('/', require('./routes/auth')) // login, register, logout
app.use('/', require('./routes/web'))  // dashboard + CRUD buku (terproteksi)

// 404 - halaman tidak ditemukan
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})

// Penanganan error terpusat
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).render('error', {
        title: 'Error',
        message: process.env.NODE_ENV === 'production' ? 'Terjadi kesalahan server' : err.message
    })
})

const PORT = process.env.PORT || 8000
connectAndSync()
    .then(() => app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`)))
    .catch((err) => {
        console.error('Gagal terhubung ke database:', err.message)
        process.exit(1)
    })