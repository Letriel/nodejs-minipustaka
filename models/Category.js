const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// Model Category (kategori buku). Satu kategori memiliki banyak buku.
const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'categories',
    timestamps: true
})

module.exports = Category