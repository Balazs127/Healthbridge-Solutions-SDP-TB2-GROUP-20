import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/calculator");
  };

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to Healthbridge Solutions</h1>
        <p style={styles.heroSubtitle}>Your GFR calculation resource</p>
        <button style={styles.heroButton} onClick={handleGetStartedClick}>
          Get Started
        </button>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>About Us</h2>
        <p style={styles.sectionText}>
          Healthbridge Solutions is dedicated to providing accurate and reliable GFR calculations to
          help you manage your health.
        </p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Services</h2>
        <ul style={styles.serviceList}>
          <li style={styles.serviceItem}>GFR Calculator</li>
          <li style={styles.serviceItem}>eGFR Data Analysis</li>
          <li style={styles.serviceItem}>Health Tips and Resources</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  hero: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "4rem",
    textAlign: "center",
    borderRadius: "8px",
    marginBottom: "2rem",
    width: "100%",
  },
  heroTitle: {
    fontSize: "2.5rem",
    margin: "0 0 1rem 0",
  },
  heroSubtitle: {
    fontSize: "1.5rem",
    margin: "0 0 2rem 0",
  },
  heroButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    color: "#4CAF50",
    backgroundColor: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  section: {
    marginBottom: "2rem",
    width: "100%",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2rem",
    margin: "0 0 1rem 0",
  },
  sectionText: {
    fontSize: "1.2rem",
    margin: "0 0 1rem 0",
  },
  serviceList: {
    listStyle: "none",
    padding: 0,
  },
  serviceItem: {
    fontSize: "1.2rem",
    margin: "0.5rem 0",
  },
};
