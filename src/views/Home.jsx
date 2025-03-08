import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useState, useEffect } from "react";
import { fetchUserData } from "../api/api";
import { colors, typography, spacing, components } from "../theme";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user.isAuthenticated) return;
    
    fetchUserData(user, setUserData)
      .catch((err) => {
        console.error(`Error in Home: ${err}`);
      });
  }, [user.isAuthenticated, user.userId, user.userType]);

  const handleGetStartedClick = () => {
    if (!user.isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/calculator");
    }
  };

  // Determine what name to display
  const getWelcomeMessage = () => {
    if (!user.isAuthenticated) {
      return "Welcome to Healthbridge Solutions";
    }

    // If we have user data with FirstName, use it
    if (userData && userData.FirstName) {
      return `Welcome, ${userData.FirstName}`;
    }

    // Fallback to user type and ID if name not available
    return `Welcome, ${user.userType === "patient" ? "Patient" : "Clinician"} ${user.userId}`;
  };

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>{getWelcomeMessage()}</h1>
        <p style={styles.heroSubtitle}>Your GFR calculation resource</p>
        <button style={styles.heroButton} onClick={handleGetStartedClick}>
          {user.isAuthenticated ? "Use Calculator" : "Get Started"}
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
    padding: spacing.lg,
  },
  hero: {
    backgroundColor: colors.primary.blue,
    color: colors.neutral.white,
    padding: spacing.xl,
    textAlign: "center",
    borderRadius: "0.5rem",
    marginBottom: spacing.lg,
    width: "100%",
  },
  heroTitle: {
    fontSize: typography.fontSize.h1,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.h3,
    marginBottom: spacing.lg,
  },
  heroButton: {
    ...components.buttons.primary,
    backgroundColor: colors.neutral.white,
    color: colors.primary.blue,
  },
  section: {
    marginBottom: spacing.lg,
    width: "100%",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.sm,
    color: colors.primary.midnightBlue,
  },
  sectionText: {
    fontSize: typography.fontSize.body,
    marginBottom: spacing.sm,
    color: colors.neutral.darkGray,
  },
  serviceList: {
    listStyle: "none",
    padding: 0,
  },
  serviceItem: {
    fontSize: typography.fontSize.body,
    margin: `${spacing.xs} 0`,
    color: colors.neutral.darkGray,
  },
};
