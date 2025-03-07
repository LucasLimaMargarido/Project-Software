import { useEffect, useState } from "react";

export default function App() {
  const [time, setTime] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/ponto")
      .then((res) => res.json())
      .then((data) => setRecords(data));
  }, []);

  const handlePunch = (type) => {
    if (!name.trim()) {
      alert("Por favor, insira seu nome antes de bater o ponto.");
      return;
    }
    
    fetch("http://localhost:3001/ponto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type })
    })
      .then((res) => res.json())
      .then((newRecord) => setRecords([...records, newRecord]))
      .catch((error) => console.error("Erro ao registrar ponto:", error));
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          border: "2px solid #007BFF"
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#333" }}>Marcação de Ponto</h1>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Funcionário:</label>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            width: "calc(100% - 22px)",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        />
        <div
          style={{
            fontSize: "24px",
            margin: "20px auto",
            padding: "10px",
            border: "1px solid #ccc",
            display: "inline-block",
            borderRadius: "5px",
            backgroundColor: "#f8f9fa"
          }}
        >
          {time.toLocaleString("pt-BR")}
        </div>
        <br />
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => handlePunch("Entrada")}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              borderRadius: "5px",
              margin: "5px",
              width: "100%"
            }}
          >
            Bater Ponto Entrada
          </button>
          <button
            onClick={() => handlePunch("Saída")}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              borderRadius: "5px",
              margin: "5px",
              width: "100%"
            }}
          >
            Bater Ponto Saída
          </button>
        </div>
        <h2 style={{ color: "#333" }}>Histórico de Pontos</h2>
        <ul
          style={{
            listStyle: "none",
            padding: "10px",
            maxWidth: "300px",
            margin: "auto",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        >
          {records.length === 0 ? (
            <li style={{ color: "#777" }}>Nenhum ponto registrado ainda.</li>
          ) : (
            records.map((record, index) => (
              <li
                key={index}
                style={{
                  padding: "5px",
                  borderBottom: "1px solid #ccc"
                }}
              >
                {record.name} - {record.type} - {record.timestamp}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
