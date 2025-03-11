import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { colors, typography, spacing } from "../theme";
import CalculationResultsList from "../components/CalculationResultsList";
import { getCkdStageFromEgfr, formatGender } from "../constants/ckdStages";

const BulkCalculation = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [csvData, setCsvData] = useState([]);
  const [calculationResults, setCalculationResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        const parsedData = parseCSV(csvContent);
        setCsvData(parsedData);

        // Calculate eGFR for each patient
        const calculatedData = calculateBulkEGFR(parsedData, user.userId);
        setCalculationResults(calculatedData);
        setLoading(false);
      } catch (err) {
        setError("Error processing CSV file: " + err.message);
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  // Parse CSV content
  const parseCSV = (csvContent) => {
    const lines = csvContent.trim().split("\n");

    // Skip header row if it exists
    const dataStartIndex = lines[0].toLowerCase().includes("patientid") ? 1 : 0;

    return lines.slice(dataStartIndex).map((line) => {
      const [patientID, gender, yearOfBirth, ethnicity, creatinine] = line
        .split(",")
        .map((item) => item.trim());

      // Validate required fields
      if (!patientID || !gender || !yearOfBirth || !ethnicity || !creatinine) {
        throw new Error("CSV row has missing data: " + line);
      }

      // Calculate age from year of birth
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(yearOfBirth);

      return {
        PatientID: patientID,
        Gender: formatGender(gender), // Format gender on import
        Age: age,
        Ethnicity: ethnicity,
        Creatinine: parseFloat(creatinine),
      };
    });
  };

  // Calculate eGFR for each patient
  const calculateBulkEGFR = (patients, clinicianId) => {
    return patients.map((patient) => {
      // CKD-EPI equation logic
      let eGFR;
      const creatinine = patient.Creatinine;

      // Constants for the CKD-EPI equation
      const kappa = patient.Gender.toLowerCase() === "female" ? 0.7 : 0.9;
      const alpha = patient.Gender.toLowerCase() === "female" ? -0.329 : -0.411;
      const ethnicityFactor = patient.Ethnicity.toLowerCase() === "black" ? 1.159 : 1.0;

      // Calculate eGFR using CKD-EPI equation
      const creatOverKappa = creatinine / kappa;
      const minTerm = Math.min(creatOverKappa, 1);
      const maxTerm = Math.max(creatOverKappa, 1);

      eGFR =
        141 *
        Math.pow(minTerm, alpha) *
        Math.pow(maxTerm, -1.209) *
        Math.pow(0.993, patient.Age) *
        (patient.Gender.toLowerCase() === "female" ? 1.018 : 1) *
        ethnicityFactor;

      // Round to 2 decimal places
      eGFR = Math.round(eGFR * 100) / 100;

      // Determine CKD stage based on eGFR value using our helper function
      const ckdStageInfo = getCkdStageFromEgfr(eGFR);

      return {
        ...patient,
        ClinicianID: clinicianId,
        eGFR: eGFR,
        CKD_Stage: ckdStageInfo ? ckdStageInfo.dbValue : "Unknown", // Use database value format
        CreatedAt: new Date().toISOString(),
      };
    });
  };

  // Reset results and errors to allow a new upload
  const handleReset = () => {
    setCalculationResults([]);
    setCsvData([]);
    setError(null);
    document.getElementById("csvUpload").value = "";
  };

  return (
    <section style={styles.section}>
      <div style={styles.headerContainer}>
        <div style={styles.backButtonContainer}>
          <button onClick={() => navigate("/patientList")} style={styles.backButton}>
            &larr; Back to Patient List
          </button>
        </div>
        <h2 style={styles.h2}>Bulk eGFR Calculation from CSV</h2>
      </div>

      <div style={styles.uploadContainer}>
        <h3 style={styles.uploadTitle}>Upload Patient Data</h3>
        <p style={styles.instructionText}>
          Upload a CSV file with patient details to calculate eGFR values in bulk. Each row should
          contain: patientID, gender, year of birth, ethnicity, Creatinine value.
        </p>

        <div style={styles.fileInputWrapper}>
          <label htmlFor="csvUpload" style={styles.uploadLabel}>
            <span style={styles.uploadIcon}>📂</span>
            {calculationResults.length > 0 ? "Upload a different file" : "Choose CSV file"}
          </label>
          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={styles.fileInput}
          />
          {calculationResults.length > 0 && (
            <button onClick={handleReset} style={styles.resetButton}>
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingIndicator}>
          <p>Processing data...</p>
          <div style={styles.spinner}></div>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={handleReset} style={styles.tryAgainButton}>
            Try Again
          </button>
        </div>
      ) : calculationResults.length > 0 ? (
        <CalculationResultsList results={calculationResults} />
      ) : (
        <div style={styles.emptyState}>
          <p>No calculation results yet. Please upload a CSV file.</p>
          <p style={styles.sampleFormat}>Sample format: P12345,Female,1975,White,0.8</p>
        </div>
      )}
    </section>
  );
};

const styles = {
  section: {
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  headerContainer: {
    marginBottom: spacing.md,
  },
  h2: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary.midnightBlue,
    marginBottom: spacing.md,
  },
  uploadContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.neutral.white,
    borderRadius: "0.5rem",
    boxShadow: "0 0.125rem 0.25rem rgba(0,0,0,0.1)",
    border: `1px solid ${colors.neutral.lightGray}`,
  },
  uploadTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary.blue,
    marginTop: 0,
    marginBottom: spacing.sm,
  },
  instructionText: {
    fontSize: typography.fontSize.body,
    color: colors.neutral.darkGray,
    marginBottom: spacing.md,
  },
  fileInputWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: colors.primary.blue,
    color: colors.neutral.white,
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontWeight: typography.fontWeight.semiBold,
    transition: "background-color 0.2s ease",
  },
  uploadIcon: {
    marginRight: spacing.xs,
    fontSize: "1.2rem",
  },
  fileInput: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  resetButton: {
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: colors.neutral.white,
    color: colors.primary.blue,
    border: `1px solid ${colors.primary.blue}`,
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontWeight: typography.fontWeight.semiBold,
  },
  backButtonContainer: {
    marginBottom: spacing.sm,
  },
  backButton: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.primary.blue}`,
    color: colors.primary.blue,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
    transition: "background-color 0.2s ease",
  },
  errorContainer: {
    backgroundColor: "rgba(231, 70, 70, 0.1)",
    padding: spacing.md,
    borderRadius: "0.5rem",
    borderLeft: `4px solid ${colors.semantic.error}`,
    marginBottom: spacing.md,
  },
  errorMessage: {
    color: colors.semantic.error,
    fontWeight: typography.fontWeight.semiBold,
    margin: 0,
    marginBottom: spacing.sm,
  },
  tryAgainButton: {
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: colors.neutral.white,
    color: colors.semantic.error,
    border: `1px solid ${colors.semantic.error}`,
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontWeight: typography.fontWeight.semiBold,
  },
  loadingIndicator: {
    textAlign: "center",
    padding: spacing.lg,
  },
  spinner: {
    border: `4px solid ${colors.neutral.lightGray}`,
    borderTop: `4px solid ${colors.primary.blue}`,
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  emptyState: {
    textAlign: "center",
    padding: spacing.lg,
    color: colors.neutral.darkGray,
  },
  sampleFormat: {
    backgroundColor: colors.neutral.lightGray,
    padding: spacing.sm,
    borderRadius: "0.25rem",
    fontFamily: "monospace",
    display: "inline-block",
    marginTop: spacing.sm,
  },
};

export default BulkCalculation;
