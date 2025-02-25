import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Home from "./views/Home";
import Calculator from "./views/Calculator";
import CalculationData from "./views/CalculationData";
import Profile from "./views/Profile";
import Login from "./views/Login";
import axios from "axios";
import "./App.css"; // Assuming you have a CSS file for additional styles

function App() {
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/egfr_calculations?field=PatientID&value=2000000002")
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
    <Router>
      <div style={styles.body}>
        <header style={styles.header}>
          <nav style={styles.nav}>
            <h1 style={styles.h1}>Healthbridge Solutions</h1>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <Link to="/" style={styles.navLink}>
                  Home
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/calculator" style={styles.navLink}>
                  GFR Calculator
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/calculationData" style={styles.navLink}>
                  Calculation Data
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/profile" style={styles.navLink}>
                  Profile
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/login" style={styles.navLink}>
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/calculationData"
              element={<CalculationData mongoData={mongoData} loading={loading} error={error} />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <footer style={styles.footer}>© 2025 Healthbridge Solutions</footer>
      </div>
    </Router>
  );
}

export default App;

const styles = {
  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
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
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "1rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
  },
  main: {
    flex: 1,
    padding: "2rem",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#4CAF50",
    color: "white",
    textAlign: "center",
    padding: "1rem",
    width: "100%",
  },
  h1: {
    margin: 0,
  },
};
