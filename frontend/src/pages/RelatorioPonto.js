import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RelatorioPonto() {
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroSemana, setFiltroSemana] = useState("");
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
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

  const handleFiltrar = async () => {
    if (!filtroNome || !filtroSemana) {
      alert("Por favor, preencha o nome e selecione a semana.");
      return;
    }

    try {
      const usuario = usuarios.find((u) => u.nome.toLowerCase() === filtroNome.toLowerCase());
      if (!usuario) {
        alert("Usuário não encontrado.");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/relatorio/${usuario.id}?semana=${filtroSemana}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro na resposta do servidor");
      }
      const data = await response.json();
      setRegistrosFiltrados(data);
    } catch (error) {
      alert("Erro ao buscar relatório: " + error.message);
    }
  };

  const handleExportarCSV = () => {
    if (registrosFiltrados.length === 0) {
      alert("Nenhum registro para exportar. Gere o relatório primeiro.");
      return;
    }

    const csvContent = [
      "Funcionário,Horário,Motivo",
      ...registrosFiltrados.map(
        (registro) => `${registro.nome},${registro.horario},${registro.motivo || "Nenhum motivo informado"}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_ponto_${filtroNome}_${filtroSemana}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        maxWidth: "800px",
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
        Relatório de Ponto
      </h2>
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
          placeholder="Digite o nome do funcionário"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
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
          Semana:
        </label>
        <input
          type="week"
          value={filtroSemana}
          onChange={(e) => setFiltroSemana(e.target.value)}
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
      <button
        onClick={handleFiltrar}
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
          marginBottom: "10px",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#34495e")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#2c3e50")}
      >
        Gerar Relatório
      </button>
      <button
        onClick={handleExportarCSV}
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
        Exportar como CSV
      </button>
      {registrosFiltrados.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'Roboto', Arial, sans-serif",
            marginTop: "30px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f5f5f5",
                fontSize: "20px",
                color: "#2c3e50",
                fontWeight: "bold",
              }}
            >
              <th
                style={{
                  padding: "14px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                }}
              >
                Funcionário
              </th>
              <th
                style={{
                  padding: "14px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                }}
              >
                Horário
              </th>
              <th
                style={{
                  padding: "14px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                }}
              >
                Motivo
              </th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((registro, index) => (
              <tr
                key={index}
                style={{
                  fontSize: "20px",
                  color: "#555",
                  backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {registro.nome}
                </td>
                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {registro.horario}
                </td>
                <td
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {registro.motivo || "Nenhum motivo informado"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p
          style={{
            fontSize: "20px",
            textAlign: "center",
            color: "#555",
            fontFamily: "'Roboto', Arial, sans-serif",
            marginTop: "20px",
          }}
        >
          Nenhum registro encontrado. Preencha os filtros e clique em "Gerar Relatório".
        </p>
      )}
    </div>
  );
}