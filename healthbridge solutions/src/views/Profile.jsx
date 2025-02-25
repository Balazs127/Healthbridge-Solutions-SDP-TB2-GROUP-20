import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [patient, setPatient] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [alertNeeded, setAlertNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch patient data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/patientlogin/2000000002")
      .then((response) => {
        setPatient(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data");
        setLoading(false);
      });
  }, []);

  // Fetch eGFR calculations and check if the most recent is older than 3 months
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/egfr_calculations?field=PatientID&value=2000000002")
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
  }, []);

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
      <h2 style={styles.title}>Profile</h2>
      {alertNeeded && (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          Your most recent eGFR calculation is older than 3 months. Please check in.
        </p>
      )}
      <p style={styles.text}>
        Welcome to your profile page, {patient?.FirstName} {patient?.LastName}.
      </p>
      <p style={styles.text}>Patient ID: {patient?._id}</p>
      <p style={styles.text}>DOB: {patient?.DOB}</p>
      <p style={styles.text}>Gender: {patient?.Gender}</p>
      <p style={styles.text}>Email: {patient?.Email}</p>
    </div>
  );
};

export default Profile;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
};
