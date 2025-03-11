import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCalculations, fetchPatientById } from "../api/api";
import { colors, typography, spacing } from "../theme";
import PropTypes from "prop-types";
import CalculationResultsList from "../components/CalculationResultsList";

const CalculationData = ({ isClinicianView = false }) => {
  // Hooks -------------------------------------------------------------------
  const { user } = useUser();
  const navigate = useNavigate();
  const { patientId } = useParams();

  // State -------------------------------------------------------------------
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(isClinicianView);

  // Effects -----------------------------------------------------------------
  // Fetch patient details if in clinician view
  useEffect(() => {
    if (isClinicianView && patientId) {
      fetchPatientById(patientId, setPatientDetails, setLoadingPatient, (err) =>
        console.error("Error fetching patient details:", err)
      );
    }
  }, [isClinicianView, patientId]);

  useEffect(() => {
    if (!user.isAuthenticated) return;

    // Determine which patient's data to show
    const targetPatientId = isClinicianView ? patientId : user.userId;
    console.log("Fetching calculations for patientId:", targetPatientId);

    fetchCalculations({ PatientID: targetPatientId }, setMongoData, setLoading, setError);
  }, [user.isAuthenticated, user.userId, user.userType, isClinicianView, patientId]);

  // Functions ---------------------------------------------------------------
  // Get patient name for display
  const getPatientName = () => {
    if (!isClinicianView) {
      return "Your eGFR Calculation History";
    }

    if (loadingPatient) {
      return "Loading patient details...";
    }

    if (!patientDetails) {
      return `eGFR History for Patient ${patientId || "Unknown"}`;
    }

    return `eGFR History for ${patientDetails.FirstName} ${patientDetails.LastName}`;
  };

  // View --------------------------------------------------------------------
  return (
    <section style={styles.section}>
      <div style={styles.headerContainer}>
        {isClinicianView && (
          <div style={styles.backButtonContainer}>
            <button onClick={() => navigate("/patientList")} style={styles.backButton}>
              &larr; Back to Patient List
            </button>
          </div>
        )}

        <h2 style={styles.h2}>{getPatientName()}</h2>
      </div>

      {loading ? (
        <div style={styles.loadingIndicator}>
          <p>Loading calculation history...</p>
          <div style={styles.spinner}></div>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      ) : mongoData.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No calculation history found.</p>
          {!isClinicianView && (
            <button onClick={() => navigate("/calculator")} style={styles.newCalculationButton}>
              Make a New Calculation
            </button>
          )}
        </div>
      ) : (
        <CalculationResultsList results={mongoData} />
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
  },
  errorMessage: {
    color: colors.semantic.error,
    fontWeight: typography.fontWeight.semiBold,
    margin: 0,
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
  newCalculationButton: {
    marginTop: spacing.sm,
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: colors.primary.blue,
    color: colors.neutral.white,
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
    fontWeight: typography.fontWeight.semiBold,
    fontSize: typography.fontSize.body,
  },
};

CalculationData.propTypes = {
  isClinicianView: PropTypes.bool,
};

export default CalculationData;
