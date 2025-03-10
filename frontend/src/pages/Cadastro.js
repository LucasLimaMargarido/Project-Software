import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário.");
      }

      const data = await response.json();
      alert(`Usuário ${nome} cadastrado com sucesso!`);
      setNome("");
      setEmail("");
      setSenha("");
      navigate("/");
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        width: "100%",
        maxWidth: "400px",
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
        Cadastro de Usuário
      </h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "14px",
          marginBottom: "20px",
          fontSize: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          fontFamily: "'Roboto', Arial, sans-serif",
        }}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "14px",
          marginBottom: "20px",
          fontSize: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          fontFamily: "'Roboto', Arial, sans-serif",
        }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "14px",
          marginBottom: "20px",
          fontSize: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          fontFamily: "'Roboto', Arial, sans-serif",
        }}
      />
      <button
        onClick={handleCadastro}
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
        Cadastrar
      </button>
      <button
        onClick={() => navigate("/")}
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
          marginTop: "10px",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#34495e")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#2c3e50")}
      >
        Voltar ao Login
      </button>
    </div>
  );
}