import { useState, useEffect } from "react";
import GFRCalculator from "../components/GFRCalculator";
import GFRGraph from "../components/GFRGraph";
import { useUser } from "../hooks/useUser";
import { fetchCalculations } from "../api/api";
import { colors, typography, spacing } from "../theme";

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

    fetchCalculations(
      "PatientID",
      user.userId,
      setCalculationHistory,
      setLoading,
      setError,
      "Failed to load calculation history"
    );
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
    marginBottom: spacing.lg,
  },
  graphSection: {
    marginTop: spacing.lg,
    borderTop: `1px solid ${colors.neutral.lightGray}`,
    paddingTop: spacing.md,
  },
  loadingText: {
    textAlign: "center",
    color: colors.neutral.mediumGray,
    padding: spacing.sm,
    fontSize: typography.fontSize.body,
  },
  errorText: {
    textAlign: "center",
    color: colors.semantic.error,
    padding: spacing.sm,
    fontSize: typography.fontSize.body,
  },
};
