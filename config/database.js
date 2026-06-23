const { Sequelize } = require('sequelize')
require('dotenv').config()

// Membuat instance koneksi Sequelize ke MySQL.
// Nilai diambil dari berkas .env agar kredensial tidak ditulis langsung di kode.
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // ubah ke console.log untuk melihat query SQL saat debugging
        define: {
            underscored: true // kolom otomatis snake_case: created_at, updated_at, category_id
        }
    }
)

module.exports = sequelize