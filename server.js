const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Untuk mengatasi CORS jika frontend di port berbeda
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Aktifkan CORS

// Koneksi ke database SQLite
const db = new sqlite3.Database('./pos.db');

// Endpoint GET untuk mendapatkan detail produk berdasarkan ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  // Ambil data produk dari database
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal mengambil data produk' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    res.json(product);
  });
});

// Endpoint POST untuk mengurangi stok
app.post('/api/reduce-stock', (req, res) => {
  const { productId, quantity } = req.body;

  // Validasi input
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Product ID dan quantity harus valid' });
  }

  // Ambil data produk dari database
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal mengambil data produk' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    // Cek stok
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stok tidak mencukupi' });
    }

    // Kurangi stok
    const newStock = product.stock - quantity;
    db.run('UPDATE products SET stock = ? WHERE id = ?', [newStock, productId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Gagal mengupdate stok' });
      }
      res.json({ message: 'Stok berhasil dikurangi', newStock });
    });
  });
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan di http://0.0.0.0:${port}`);
});