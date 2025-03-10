import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AjustePonto() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
  const [pontos, setPontos] = useState([]);
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [tipo, setTipo] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [motivo, setMotivo] = useState("");
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

  const handleUsuarioChange = async (e) => {
    const usuarioId = e.target.value;
    setUsuarioSelecionado(usuarioId);
    if (usuarioId) {
      try {
        const response = await fetch(`http://localhost:3001/pontos/${usuarioId}`);
        const data = await response.json();
        setPontos(data);
      } catch (error) {
        console.error("Erro ao buscar pontos:", error);
      }
    } else {
      setPontos([]);
    }
    setPontoSelecionado(null);
  };

  const handlePontoChange = (e) => {
    const pontoId = e.target.value;
    const ponto = pontos.find((p) => p.id === parseInt(pontoId));
    setPontoSelecionado(ponto);
    if (ponto) {
      setTipo(ponto.tipo);
      setDataHora(ponto.horario.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5"));
      setMotivo(ponto.motivo || "");
    } else {
      setTipo("");
      setDataHora("");
      setMotivo("");
    }
  };

  const handleAjuste = async () => {
    if (!pontoSelecionado || !tipo || !dataHora || !motivo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/ponto/${pontoSelecionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tipo: tipo,
          timestamp: new Date(dataHora).toISOString(),
          motivo: motivo,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao ajustar o ponto.");
      }

      const pontoAtualizado = await response.json();
      setPontos(pontos.map((p) => (p.id === pontoAtualizado.id ? pontoAtualizado : p)));
      alert("Ponto ajustado com sucesso!");
      setPontoSelecionado(null);
      setTipo("");
      setDataHora("");
      setMotivo("");
    } catch (error) {
      alert("Erro ao ajustar ponto: " + error.message);
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
        maxWidth: "600px",
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
        Ajuste de Ponto
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
          Selecione o Funcionário:
        </label>
        <select
          value={usuarioSelecionado}
          onChange={handleUsuarioChange}
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
          <option value="">Selecione um funcionário</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome}
            </option>
          ))}
        </select>
      </div>
      {usuarioSelecionado && (
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
            Selecione o Ponto:
          </label>
          <select
            value={pontoSelecionado?.id || ""}
            onChange={handlePontoChange}
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
            <option value="">Selecione um ponto</option>
            {pontos.map((ponto) => (
              <option key={ponto.id} value={ponto.id}>
                {`${ponto.horario} - ${ponto.tipo}`}
              </option>
            ))}
          </select>
        </div>
      )}
      {pontoSelecionado && (
        <>
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
              Data e Hora:
            </label>
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
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
              Motivo do Ajuste:
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Digite o motivo do ajuste"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                fontFamily: "'Roboto', Arial, sans-serif",
                minHeight: "100px",
              }}
            />
          </div>
          <button
            onClick={handleAjuste}
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
            Solicitar Ajuste
          </button>
        </>
      )}
    </div>
  );
}