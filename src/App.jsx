import { Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./views/Home";
import Calculator from "./views/Calculator";
import CalculationData from "./views/CalculationData";
import PatientList from "./views/PatientList";
import BulkCalculation from "./views/BulkCalculation";
import Profile from "./views/Profile";
import Login from "./views/Login";
import { UserProvider } from "./contexts/UserProvider";
import { useUser } from "./hooks/useUser";
import "./App.css";
import PropTypes from "prop-types";
import { colors, typography, spacing, layout } from "./theme";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppContent() {
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    // Initial check
    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false); // Close menu after logout
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { to: "/", label: "Home", protected: false },
    { to: "/calculator", label: "GFR Calculator", protected: false },
    {
      to: user.userType === "clinician" ? "/patientList" : "/calculationData",
      label: user.userType === "clinician" ? "Patient View" : "Calculation Data",
      protected: true,
    },
    { to: "/profile", label: "Profile", protected: true },
  ];

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <h1 style={styles.h1}>Healthbridge Solutions</h1>

          {isMobile ? (
            <>
              <button
                style={styles.hamburger}
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-label="Toggle navigation menu"
              >
                <span style={styles.hamburgerLine}></span>
                <span style={styles.hamburgerLine}></span>
                <span style={styles.hamburgerLine}></span>
              </button>

              {menuOpen && (
                <div style={styles.mobileMenu}>
                  <ul style={styles.mobileNavList}>
                    {navLinks.map(
                      (link) =>
                        (!link.protected || user.isAuthenticated) && (
                          <li key={link.to} style={styles.mobileNavItem}>
                            <Link
                              to={link.to}
                              style={styles.mobileNavLink}
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        )
                    )}
                    <li style={styles.mobileNavItem}>
                      {user.isAuthenticated ? (
                        <button onClick={handleLogout} style={styles.mobileLogoutButton}>
                          Logout ({user.userType})
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          style={styles.mobileNavLink}
                          onClick={() => setMenuOpen(false)}
                        >
                          Login
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <ul style={styles.navList}>
              {navLinks.map(
                (link) =>
                  (!link.protected || user.isAuthenticated) && (
                    <li key={link.to} style={styles.navItem}>
                      <Link to={link.to} style={styles.navLink}>
                        {link.label}
                      </Link>
                    </li>
                  )
              )}
              <li style={styles.navItem}>
                {user.isAuthenticated ? (
                  <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout ({user.userType})
                  </button>
                ) : (
                  <Link to="/login" style={styles.navLink}>
                    Login
                  </Link>
                )}
              </li>
            </ul>
          )}
        </nav>
      </header>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calculationData"
            element={
              <ProtectedRoute>
                <CalculationData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patientList"
            element={
              <ProtectedRoute>
                <PatientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bulkCalculation"
            element={
              <ProtectedRoute>
                <BulkCalculation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patientData/:patientId"
            element={
              <ProtectedRoute>
                <CalculationData isClinicianView={true} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <footer style={styles.footer}>© 2025 Healthbridge Solutions</footer>
    </div>
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;

const styles = {
  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: typography.fontFamily.primary,
    margin: 0,
    padding: 0,
    backgroundColor: colors.neutral.lightGray,
    color: colors.neutral.darkGray,
  },
  header: {
    backgroundColor: colors.primary.blue,
    color: colors.neutral.white,
    padding: spacing.sm,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: layout.sections.header.height,
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: layout.container.maxWidth,
    margin: "0 auto",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
    alignItems: "center",
    height: "100%",
  },
  navItem: {
    marginLeft: spacing.md,
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  navLink: {
    color: colors.neutral.white,
    textDecoration: "none",
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: "0.25rem", // 4px
    display: "flex",
    alignItems: "center",
    height: "100%",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  logoutButton: {
    background: "none",
    border: "none",
    color: colors.neutral.white,
    cursor: "pointer",
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    height: "100%",
    textDecoration: "none",
    transition: "background-color 0.2s ease",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  main: {
    flex: 1,
    padding: spacing.lg,
    maxWidth: layout.container.maxWidth,
    margin: "0 auto",
    width: "100%",
  },
  footer: {
    backgroundColor: colors.primary.midnightBlue,
    color: colors.neutral.white,
    textAlign: "center",
    padding: layout.sections.footer.padding,
    width: "100%",
  },
  h1: {
    margin: 0,
    fontSize: typography.fontSize.h2,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.bold,
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  hamburger: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "2rem",
    height: "2rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0",
    zIndex: "20",
    marginRight: spacing.sm,
  },
  hamburgerLine: {
    width: "2rem",
    height: "0.25rem",
    backgroundColor: colors.neutral.white,
    borderRadius: "0.25rem",
    transition: "all 0.3s linear",
    position: "relative",
    transformOrigin: "1px",
  },
  mobileMenu: {
    position: "absolute",
    top: layout.sections.header.height,
    right: "0",
    width: "100%",
    backgroundColor: colors.primary.blue,
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.2)",
    zIndex: layout.zIndex.navigation,
  },
  mobileNavList: {
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    margin: "0",
    padding: spacing.sm,
    width: "100%",
  },
  mobileNavItem: {
    margin: `${spacing.xs} 0`,
    width: "100%",
  },
  mobileNavLink: {
    color: colors.neutral.white,
    textDecoration: "none",
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
    padding: spacing.sm,
    borderRadius: "0.25rem",
    display: "block",
    width: "100%",
    textAlign: "center",
    transition: "background-color 0.2s ease",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  mobileLogoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: colors.neutral.white,
    cursor: "pointer",
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
    padding: spacing.sm,
    borderRadius: "0.25rem",
    display: "block",
    width: "100%",
    textAlign: "center",
    transition: "background-color 0.2s ease",
  },
};
