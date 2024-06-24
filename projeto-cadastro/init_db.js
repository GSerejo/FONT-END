// init_db.js
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Defina o caminho do banco de dados usando variáveis de ambiente
const dbFile = process.env.DB_FILE || path.join(__dirname, 'path_to_your_database.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados SQLite');
        createTables();
    }
});

// Função para criar tabelas
function createTables() {
    db.serialize(() => {
        // Cria a tabela 'atletas' se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS atletas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            pais TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar a tabela atletas:', err.message);
            } else {
                console.log('Tabela atletas criada com sucesso');
            }
        });

        // Cria a tabela 'partidas' se ela não existir
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
                console.error('Erro ao criar a tabela partidas:', err.message);
            } else {
                console.log('Tabela partidas criada com sucesso');
            }
        });

        // Fecha a conexão com o banco de dados após a criação das tabelas
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar a conexão com o banco de dados:', err.message);
            } else {
                console.log('Conexão com o banco de dados fechada com sucesso');
            }
        });
    });
}
