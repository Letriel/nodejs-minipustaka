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

module.exports = { requireAuth, redirectIfAuth }