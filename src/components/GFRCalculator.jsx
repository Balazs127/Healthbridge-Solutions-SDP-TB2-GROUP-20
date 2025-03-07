import { useState } from "react";
import PropTypes from "prop-types";
import { useUser } from "../hooks/useUser";
import axios from "axios";

export default function GFRCalculator({ onCalculationComplete }) {
  const { user } = useUser();
  const [creatinine, setCreatinine] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("mg/dL");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [egfr, setEGFR] = useState("");
  const [ckdStage, setCKDStage] = useState("");
  const [pediatricMessage, setPediatricMessage] = useState("");
  const [calculating, setCalculating] = useState(false);

  const determineCKDStage = (egfrValue) => {
    if (egfrValue >= 90) return "G1";
    if (egfrValue >= 60) return "G2";
    if (egfrValue >= 45) return "G3a";
    if (egfrValue >= 30) return "G3b";
    if (egfrValue >= 15) return "G4";
    return "G5";
  };

  const getFullStageName = (stageCode) => {
    const stageNames = {
      G1: "Stage 1 (Normal or High)",
      G2: "Stage 2 (Mildly Decreased)",
      G3a: "Stage 3A (Mild to Moderate Decrease)",
      G3b: "Stage 3B (Moderate to Severe Decrease)",
      G4: "Stage 4 (Severely Decreased)",
      G5: "Stage 5 (Kidney Failure)",
    };
    return stageNames[stageCode] || stageCode;
  };

  const handleCreatinineUnitChange = (e) => {
    const newUnit = e.target.value;
    let newCreatinine = parseFloat(creatinine);

    if (creatinineUnit === "mg/dL" && newUnit === "µmol/L") {
      newCreatinine = newCreatinine * 88.4;
    } else if (creatinineUnit === "µmol/L" && newUnit === "mg/dL") {
      newCreatinine = newCreatinine / 88.4;
    }

    setCreatinineUnit(newUnit);
    setCreatinine(newCreatinine.toFixed(2));
  };

  const calculateEGFR = async () => {
    setCalculating(true);
    let creatValue = parseFloat(creatinine);
    const ageValue = parseFloat(age);

    if (isNaN(creatValue) || creatValue <= 0) {
      setEGFR("Invalid creatinine level");
      setCalculating(false);
      return;
    }

    if (isNaN(ageValue) || ageValue < 18) {
      setPediatricMessage(
        "For users under 18 years old, please use the Pediatric version of the calculator."
      );
      setCalculating(false);
      return;
    }

    // Convert creatinine to mg/dL if the unit is µmol/L
    if (creatinineUnit === "µmol/L") {
      creatValue = creatValue / 88.4;
    }

    let gFactor = gender.toLowerCase() === "female" ? 0.742 : 1;
    let eFactor = ethnicity.toLowerCase() === "black" ? 1.21 : 1;
    let formula =
      186 * Math.pow(creatValue, -1.154) * Math.pow(ageValue || 1, -0.203) * gFactor * eFactor;
    const egfrValue = parseFloat(formula.toFixed(2));
    const stageCode = determineCKDStage(egfrValue);
    const stageName = getFullStageName(stageCode);

    setEGFR(`${egfrValue} ml/min/1.73m²`);
    setCKDStage(stageName);
    setPediatricMessage("");

    const currentDate = new Date().toISOString();

    const dbCalculationData = {
      PatientID: user.userType === "patient" ? user.userId : "",
      ClinicianID: user.userType === "clinician" ? user.userId : "",
      Age: ageValue,
      Gender: gender,
      Ethnicity: ethnicity,
      Creatinine: creatValue,
      eGFR: egfrValue.toString(),
      CKD_Stage: stageCode,
      CreatedAt: currentDate,
    };

    const frontendCalculationData = {
      ...dbCalculationData,
      eGFR_numeric: egfrValue, // Include for frontend use only, not for database
    };

    if (user.isAuthenticated && onCalculationComplete) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/egfr_calculations",
          dbCalculationData
        );

        if (response.data) {
          const resultData = {
            ...response.data,
            CreatedAt: response.data.CreatedAt || currentDate,
            eGFR_numeric: egfrValue,
          };
          onCalculationComplete(resultData);
        }
      } catch (error) {
        console.error("Error saving calculation:", error);
        if (onCalculationComplete) {
          console.log("Using local calculation data:", frontendCalculationData);
          onCalculationComplete(frontendCalculationData);
        }
      }
    } else if (onCalculationComplete) {
      console.log("No DB interaction, using local data:", frontendCalculationData);
      onCalculationComplete(frontendCalculationData);
    }

    setCalculating(false);
  };

  return (
    <div style={styles.calculator}>
      <h2 style={styles.title}>eGFR Calculator</h2>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Creatinine: </label>
        <input
          type="number"
          value={creatinine}
          onChange={(e) => setCreatinine(e.target.value)}
          style={styles.input}
        />
        <select value={creatinineUnit} onChange={handleCreatinineUnitChange} style={styles.select}>
          <option value="mg/dL">mg/dL</option>
          <option value="µmol/L">µmol/L</option>
        </select>
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Age (years): </label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Gender: </label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.select}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Ethnicity: </label>
        <select
          value={ethnicity}
          onChange={(e) => setEthnicity(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Ethnicity</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="asian">Asian</option>
          <option value="indian">Indian</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button onClick={calculateEGFR} disabled={calculating} style={styles.button}>
        {calculating ? "Calculating..." : "Calculate eGFR"}
      </button>

      {pediatricMessage && (
        <div style={styles.message}>
          <p>{pediatricMessage}</p>
        </div>
      )}

      {egfr && !pediatricMessage && (
        <div style={styles.results}>
          <p style={styles.resultText}>
            <strong>Result:</strong> {egfr}
          </p>
          <p style={styles.resultText}>
            <strong>CKD Stage:</strong> {ckdStage}
          </p>
        </div>
      )}
    </div>
  );
}

GFRCalculator.propTypes = {
  onCalculationComplete: PropTypes.func,
};

const styles = {
  calculator: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    color: "#2c3e50",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
  },
  label: {
    width: "120px",
    fontWeight: "500",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    flex: "1",
  },
  select: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginLeft: "0.5rem",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "1rem",
    width: "100%",
  },
  message: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "0.75rem",
    borderRadius: "4px",
    marginTop: "1rem",
  },
  results: {
    backgroundColor: "#e8f4f8",
    padding: "1rem",
    borderRadius: "4px",
    marginTop: "1.5rem",
  },
  resultText: {
    margin: "0.5rem 0",
    fontSize: "1.1rem",
  },
};
