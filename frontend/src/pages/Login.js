import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ id: data.id, nome: data.nome, email: data.email }));
      alert(`Login bem-sucedido! Bem-vindo, ${data.nome}`);
      setEmail("");
      setPassword("");
      navigate("/marcar-ponto");
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
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
        Login
      </h2>
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        onClick={handleLogin}
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
        Entrar
      </button>
    </div>
  );
}