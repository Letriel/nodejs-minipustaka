require('dotenv').config()
const bcrypt = require('bcryptjs')
const { sequelize, User, Category, Book, connectAndSync } = require('../models')

// Mengisi data awal: 1 user admin, beberapa kategori, dan contoh buku.
// findOrCreate dipakai agar aman dijalankan berulang (tidak menggandakan data).
async function seed() {
  await connectAndSync()

  await User.findOrCreate({
    where: { email: 'admin@minipustaka.com' },
    defaults: {
      name: 'Administrator',
      password: await bcrypt.hash('admin12345', 10)
    }
  })

  const [fiksi] = await Category.findOrCreate({ where: { name: 'Fiksi' } })
  const [teknologi] = await Category.findOrCreate({ where: { name: 'Teknologi' } })

  const contohBuku = [
    { title: 'Laskar Pelangi', author: 'Andrea Hirata', year: 2005, stock: 5, category_id: fiksi.id },
    { title: 'Bumi', author: 'Tere Liye', year: 2014, stock: 4, category_id: fiksi.id },
    { title: 'Belajar Node.js', author: 'Tim Penulis', year: 2023, stock: 3, category_id: teknologi.id }
  ]
  for (const b of contohBuku) {
    await Book.findOrCreate({ where: { title: b.title }, defaults: b })
  }

  console.log('✓ Seed selesai.')
  console.log('  Login admin: admin@minipustaka.com / admin12345')
  await sequelize.close()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})