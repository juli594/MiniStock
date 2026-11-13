const Database = require("better-sqlite3");

// Crear o abrir la base de datos
const db = new Database("ministock.db");

// Crear la tabla de productos
db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL,
        marca TEXT,
        precio_compra REAL NOT NULL,
        precio_venta REAL NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 0,
        stock_minimo INTEGER NOT NULL DEFAULT 5
    )
`);

// Exportar la conexión
module.exports = db;