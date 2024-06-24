// database.js
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = process.env.DB_FILE || path.join(__dirname, 'path_to_your_database.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados SQLite');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        // Tabela de atletas
        db.run(`CREATE TABLE IF NOT EXISTS atletas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            pais TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela de atletas:', err.message);
            } else {
                console.log('Tabela de atletas criada com sucesso!');
            }
        });

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
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela de partidas:', err.message);
            } else {
                console.log('Tabela de partidas criada com sucesso!');
            }
        });
    });
}

module.exports = db;
