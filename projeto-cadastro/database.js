// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Usando um banco de dados em memória para simplicidade

db.serialize(() => {
  // Criar a tabela de atletas
  db.run(`CREATE TABLE atletas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    pais TEXT NOT NULL
  )`);
});

module.exports = db;
