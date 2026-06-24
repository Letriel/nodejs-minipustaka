const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// Model User untuk autentikasi. Kolom password menyimpan HASH bcrypt, bukan teks asli.
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100), // hash bcrypt panjangnya ±60 karakter
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true // diisi lewat seeder; login mem-fallback ke 'user' bila kosong
    }
}, {
    tableName: 'users',
    timestamps: true
})

module.exports = User