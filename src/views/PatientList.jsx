import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { fetchPatientsByClinicianId } from "../api/api";
import { colors, typography, spacing } from "../theme";

const PatientList = () => {
  const { user } = useUser();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user.isAuthenticated || user.userType !== "clinician") return;

    // Debug user ID to make sure it's correct
    console.log("Fetching patients for clinician:", user.userId);
    
    fetchPatientsByClinicianId(user.userId, setPatients, setLoading, setError);
  }, [user]);

  // Log patient data whenever it changes
  useEffect(() => {
    console.log("Patient data received:", patients);
  }, [patients]);

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>Patients Under Your Care</h2>
      
      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <p style={styles.errorMessage}>{error}</p>
      ) : patients.length === 0 ? (
        <p>No patients found under your care.</p>
      ) : (
        <>
          <p style={styles.recordCount}>
            {patients.length} patient{patients.length !== 1 ? "s" : ""} found
          </p>
          <ul style={styles.patientList}>
            {patients.map((patient) => {
              // Use the _id field as patient ID
              const patientId = patient._id;
              return (
                <li key={patientId} style={styles.patientItem}>
                  <Link to={`/patientData/${patientId}`} style={styles.patientLink}>
                    <div style={styles.patientCard}>
                      <h3 style={styles.patientName}>
                        {patient.FirstName} {patient.LastName}
                      </h3>
                      <div style={styles.patientDetails}>
                        <p><strong>Patient ID:</strong> {patientId}</p>
                        <p><strong>Email:</strong> {patient.Email}</p>
                        <p><strong>Phone:</strong> {patient.PhoneNumber || "N/A"}</p>
                      </div>
                      <div style={styles.viewButton}>
                        View Patient Records
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};

export default PatientList;

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
  errorMessage: {
    color: colors.semantic.error,
    fontWeight: typography.fontWeight.semiBold,
  },
  recordCount: {
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.body,
    color: colors.neutral.mediumGray,
  },
  patientList: {
    listStyle: "none",
    padding: 0,
  },
  patientItem: {
    margin: `${spacing.sm} 0`,
  },
  patientLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  patientCard: {
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: "0.5rem",
    boxShadow: "0 0.125rem 0.25rem rgba(0,0,0,0.1)",
    border: "0.0625rem solid ${colors.neutral.lightGray}",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    ':hover': {
      transform: "translateY(-2px)",
      boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.15)",
    },
  },
  patientName: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: 0,
    color: colors.primary.blue,
  },
  patientDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(12.5rem, 1fr))",
    gap: spacing.sm,
    color: colors.neutral.darkGray,
    fontSize: typography.fontSize.body,
    marginBottom: spacing.md,
  },
  viewButton: {
    backgroundColor: colors.primary.blue,
    color: colors.neutral.white,
    padding: spacing.xs,
    borderRadius: "0.25rem",
    textAlign: "center",
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing.sm,
  },
};
