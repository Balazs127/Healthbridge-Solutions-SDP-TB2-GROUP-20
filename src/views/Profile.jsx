import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

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

    // Determine the API endpoint based on user type
    const endpoint =
      user.userType === "patient"
        ? `http://localhost:5000/api/patientlogin/${user.userId}`
        : `http://localhost:5000/api/clinicianlogin/${user.userId}`;

    axios
      .get(endpoint)
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error fetching ${user.userType} data:`, err);
        setError(`Failed to load ${user.userType} data`);
        setLoading(false);
      });
  }, [user.isAuthenticated, user.userId, user.userType]);

  // Only check eGFR calculations for patients
  useEffect(() => {
    if (!user.isAuthenticated || user.userType !== "patient") return;

    axios
      .get(`http://localhost:5000/api/egfr_calculations?field=PatientID&value=${user.userId}`)
      .then((response) => {
        setCalculations(response.data);

        if (response.data.length > 0) {
          const sorted = response.data.sort(
            (a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)
          );
          const mostRecent = new Date(sorted[0].CreatedAt);
          const now = new Date();
          const diffInDays = (now - mostRecent) / (1000 * 60 * 60 * 24);

          if (diffInDays > 90) {
            setAlertNeeded(true);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching calculations:", err);
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
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  alert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "1rem",
    marginBottom: "1.5rem",
    borderRadius: "0.25rem",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    fontWeight: "bold",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  profileField: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom: "1px solid #eee",
  },
  fieldLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  fieldValue: {
    color: "#333",
  },
};
