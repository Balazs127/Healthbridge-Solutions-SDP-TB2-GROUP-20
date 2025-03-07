import { useState, useEffect } from "react";
import GFRCalculator from "../components/GFRCalculator";
import GFRGraph from "../components/GFRGraph";
import { useUser } from "../hooks/useUser";
import axios from "axios";

const Calculator = () => {
  const { user } = useUser();
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user.isAuthenticated || user.userType !== "patient") {
      setLoading(false);
      return;
    }

    const apiUrl = `http://localhost:5000/api/egfr_calculations?field=PatientID&value=${user.userId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setCalculationHistory(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching calculation history:", err);
        setError("Failed to load calculation history");
        setLoading(false);
      });
  }, [user.isAuthenticated, user.userId, user.userType]);

  const handleNewCalculation = (newCalculation) => {
    console.log("New calculation received in Calculator view:", newCalculation);

    let eGFRValue;
    if (newCalculation.eGFR_numeric) {
      eGFRValue = newCalculation.eGFR_numeric;
    } else {
      try {
        const eGFRString = String(newCalculation.eGFR || "0");
        const cleanedValue = eGFRString.replace(/[^\d.]/g, "");
        eGFRValue = parseFloat(cleanedValue);
      } catch (e) {
        console.error("Error parsing eGFR:", e);
        eGFRValue = 0;
      }
    }

    if (isNaN(eGFRValue)) {
      console.warn("Invalid eGFR value received:", newCalculation.eGFR);
      eGFRValue = 0; // Fallback
    }

    const calculationWithEnhancements = {
      ...newCalculation,
      CreatedAt: newCalculation.CreatedAt || new Date().toISOString(),
      eGFR: String(newCalculation.eGFR || eGFRValue),
      eGFR_numeric: eGFRValue,
    };

    setCalculationHistory((prevHistory) => {
      const newHistory = [...prevHistory, calculationWithEnhancements];
      console.log("Updated calculation history:", newHistory);
      return newHistory;
    });
  };

  return (
    <section style={styles.section}>
      <GFRCalculator onCalculationComplete={handleNewCalculation} />

      {/* Only show the graph for patients */}
      {user.isAuthenticated && user.userType === "patient" && (
        <div style={styles.graphSection}>
          {loading ? (
            <p style={styles.loadingText}>Loading your calculation history...</p>
          ) : error ? (
            <p style={styles.errorText}>{error}</p>
          ) : (
            <GFRGraph data={calculationHistory} />
          )}
        </div>
      )}
    </section>
  );
};

export default Calculator;

const styles = {
  section: {
    marginBottom: "2rem",
  },
  graphSection: {
    marginTop: "2rem",
    borderTop: "1px solid #e0e0e0",
    paddingTop: "1.5rem",
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    padding: "1rem",
  },
  errorText: {
    textAlign: "center",
    color: "#dc3545",
    padding: "1rem",
  },
};
