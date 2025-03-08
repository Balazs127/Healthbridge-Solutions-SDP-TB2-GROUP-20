import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCalculations, fetchPatientById } from "../api/api";
import { colors, typography, spacing } from "../theme";

const CalculationData = ({ isClinicianView = false }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(isClinicianView);

  // Fetch patient details if in clinician view
  useEffect(() => {
    if (isClinicianView && patientId) {
      fetchPatientById(
        patientId, 
        setPatientDetails, 
        setLoadingPatient, 
        (err) => console.error("Error fetching patient details:", err)
      );
    }
  }, [isClinicianView, patientId]);

  useEffect(() => {
    if (!user.isAuthenticated) return;

    // Determine which patient's data to show
    const targetPatientId = isClinicianView ? patientId : user.userId;
    console.log("Fetching calculations for patientId:", targetPatientId);
    
    const field = "PatientID";
    
    fetchCalculations(
      field, 
      targetPatientId, 
      setMongoData, 
      setLoading, 
      setError
    );
  }, [user.isAuthenticated, user.userId, user.userType, isClinicianView, patientId]);

  // Get patient name for display
  const getPatientName = () => {
    if (!isClinicianView) {
      return "Your GFR Calculation Records";
    }
    
    if (loadingPatient) {
      return "Loading patient details...";
    }
    
    if (!patientDetails) {
      return `GFR Records for Patient ${patientId || "Unknown"}`;
    }
    
    return `GFR Records for ${patientDetails.FirstName} ${patientDetails.LastName}`;
  };

  return (
    <section style={styles.section}>
      {isClinicianView && (
        <div style={styles.backButtonContainer}>
          <button 
            onClick={() => navigate("/patientList")}
            style={styles.backButton}
          >
            &larr; Back to Patient List
          </button>
        </div>
      )}
      
      <h2 style={styles.h2}>{getPatientName()}</h2>
      
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={styles.errorMessage}>{error}</p>
      ) : mongoData.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <>
          <p style={styles.recordCount}>
            {mongoData.length} record{mongoData.length !== 1 ? "s" : ""} found
          </p>
          <ul style={styles.dataList}>
            {mongoData.map((item, index) => (
              <li key={index} style={styles.dataItem}>
                <div style={styles.patientInfo}>
                  <p>
                    <strong>Patient ID:</strong> {item.PatientID}
                  </p>
                  <p>
                    <strong>Clinician ID:</strong> {item.ClinicianID}
                  </p>
                  <p>
                    <strong>Age:</strong> {item.Age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {item.Gender}
                  </p>
                  <p>
                    <strong>Ethnicity:</strong> {item.Ethnicity}
                  </p>
                  <p>
                    <strong>Creatinine:</strong> {item.Creatinine}
                  </p>
                  <p>
                    <strong>eGFR:</strong> {item.eGFR}
                  </p>
                  <p>
                    <strong>CKD Stage:</strong> {item.CKD_Stage}
                  </p>
                  <p>
                    <strong>Created At:</strong> {new Date(item.CreatedAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default CalculationData;

const styles = {
  section: {
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  h2: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing.lg,
    color: colors.primary.midnightBlue,
  },
  recordCount: {
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.body,
    color: colors.neutral.mediumGray,
  },
  dataList: {
    listStyle: "none",
    padding: 0,
  },
  dataItem: {
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    margin: `${spacing.sm} 0`,
    borderRadius: "0.5rem", // 8px
    boxShadow: "0 0.125rem 0.25rem rgba(0,0,0,0.1)", // 0 2px 4px
    border: `0.0625rem solid ${colors.neutral.lightGray}`, // 1px
  },
  patientInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(12.5rem, 1fr))", // 200px
    gap: spacing.sm,
    color: colors.neutral.darkGray,
    fontSize: typography.fontSize.body,
  },
  backButtonContainer: {
    marginBottom: spacing.md,
  },
  backButton: {
    backgroundColor: colors.neutral.white,
    border: `1px solid ${colors.primary.blue}`,
    color: colors.primary.blue,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
  },
  errorMessage: {
    color: colors.semantic.error,
    fontWeight: typography.fontWeight.semiBold,
  }
};
