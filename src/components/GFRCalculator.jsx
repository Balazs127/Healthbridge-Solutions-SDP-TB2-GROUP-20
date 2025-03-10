import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUser } from "../hooks/useUser";
import { post, fetchUserData } from "../api/api";
import { colors, typography, spacing, components } from "../theme";
import "../styles/calculatorStyles.css"; // Import the CSS file

export default function GFRCalculator({ onCalculationComplete }) {
  // State -------------------------------------------------------------------
  const { user } = useUser();
  const [creatinine, setCreatinine] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("mg/dL");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [clinianID, setClinicianID] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [egfr, setEGFR] = useState("");
  const [ckdStage, setCKDStage] = useState("");
  const [pediatricMessage, setPediatricMessage] = useState("");
  const [calculating, setCalculating] = useState(false);

  // Functions -------------------------------------------------------
  // Map ethnicity values from database to dropdown options
  const mapGender = (dbGender) => {
    if (!dbGender) return "";
    return dbGender.toLowerCase();
  };

  const mapEthnicity = (dbEthnicity) => {
    if (!dbEthnicity) return "";

    const ethnicityMap = {
      black: "black",
      white: "white",
      asian: "asian",
      hispanic: "hispanic",
      caucasian: "caucasian",
      indian: "indian",
      latino: "latino",
      other: "other",
    };

    return ethnicityMap[dbEthnicity.toLowerCase()] || "other";
  };

  // Effects -----------------------------------------------------------------
  // Fetch user data and populate form fields
  useEffect(() => {
    if (user && user.isAuthenticated && user.userType === "patient") {
      console.log("Fetching user data for calculator...");
      fetchUserData(
        user,
        (data) => {
          console.log("User data received:", data);

          // Calculate age from DOB if available
          if (data.DOB) {
            const dob = new Date(data.DOB);
            const today = new Date();
            let calculatedAge = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
              calculatedAge--;
            }

            setAge(calculatedAge.toString());
          }

          // Set gender if available
          if (data.Gender) {
            const mappedGender = mapGender(data.Gender);
            setGender(mappedGender);
          }

          // Set ethnicity if available
          if (data.Ethnicity) {
            const mappedEthnicity = mapEthnicity(data.Ethnicity);
            setEthnicity(mappedEthnicity);
          }

          // Set clinician if available
          if (data.ClinicianID) {
            setClinicianID(data.ClinicianID);
          }
        },
        null,
        (error) => {
          console.error("Error loading user data for GFR calculator:", error);
        }
      );
    }
  }, [user]);

  // Helpers -----------------------------------------------------------------
  // Format CKD stage for database compatibility
  const formatCKDStageForDatabase = (stageCode) => {
    if (stageCode.startsWith("G")) {
      return stageCode.substring(1);
    }
    return stageCode;
  };

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

  // Handlers ----------------------------------------------------------------
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

    const dbGender = gender.charAt(0).toUpperCase() + gender.slice(1);
    const dbEthnicity = ethnicity.charAt(0).toUpperCase() + ethnicity.slice(1);
    const dbCKDStage = formatCKDStageForDatabase(stageCode);

    const dbCalculationData = {
      PatientID: user.userType === "patient" ? user.userId : "",
      ClinicianID: user.userType === "clinician" ? user.userId : clinianID,
      Age: ageValue,
      Gender: dbGender,
      Ethnicity: dbEthnicity,
      Creatinine: creatValue,
      eGFR: egfrValue.toString(),
      CKD_Stage: dbCKDStage,
      CreatedAt: currentDate,
    };

    const frontendCalculationData = {
      ...dbCalculationData,
      eGFR_numeric: egfrValue, // Include for frontend use only, not for database
    };

    if (user.isAuthenticated && onCalculationComplete) {
      try {
        const response = await post("egfr_calculations", dbCalculationData);

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

  // View --------------------------------------------------------------------
  return (
    <div style={styles.calculator} className="calculator-form">
      <h2 style={styles.title}>eGFR Calculator</h2>

      <div className="input-group" style={styles.inputGroup}>
        <label htmlFor="creatinine" className="form-label" style={styles.label}>
          Creatinine:
        </label>
        <div className="input-with-unit" style={styles.inputWithUnit}>
          <input
            id="creatinine"
            type="number"
            value={creatinine}
            onChange={(e) => setCreatinine(e.target.value)}
            className="input-with-unit-field input-control"
            style={styles.inputWithAddon}
            placeholder="Enter value"
            aria-label="Creatinine value"
          />
          <select
            id="creatinineUnit"
            value={creatinineUnit}
            onChange={handleCreatinineUnitChange}
            className="unit-selector"
            style={styles.selectUnit}
            aria-label="Creatinine unit"
          >
            <option value="mg/dL">mg/dL</option>
            <option value="µmol/L">µmol/L</option>
          </select>
        </div>
      </div>

      <div className="input-group" style={styles.inputGroup}>
        <label htmlFor="age" className="form-label" style={styles.label}>
          Age (years):
        </label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="input-control"
          style={styles.input}
          placeholder="Enter age"
          aria-label="Age in years"
        />
      </div>

      <div className="input-group" style={styles.inputGroup}>
        <label htmlFor="gender" className="form-label" style={styles.label}>
          Gender:
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="input-control"
          style={styles.select}
          aria-label="Select gender"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="input-group" style={styles.inputGroup}>
        <label htmlFor="ethnicity" className="form-label" style={styles.label}>
          Ethnicity:
        </label>
        <select
          id="ethnicity"
          value={ethnicity}
          onChange={(e) => setEthnicity(e.target.value)}
          className="input-control"
          style={styles.select}
          aria-label="Select ethnicity"
        >
          <option value="">Select Ethnicity</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="asian">Asian</option>
          <option value="hispanic">Hispanic</option>
          <option value="caucasian">Caucasian</option>
          <option value="latino">Latino</option>
          <option value="indian">Indian</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        onClick={calculateEGFR}
        disabled={calculating}
        style={styles.button}
        aria-busy={calculating}
      >
        {calculating ? "Calculating..." : "Calculate eGFR"}
      </button>

      {pediatricMessage && (
        <div style={styles.message} role="alert">
          <p>{pediatricMessage}</p>
        </div>
      )}

      {egfr && !pediatricMessage && (
        <div style={styles.results} role="region" aria-live="polite">
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

const styles = {
  calculator: {
    ...components.card,
    maxWidth: "37.5rem", // 600px
    margin: "0 auto",
  },
  title: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.md,
    textAlign: "center",
    color: colors.primary.midnightBlue,
  },
  inputGroup: {
    marginBottom: spacing.sm,
    display: "flex",
  },
  label: {
    width: "7.5rem", // 120px
    fontWeight: typography.fontWeight.semiBold,
    color: colors.neutral.darkGray,
  },
  input: {
    ...components.forms.input,
    flex: "1",
  },
  select: {
    ...components.forms.input,
    marginLeft: spacing.xs,
  },
  inputWithUnit: {
    display: "flex",
    flex: "1",
  },
  inputWithAddon: {
    ...components.forms.input,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: "none",
    flex: "1",
  },
  selectUnit: {
    ...components.forms.input,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeft: "none",
    width: "5rem",
    minWidth: "5rem",
    padding: `0.75rem 0.5rem`,
    textAlign: "center",
  },
  button: {
    ...components.buttons.primary,
    width: "100%",
    marginTop: spacing.md,
  },
  message: {
    ...components.alert.warning,
    marginTop: spacing.sm,
  },
  results: {
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    padding: spacing.md,
    borderRadius: "0.25rem", // 4px
    marginTop: spacing.md,
  },
  resultText: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    fontSize: typography.fontSize.body,
    color: colors.primary.midnightBlue,
  },
};

GFRCalculator.propTypes = {
  onCalculationComplete: PropTypes.func,
};
