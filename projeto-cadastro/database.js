require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usar um banco de dados persistente no ambiente de produção
const dbFile = process.env.DB_FILE || ':memory:';
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  // Criar a tabela de atletas
  db.run(`CREATE TABLE IF NOT EXISTS atletas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    pais TEXT NOT NULL
  )`);
});

// Exportar o banco de dados
module.exports = db;
