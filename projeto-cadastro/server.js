// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Caminho absoluto para a pasta 'public' fora da pasta 'projeto-cadastro'
const publicDir = path.join(__dirname, '../public');

// Configuração para servir arquivos estáticos
app.use(express.static(publicDir));

// Middleware para analisar corpos de requisição JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const dbFile = process.env.DB_FILE || path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados SQLite');
    }
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'login.html'));
});

// Rota para visualizar partidas
app.get('/visualizar-partidas.html', (req, res) => {
    res.sendFile(path.join(publicDir, 'visualizar-partidas.html'));
});

// Rota para buscar as partidas
app.get('/partidas', (req, res) => {
    db.all('SELECT * FROM partidas', (err, rows) => {
        if (err) {
            console.error('Erro ao buscar as partidas:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar as partidas' });
        }
        res.json(rows);
    });
});

// Rota para enviar os dados da partida
app.post('/submit-game-data', (req, res) => {
    const { equipe1, equipe2, pontuacao, vencedor, modoJogo } = req.body;

    if (!equipe1 || !equipe2 || !pontuacao || !vencedor || !modoJogo) {
        console.error('Dados incompletos:', req.body);
        return res.status(400).send('Dados incompletos');
    }

    const {
        jogador1: { nome: equipe1Jogador1Nome, pais: equipe1Jogador1Pais },
        jogador2: { nome: equipe1Jogador2Nome, pais: equipe1Jogador2Pais }
    } = equipe1;

    const {
        jogador1: { nome: equipe2Jogador1Nome, pais: equipe2Jogador1Pais },
        jogador2: { nome: equipe2Jogador2Nome, pais: equipe2Jogador2Pais }
    } = equipe2;

    const { equipe1: pontosEquipe1, equipe2: pontosEquipe2 } = pontuacao;

    db.run(
        `INSERT INTO partidas (
            equipe1_jogador1_nome, equipe1_jogador1_pais, equipe1_jogador2_nome, equipe1_jogador2_pais, equipe1_pontos,
            equipe2_jogador1_nome, equipe2_jogador1_pais, equipe2_jogador2_nome, equipe2_jogador2_pais, equipe2_pontos,
            vencedor, modo_jogo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            equipe1Jogador1Nome, equipe1Jogador1Pais, equipe1Jogador2Nome, equipe1Jogador2Pais, pontosEquipe1,
            equipe2Jogador1Nome, equipe2Jogador1Pais, equipe2Jogador2Nome, equipe2Jogador2Pais, pontosEquipe2,
            vencedor, modoJogo
        ],
        function (err) {
            if (err) {
                console.error('Erro ao inserir dados da partida:', err);
                return res.status(500).send('Erro ao salvar os dados da partida');
            }
            console.log(`Dados da partida salvos com sucesso. ID: ${this.lastID}`);
            res.send('Dados da partida recebidos e salvos com sucesso');
        }
    );
});

// Rota para cadastrar um novo atleta
app.post('/cadastrar-atleta', (req, res) => {
    const { nome, pais } = req.body;

    if (!nome || !pais) {
        return res.status(400).send('Nome e país são obrigatórios');
    }

    db.run(
        'INSERT INTO atletas (nome, pais) VALUES (?, ?)',
        [nome, pais],
        function(err) {
            if (err) {
                console.error('Erro ao cadastrar atleta:', err);
                return res.status(500).send('Erro ao cadastrar atleta');
            }
            console.log(`Atleta cadastrado com sucesso. ID: ${this.lastID}`);
            res.send('Atleta cadastrado com sucesso');
        }
    );
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
