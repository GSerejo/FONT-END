// init_db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, 'path_to_your_database.db');
const db = new sqlite3.Database(dbFile);

// Criação das tabelas se não existirem
db.serialize(() => {
  // Tabela de atletas
  db.run(`CREATE TABLE IF NOT EXISTS atletas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    pais TEXT NOT NULL
  )`);

  // Tabela de partidas
  db.run(`CREATE TABLE IF NOT EXISTS partidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_name TEXT NOT NULL,
    player1_country TEXT NOT NULL,
    player1_points INTEGER NOT NULL,
    player2_name TEXT NOT NULL,
    player2_country TEXT NOT NULL,
    player2_points INTEGER NOT NULL,
    winner TEXT NOT NULL,
    mode TEXT NOT NULL
  )`);

  console.log("Tabelas criadas com sucesso!");
  db.close();
});
