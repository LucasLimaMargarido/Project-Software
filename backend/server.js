require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Configuração do banco PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "PROJETO2.0",
  password: "1234",
  port: 5432,
});

// Chave secreta para JWT (para demo escolar, pode ser fixa; em produção, use .env)
const JWT_SECRET = "seu-segredo-aqui";

// Rota para registrar um novo usuário
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
      [nome, email, hashedSenha]
    );
    res.json({ message: "Usuário registrado!", userId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para login com JWT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    const result = await pool.query(
      "SELECT id, nome, email, senha FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(password, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token: token,
      message: "Login bem-sucedido!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter todos os usuários (apenas para teste)
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nome, email FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para registrar ponto
app.post("/ponto", async (req, res) => {
  const { usuario_id, tipo } = req.body;

  if (!usuario_id || !tipo) {
    return res.status(400).json({ error: "Usuário e tipo de ponto são obrigatórios." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO pontos (usuario_id, tipo) VALUES ($1, $2) RETURNING id, usuario_id, tipo, TO_CHAR(timestamp, 'DD/MM/YYYY HH24:MI') AS horario",
      [usuario_id, tipo]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar pontos de um usuário específico
app.get("/pontos/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, usuario_id, tipo, TO_CHAR(timestamp, 'DD/MM/YYYY HH24:MI') AS horario, motivo FROM pontos WHERE usuario_id = $1 ORDER BY timestamp DESC",
      [usuario_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para ajustar um ponto existente
app.put("/ponto/:id", async (req, res) => {
  const { id } = req.params;
  const { tipo, timestamp, motivo } = req.body;

  try {
    const result = await pool.query(
      "UPDATE pontos SET tipo = $1, timestamp = $2, motivo = $3 WHERE id = $4 RETURNING id, usuario_id, tipo, TO_CHAR(timestamp, 'DD/MM/YYYY HH24:MI') AS horario, motivo",
      [tipo, timestamp, motivo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro de ponto não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para gerar relatório de pontos com filtro por semana
app.get("/relatorio/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  const { semana } = req.query;

  try {
    let query = `
      SELECT u.nome, p.tipo, TO_CHAR(p.timestamp, 'DD/MM/YYYY HH24:MI') AS horario, p.motivo
      FROM pontos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.usuario_id = $1
    `;
    const params = [usuario_id];

    if (semana) {
      const [ano, semanaNum] = semana.split("-W");
      query += `
        AND EXTRACT(YEAR FROM p.timestamp) = $2
        AND EXTRACT(WEEK FROM p.timestamp) = $3
      `;
      params.push(ano, semanaNum);
    }

    query += " ORDER BY p.timestamp DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});