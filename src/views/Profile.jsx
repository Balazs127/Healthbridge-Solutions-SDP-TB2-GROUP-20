import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { fetchUserData, fetchCalculations } from "../api/api";
import { colors, typography, spacing, components } from "../theme";

const Profile = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [alertNeeded, setAlertNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data based on user type
  useEffect(() => {
    if (!user.isAuthenticated) return;
    
    fetchUserData(user, setUserData, setLoading, setError);
  }, [user.isAuthenticated, user.userId, user.userType]);

  // Only check eGFR calculations for patients
  useEffect(() => {
    if (!user.isAuthenticated || user.userType !== "patient") return;

    fetchCalculations("PatientID", user.userId, (data) => {
      setCalculations(data);

      if (data.length > 0) {
        const sorted = data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        const mostRecent = new Date(sorted[0].CreatedAt);
        const now = new Date();
        const diffInDays = (now - mostRecent) / (1000 * 60 * 60 * 24);

        if (diffInDays > 90) {
          setAlertNeeded(true);
        }
      }
    }).catch((err) => {
      console.error("Error in checking eGFR calculations:", err);
    });
  }, [user.isAuthenticated, user.userId, user.userType]);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Profile</h2>
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Profile</h2>
        <p style={styles.text}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {user.userType === "patient" ? "Patient Profile" : "Clinician Profile"}
      </h2>

      {/* Alert for patients with old eGFR calculation */}
      {user.userType === "patient" && alertNeeded && (
        <div style={styles.alert}>
          Your most recent eGFR calculation is older than 3 months. Please check in.
        </div>
      )}

      <div style={styles.profileCard}>
        <div style={styles.profileField}>
          <span style={styles.fieldLabel}>
            {user.userType === "patient" ? "Patient ID:" : "Clinician ID:"}
          </span>
          <span style={styles.fieldValue}>{userData?._id}</span>
        </div>

        <div style={styles.profileField}>
          <span style={styles.fieldLabel}>First Name:</span>
          <span style={styles.fieldValue}>{userData?.FirstName}</span>
        </div>

        <div style={styles.profileField}>
          <span style={styles.fieldLabel}>Last Name:</span>
          <span style={styles.fieldValue}>{userData?.LastName}</span>
        </div>

        <div style={styles.profileField}>
          <span style={styles.fieldLabel}>Email:</span>
          <span style={styles.fieldValue}>{userData?.Email}</span>
        </div>

        <div style={styles.profileField}>
          <span style={styles.fieldLabel}>Phone Number:</span>
          <span style={styles.fieldValue}>{userData?.PhoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.h2,
    marginBottom: spacing.sm,
    color: colors.primary.midnightBlue,
  },
  text: {
    fontSize: typography.fontSize.body,
    marginBottom: spacing.xs,
  },
  alert: {
    ...components.alert.warning,
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    marginBottom: spacing.sm,
    padding: spacing.sm,
    fontWeight: typography.fontWeight.bold,
  },
  profileCard: {
    ...components.card,
    width: "100%",
    maxWidth: "500px",
  },
  profileField: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${spacing.xs} 0`,
    borderBottom: `1px solid ${colors.neutral.lightGray}`,
  },
  fieldLabel: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.mediumGray,
  },
  fieldValue: {
    color: colors.neutral.darkGray,
  },
};
