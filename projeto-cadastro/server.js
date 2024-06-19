// projeto-cadastro/server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const port = 3000;

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Rota para cadastrar atleta
app.post('/cadastrar-atleta', (req, res) => {
  const { nome, pais } = req.body;

  console.log('Dados recebidos:', req.body);

  if (!nome || !pais) {
    console.error('Erro: Nome e país são obrigatórios');
    return res.status(400).send('Nome e país são obrigatórios');
  }

  const stmt = db.prepare('INSERT INTO atletas (nome, pais) VALUES (?, ?)');
  stmt.run(nome, pais, function(err) {
    if (err) {
      console.error('Erro ao cadastrar atleta:', err);
      return res.status(500).send('Erro ao cadastrar atleta');
    }
    res.send(`Atleta cadastrado com sucesso. ID: ${this.lastID}`);
  });
  stmt.finalize();
});

// Rota para servir o arquivo cadastro.html
app.get('/cadastro.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cadastro.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
