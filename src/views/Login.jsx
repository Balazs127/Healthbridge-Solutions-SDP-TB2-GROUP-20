import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { colors, typography, spacing, components } from "../theme";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error: loginError } = useUser();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handlePatientLogin = async () => {
    // Use default ID if empty
    const patientId = userId.trim() || "2000000003";
    try {
      await login("patient", patientId);
      navigate("/home");
    } catch (err) {
      setError("Failed to login. Please try again.");
    }
  };

  const handleClinicianLogin = async () => {
    // Use default ID if empty
    const clinicianId = userId.trim() || "H123456788";
    try {
      await login("clinician", clinicianId);
      navigate("/home");
    } catch (err) {
      setError("Failed to login. Please try again.");
    }
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

      {(error || loginError) && (
        <p style={styles.error}>{error || loginError}</p>
      )}

      <div style={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onClick={handlePatientLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login as Patient"}
        </button>
        <button 
          style={styles.button} 
          onClick={handleClinicianLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login as Clinician"}
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
    paddingTop: spacing.xxl,
    backgroundColor: colors.neutral.lightGray,
  },
  title: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.lg,
    color: colors.primary.midnightBlue,
  },
  inputGroup: {
    marginBottom: spacing.md,
    width: "18.75rem", // 300px
  },
  label: {
    ...components.forms.label,
  },
  input: {
    ...components.forms.input,
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    width: "18.75rem", // 300px
  },
  button: {
    ...components.buttons.primary,
    marginBottom: spacing.sm,
    width: "100%",
  },
  error: {
    color: colors.semantic.error,
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.small,
  },
  defaultIds: {
    marginTop: spacing.lg,
    textAlign: "center",
    color: colors.neutral.mediumGray,
    fontSize: typography.fontSize.small,
  },
};
