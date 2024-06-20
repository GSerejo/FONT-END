require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose(); // Importa o SQLite3
const db = new sqlite3.Database('path_to_your_database.db'); // Cria uma nova instância do banco de dados SQLite
const app = express();
const port = process.env.PORT || 3000;

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Middleware de log (opcional)
// const morgan = require('morgan');
// app.use(morgan('dev'));

// Rota para cadastrar atleta com validação
app.post('/cadastrar-atleta',
  [
    body('nome').isLength({ min: 1 }).withMessage('Nome é obrigatório'),
    body('pais').isLength({ min: 1 }).withMessage('País é obrigatório')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Erros de validação:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, pais } = req.body;
    console.log('Dados recebidos:', req.body);

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

// Rota para enviar os dados da partida
app.post('/submit-game-data', (req, res) => {
  const { player1, player2, winner, mode } = req.body;

  // Validação simples dos dados recebidos
  if (!player1 || !player2 || !winner || !mode) {
    console.error('Dados incompletos:', req.body);
    return res.status(400).send('Dados incompletos');
  }

  // Salvar os dados no banco de dados SQLite
  db.run('INSERT INTO partidas (player1_name, player1_country, player1_points, player2_name, player2_country, player2_points, winner, mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    player1.name, player1.country, player1.points,
    player2.name, player2.country, player2.points,
    winner, mode,
    function(err) {
      if (err) {
        console.error('Erro ao inserir dados da partida:', err);
        return res.status(500).send('Erro ao salvar os dados da partida');
      }
      console.log(`Dados da partida salvo com sucesso. ID: ${this.lastID}`);
      res.send('Dados da partida recebidos e salvos com sucesso');
    }
  );
});

// Rota para servir o arquivo contador.html
app.get('/contador.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/contador.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
