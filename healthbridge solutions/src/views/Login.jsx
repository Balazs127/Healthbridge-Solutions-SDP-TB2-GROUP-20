import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // You can add role-specific logic here if needed
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <button style={styles.button} onClick={() => handleLogin()}>
        Login as Patient
      </button>
      <button style={styles.button} onClick={() => handleLogin()}>
        Login as Clinician
      </button>
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
  button: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "1rem",
    width: "200px",
  },
};
