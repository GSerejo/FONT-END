const sqlite3 = require('sqlite3').verbose();

// Cria uma nova instância do banco de dados SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados SQLite');
    }
});

// Cria a tabela 'atletas' se ela não existir
db.serialize(() => {
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
});

module.exports = db;
