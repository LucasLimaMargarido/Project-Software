const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

let records = [];

// Rota para obter os pontos registrados
app.get("/ponto", (req, res) => {
  res.json(records);
});

// Rota para registrar um novo ponto
app.post("/ponto", (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: "Nome e tipo de ponto são obrigatórios." });
  }
  const timestamp = new Date().toLocaleString("pt-BR");
  const newRecord = { name, type, timestamp };
  records.push(newRecord);
  res.json(newRecord);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
