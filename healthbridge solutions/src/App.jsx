// import { useState } from "react";
import "./App.css";
import GFRCalculator from "./components/GFRCalculator";

function App() {
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Healthbridge Solutions</h1>
      </header>
      <main style={styles.main}>
        <p style={styles.p}>Welcome to Healthbridge Solutions, your GFR calculation resource.</p>
        <GFRCalculator />
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
