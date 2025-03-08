import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { fetchCalculations } from "../api/api";
import { colors, typography, spacing, components } from "../theme";

const CalculationData = () => {
  const { user } = useUser();
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user.isAuthenticated) return;

    // Different field parameters based on user type
    const field = user.userType === "patient" ? "PatientID" : "ClinicianID";

    fetchCalculations(field, user.userId, setMongoData, setLoading, setError);
  }, [user.isAuthenticated, user.userId, user.userType]);

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>
        {user.userType === "patient"
          ? "Your GFR Calculation Records"
          : "Patient Records Under Your Care"}
      </h2>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : mongoData.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <>
          <p style={styles.recordCount}>
            {mongoData.length} record{mongoData.length !== 1 ? "s" : ""}
            found
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
};
