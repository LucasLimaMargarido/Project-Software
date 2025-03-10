import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./pages/Login"; // Ajuste o caminho conforme sua estrutura
import Cadastro from "./pages/Cadastro"; // Ajuste o caminho
import MarcarPonto from "./pages/MarcarPonto"; // Ajuste o caminho
import AjustePonto from "./pages/AjustePonto"; // Ajuste o caminho
import RelatorioPonto from "./pages/RelatorioPonto"; // Ajuste o caminho

function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#d3d3d3", // Fundo cinza claro
          fontFamily: "'Roboto', Arial, sans-serif", // Fonte profissional
          fontSize: "20px", // Tamanho base da fonte aumentado
          color: "#333", // Cor do texto padrão
        }}
      >
        {/* Cabeçalho global */}
        <header
          style={{
            backgroundColor: "#2c3e50", // Azul escuro para contraste
            padding: "20px 40px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "36px", // Título grande
              color: "#fff",
              margin: 0,
              fontWeight: "bold",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            Relógio de Ponto
          </h1>
          <nav>
            <Link to="/" style={navLinkStyle}>
              Login
            </Link>
            <Link to="/cadastro" style={navLinkStyle}>
              Cadastro
            </Link>
            <Link to="/marcar-ponto" style={navLinkStyle}>
              Marcar Ponto
            </Link>
            <Link to="/ajuste-ponto" style={navLinkStyle}>
              Ajuste de Ponto
            </Link>
            <Link to="/relatorio-ponto" style={navLinkStyle}>
              Relatório
            </Link>
          </nav>
        </header>

        {/* Conteúdo principal */}
        <main
          style={{
            padding: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/marcar-ponto" element={<MarcarPonto />} />
            <Route path="/ajuste-ponto" element={<AjustePonto />} />
            <Route path="/relatorio-ponto" element={<RelatorioPonto />} />
          </Routes>
        </main>

        {/* Rodapé opcional */}
        <footer
          style={{
            backgroundColor: "#2c3e50",
            color: "#fff",
            textAlign: "center",
            padding: "15px",
            position: "fixed",
            bottom: 0,
            width: "100%",
            fontSize: "16px",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          © 2025 Relógio de Ponto - Trabalho Escolar
        </footer>
      </div>
    </Router>
  );
}

// Estilo para os links de navegação
const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "22px",
  margin: "0 20px",
  padding: "10px 15px",
  borderRadius: "5px",
  transition: "background-color 0.3s, color 0.3s",
  fontWeight: "500",
};

// Adiciona hover interativo via JavaScript inline
const applyHoverEffect = (e) => {
  e.target.style.backgroundColor = "#34495e";
  e.target.style.color = "#ecf0f1";
};
const removeHoverEffect = (e) => {
  e.target.style.backgroundColor = "transparent";
  e.target.style.color = "#fff";
};

// Aplica os eventos de hover aos links dinamicamente
document.querySelectorAll("a").forEach((link) => {
  link.onmouseover = applyHoverEffect;
  link.onmouseout = removeHoverEffect;
});

export default App;