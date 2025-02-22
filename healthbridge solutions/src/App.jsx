// import { useState } from "react";
// import "./App.css";
import { useState, useEffect } from "react";
import GFRCalculator from "./components/GFRCalculator";
import axios from "axios";

function App() {
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/data")
      .then((response) => {
        setMongoData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Healthbridge Solutions</h1>
      </header>
      <main style={styles.main}>
        <p style={styles.p}>Welcome to Healthbridge Solutions, your GFR calculation resource.</p>
        <GFRCalculator />

        <h2 style={styles.h2}>Sample Weather Data</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul style={styles.dataList}>
            {console.log("mongoData", mongoData)}
            {mongoData.map((item, index) => (
              <li key={index} style={styles.dataItem}>
                Station: {item.st} | Elevation: {item.elevation} | Call Letters: {item.callLetters}
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer style={styles.footer}>© 2025 Healthbridge Solutions</footer>
    </div>
  );
}

export default App;

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#f4f4f4",
    color: "#333",
  },
  header: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "1rem",
    textAlign: "center",
  },
  main: {
    padding: "2rem",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#4CAF50",
    color: "white",
    textAlign: "center",
    padding: "1rem",
    width: "100%",
    bottom: 0,
  },
  h1: {
    margin: 0,
  },
  p: {
    fontSize: "1.2rem",
  },
};
