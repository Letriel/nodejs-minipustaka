const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// Model Book (buku). Memiliki kolom foreign key category_id yang merujuk ke tabel categories.
const Book = sequelize.define('Book', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title: {
		type: DataTypes.STRING(200),
		allowNull: false
	},
	author: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	year: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	stock: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	category_id: {
		type: DataTypes.INTEGER,
		allowNull: true
	}
}, {
	tableName: 'books',
	timestamps: true
})

module.exports = Book