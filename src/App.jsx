import { Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./views/Home";
import Calculator from "./views/Calculator";
import CalculationData from "./views/CalculationData";
import Profile from "./views/Profile";
import Login from "./views/Login";
import { UserProvider } from "./contexts/UserProvider";
import { useUser } from "./hooks/useUser";
import "./App.css";
import PropTypes from "prop-types";
import { colors, typography, spacing, layout } from "./theme";

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

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <h1 style={styles.h1}>Healthbridge Solutions</h1>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/" style={styles.navLink}>
                Home
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/calculator" style={styles.navLink}>
                GFR Calculator
              </Link>
            </li>
            {/* Only show protected links when user is authenticated */}
            {user.isAuthenticated && (
              <>
                <li style={styles.navItem}>
                  <Link to="/calculationData" style={styles.navLink}>
                    Calculation Data
                  </Link>
                </li>
                <li style={styles.navItem}>
                  <Link to="/profile" style={styles.navLink}>
                    Profile
                  </Link>
                </li>
              </>
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
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
};
