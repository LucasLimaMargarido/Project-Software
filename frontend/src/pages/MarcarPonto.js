import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MarcarPonto() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [historico, setHistorico] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado para acessar esta página.");
      navigate("/");
      return;
    }

    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:3001/usuarios");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsuarios();
  }, [navigate, usuarioLogado]);

  const handleMarcarPonto = async () => {
    if (!nome) {
      alert("Por favor, insira seu nome.");
      return;
    }

    try {
      const usuario = usuarios.find((u) => u.nome.toLowerCase() === nome.toLowerCase());
      if (!usuario) {
        alert("Usuário não encontrado.");
        return;
      }

      const response = await fetch("http://localhost:3001/ponto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          tipo: tipo,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar o ponto.");
      }

      const novoPonto = await response.json();
      setHistorico([novoPonto, ...historico]);
      setNome("");
      alert(`Ponto de ${tipo} registrado com sucesso para ${nome}!`);
    } catch (error) {
      alert("Erro ao marcar ponto: " + error.message);
    }
  };

  if (!usuarioLogado) return null;

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        width: "100%",
        maxWidth: "500px",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          textAlign: "center",
          marginBottom: "30px",
          color: "#2c3e50",
          fontFamily: "'Roboto', Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        Marcação de Ponto
      </h2>
      <p
        style={{
          fontSize: "20px",
          textAlign: "center",
          marginBottom: "20px",
          color: "#555",
          fontFamily: "'Roboto', Arial, sans-serif",
        }}
      >
        Bem-vindo, {usuarioLogado.nome}!
      </p>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            fontSize: "20px",
            color: "#333",
            fontFamily: "'Roboto', Arial, sans-serif",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Funcionário:
        </label>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontFamily: "'Roboto', Arial, sans-serif",
          }}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            fontSize: "20px",
            color: "#333",
            fontFamily: "'Roboto', Arial, sans-serif",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Tipo de Ponto:
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontFamily: "'Roboto', Arial, sans-serif",
          }}
        >
          <option value="entrada">Entrada</option>
          <option value="saída">Saída</option>
        </select>
      </div>
      <button
        onClick={handleMarcarPonto}
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "20px",
          backgroundColor: "#2c3e50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s",
          fontFamily: "'Roboto', Arial, sans-serif",
          fontWeight: "500",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#34495e")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#2c3e50")}
      >
        Bater Ponto
      </button>
      <h3
        style={{
          fontSize: "26px",
          textAlign: "center",
          marginTop: "30px",
          marginBottom: "20px",
          color: "#2c3e50",
          fontFamily: "'Roboto', Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        Histórico de Pontos
      </h3>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        {historico.map((ponto, index) => (
          <li
            key={index}
            style={{
              fontSize: "20px",
              padding: "10px",
              borderBottom: "1px solid #eee",
              color: "#555",
              fontFamily: "'Roboto', Arial, sans-serif",
            }}
          >
            {`${ponto.nome || usuarios.find(u => u.id === ponto.usuario_id)?.nome} - ${ponto.horario} (${ponto.tipo})`}
          </li>
        ))}
      </ul>
    </div>
  );
}