const sequelize = require('../config/database')
const User = require('./User')
const Category = require('./Category')
const Book = require('./Book')

// === RELASI (one-to-many) ===
// Satu Category memiliki banyak Book; setiap Book milik satu Category.
Category.hasMany(Book, { foreignKey: 'category_id', as: 'books' })
Book.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

// Menghubungkan ke database lalu membuat/menyesuaikan tabel sesuai model.
async function connectAndSync() {
    await sequelize.authenticate()
    console.log('✓ Koneksi database berhasil')
    await sequelize.sync() // gunakan migration (sequelize-cli) untuk produksi
    console.log('✓ Model tersinkronisasi dengan database')
}

module.exports = { sequelize, User, Category, Book, connectAndSync }