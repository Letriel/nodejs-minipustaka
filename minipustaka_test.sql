-- =====================================================================
--  MiniPustaka — Skema Database untuk TESTING
-- =====================================================================
--  Berkas ini membuat database terpisah (minipustaka_test) berisi
--  struktur tabel + data uji yang deterministik, agar implementasi
--  aplikasi bisa dites tanpa mengotori data pengembangan.
--
--  Struktur tabel ini SAMA dengan yang dihasilkan model Sequelize
--  (underscored: true -> kolom created_at / updated_at / category_id).
--
--  Cara pakai:
--    1) Jalankan berkas ini di MySQL:
--         mysql -u root -p < minipustaka-test-schema.sql
--       atau buka di phpMyAdmin / DBeaver lalu Execute.
--    2) Arahkan aplikasi ke DB ini saat testing (.env):
--         DB_NAME=minipustaka_test
--    3) Jalankan ulang berkas ini kapan pun untuk MERESET ke kondisi awal
--       (DROP DATABASE di bawah menghapus semua lalu membuat ulang).
--
--  Akun uji (password sudah di-hash bcrypt, siap login):
--    - admin@minipustaka.com  / admin12345   (admin)
--    - user@minipustaka.com   / user12345    (pengguna biasa)
-- =====================================================================

DROP DATABASE IF EXISTS minipustaka_test;
CREATE DATABASE minipustaka_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE minipustaka_test;

-- ---------------------------------------------------------------------
--  Tabel: roles  (peran pengguna: admin / user)
-- ---------------------------------------------------------------------
CREATE TABLE roles (
  id         INT         NOT NULL AUTO_INCREMENT,
  name       VARCHAR(50) NOT NULL,
  created_at DATETIME    NOT NULL,
  updated_at DATETIME    NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Tabel: users  (untuk autentikasi)
--  Catatan: kolom password menyimpan HASH bcrypt (±60 karakter).
--  role_id -> roles(id); jika role dihapus -> di-SET NULL.
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  password   VARCHAR(100) NOT NULL,
  role_id    INT          DEFAULT NULL,
  created_at DATETIME     NOT NULL,
  updated_at DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role_id),
  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Tabel: categories  (kategori buku)
-- ---------------------------------------------------------------------
CREATE TABLE categories (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  created_at DATETIME     NOT NULL,
  updated_at DATETIME     NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Tabel: books  (relasi many-to-one ke categories)
--  category_id boleh NULL; jika kategori dihapus -> di-SET NULL.
-- ---------------------------------------------------------------------
CREATE TABLE books (
  id          INT          NOT NULL AUTO_INCREMENT,
  title       VARCHAR(200) NOT NULL,
  author      VARCHAR(100) NOT NULL,
  year        INT          DEFAULT NULL,
  stock       INT          NOT NULL DEFAULT 0,
  category_id INT          DEFAULT NULL,
  created_at  DATETIME     NOT NULL,
  updated_at  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_books_category (category_id),
  CONSTRAINT fk_books_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
--  DATA UJI (deterministik)
-- =====================================================================
--  Timestamp sengaja dibuat tetap agar hasil tes konsisten.

-- Roles -------------------------------------------------------------
INSERT INTO roles (id, name, created_at, updated_at) VALUES
  (1, 'admin', '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
  (2, 'user',  '2024-01-01 08:00:00', '2024-01-01 08:00:00');

-- Users -------------------------------------------------------------
--  Administrator -> role admin (1); Pengguna Biasa -> role user (2).
INSERT INTO users (id, name, email, password, role_id, created_at, updated_at) VALUES
  (1, 'Administrator',  'admin@minipustaka.com',
      '$2b$10$3hTM8G13AOzrNjVg43rYOuFWbsCPjEsxEcP/QO4.lfT.xU2eXj97G',
      1, '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
  (2, 'Pengguna Biasa', 'user@minipustaka.com',
      '$2b$10$esW0Nqpus.5MVHqleJJJ5.tCunrnpnp6H.l2tMI0Kej5Ilh5yyftu',
      2, '2024-01-01 08:00:00', '2024-01-01 08:00:00');

-- Categories --------------------------------------------------------
--  "Sains" sengaja dibiarkan TANPA buku untuk menguji relasi kosong.
INSERT INTO categories (id, name, created_at, updated_at) VALUES
  (1, 'Fiksi',     '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
  (2, 'Teknologi', '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
  (3, 'Sejarah',   '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
  (4, 'Sains',     '2024-01-01 08:00:00', '2024-01-01 08:00:00');

-- Books -------------------------------------------------------------
--  Dataset dirancang mencakup kasus uji penting:
--    * buku dengan kategori (uji include/relasi)
--    * buku tanpa kategori (category_id NULL -> tampil "-")
--    * buku tanpa tahun (year NULL -> tampil "-")
--    * buku dengan stok 0 (uji nilai batas)
INSERT INTO books (id, title, author, year, stock, category_id, created_at, updated_at) VALUES
  (1, 'Laskar Pelangi',  'Andrea Hirata',     2005, 5, 1,    '2024-01-02 09:00:00', '2024-01-02 09:00:00'),
  (2, 'Bumi',            'Tere Liye',          2014, 4, 1,    '2024-01-02 09:05:00', '2024-01-02 09:05:00'),
  (3, 'Belajar Node.js', 'Tim Penulis',        2023, 3, 2,    '2024-01-02 09:10:00', '2024-01-02 09:10:00'),
  (4, 'Clean Code',      'Robert C. Martin',   2008, 2, 2,    '2024-01-02 09:15:00', '2024-01-02 09:15:00'),
  (5, 'Sejarah Dunia',   'Anonim',             NULL, 0, 3,    '2024-01-02 09:20:00', '2024-01-02 09:20:00'),
  (6, 'Catatan Lepas',   'Penulis Indie',      2021, 7, NULL, '2024-01-02 09:25:00', '2024-01-02 09:25:00');

-- =====================================================================
--  VERIFIKASI CEPAT (jalankan manual bila perlu)
-- =====================================================================
--  Jumlah baris per tabel:
--    SELECT 'users' AS tabel, COUNT(*) AS jumlah FROM users
--    UNION ALL SELECT 'categories', COUNT(*) FROM categories
--    UNION ALL SELECT 'books', COUNT(*) FROM books;
--
--  Uji relasi (buku beserta nama kategori, NULL tampil sebagai NULL):
--    SELECT b.id, b.title, b.stock, c.name AS kategori
--    FROM books b LEFT JOIN categories c ON b.category_id = c.id
--    ORDER BY b.created_at DESC;
--
--  Uji kategori tanpa buku (harus memunculkan "Sains" dengan 0):
--    SELECT c.name, COUNT(b.id) AS jumlah_buku
--    FROM categories c LEFT JOIN books b ON b.category_id = c.id
--    GROUP BY c.id, c.name;

-- =====================================================================
--  OPSIONAL — RESET DATA SAJA (tanpa membuang struktur tabel)
-- =====================================================================
--  Hapus tanda komentar lalu jalankan blok ini bila ingin mengosongkan
--  dan mengisi ulang data tanpa DROP DATABASE.
--
--  SET FOREIGN_KEY_CHECKS = 0;
--  TRUNCATE TABLE books;
--  TRUNCATE TABLE categories;
--  TRUNCATE TABLE users;
--  TRUNCATE TABLE roles;
--  SET FOREIGN_KEY_CHECKS = 1;
--  -- lalu jalankan kembali keempat blok INSERT di atas.