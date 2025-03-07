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
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#f4f4f4",
    color: "#333",
  },
  header: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "1rem",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "1rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
  },
  logoutButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
    padding: 0,
    textDecoration: "underline",
  },
  main: {
    flex: 1,
    padding: "2rem",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#4CAF50",
    color: "white",
    textAlign: "center",
    padding: "1rem",
    width: "100%",
  },
  h1: {
    margin: 0,
  },
};
