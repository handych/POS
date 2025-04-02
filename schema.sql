CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL
);

-- Contoh data awal
INSERT INTO products (name, price, stock) VALUES
('Kopi', 15000, 100),
('Roti', 10000, 50);