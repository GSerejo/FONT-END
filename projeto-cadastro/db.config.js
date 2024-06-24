// db.config.js
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Defina o caminho do banco de dados usando variáveis de ambiente
const dbFile = process.env.DB_FILE || path.join(__dirname, 'data.db');

// Cria uma nova instância do banco de dados SQLite
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

        // Você pode adicionar a criação de outras tabelas aqui
        // ...
    });
}

module.exports = db;
