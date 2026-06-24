// Middleware penjaga akses berbasis session.

// Halaman yang butuh login. Jika belum login -> arahkan ke /login.
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next()
    }
    req.flash('error', 'Silakan login terlebih dahulu.')
    return res.redirect('/login')
}

// Untuk halaman login/register: jika SUDAH login, lempar ke dashboard.
function redirectIfAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/')
    }
    return next()
}

// Halaman/aksi khusus admin. Jika bukan admin -> tolak dan kembalikan ke daftar buku.
function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next()
    }
    req.flash('error', 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.')
    return res.redirect('/books')
}

module.exports = { requireAuth, redirectIfAuth, requireAdmin }