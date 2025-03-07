import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handlePatientLogin = () => {
    // Use default ID if empty
    const patientId = userId.trim() || "2000000003";
    login("patient", patientId);
    navigate("/home");
  };

  const handleClinicianLogin = () => {
    // Use default ID if empty
    const clinicianId = userId.trim() || "H123456788";
    login("clinician", clinicianId);
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>

      <div style={styles.inputGroup}>
        <label htmlFor="userId" style={styles.label}>
          User ID:
        </label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter ID or leave blank for default"
          style={styles.input}
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handlePatientLogin}>
          Login as Patient
        </button>
        <button style={styles.button} onClick={handleClinicianLogin}>
          Login as Clinician
        </button>
      </div>

      <div style={styles.defaultIds}>
        <p>Default Patient ID: 2000000003</p>
        <p>Default Clinician ID: H123456788</p>
      </div>
    </div>
  );
};

export default Login;

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
    marginBottom: "2rem",
  },
  inputGroup: {
    marginBottom: "1.5rem",
    width: "300px",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "1rem",
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
  defaultIds: {
    marginTop: "2rem",
    textAlign: "center",
    color: "#666",
  },
};
