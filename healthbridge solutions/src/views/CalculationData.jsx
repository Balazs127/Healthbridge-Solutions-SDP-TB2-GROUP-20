import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import axios from "axios";

const CalculationData = () => {
  const { user } = useUser();
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user.isAuthenticated) return;

    let apiUrl;

    // Different API endpoints based on user type
    if (user.userType === "patient") {
      // For patients, show their own data
      apiUrl = `http://localhost:5000/api/egfr_calculations?field=PatientID&value=${user.userId}`;
    } else if (user.userType === "clinician") {
      // For clinicians, show data for patients they're responsible for
      apiUrl = `http://localhost:5000/api/egfr_calculations?field=ClinicianID&value=${user.userId}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setMongoData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, [user.isAuthenticated, user.userId, user.userType]);

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>
        {user.userType === "patient"
          ? "Your GFR Calculation Records"
          : "Patient Records Under Your Care"}
      </h2>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : mongoData.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <>
          <p style={styles.recordCount}>
            {mongoData.length} record{mongoData.length !== 1 ? "s" : ""}
            found
          </p>
          <ul style={styles.dataList}>
            {mongoData.map((item, index) => (
              <li key={index} style={styles.dataItem}>
                <div style={styles.patientInfo}>
                  <p>
                    <strong>Patient ID:</strong> {item.PatientID}
                  </p>
                  <p>
                    <strong>Clinician ID:</strong> {item.ClinicianID}
                  </p>
                  <p>
                    <strong>Age:</strong> {item.Age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {item.Gender}
                  </p>
                  <p>
                    <strong>Ethnicity:</strong> {item.Ethnicity}
                  </p>
                  <p>
                    <strong>Creatinine:</strong> {item.Creatinine}
                  </p>
                  <p>
                    <strong>eGFR:</strong> {item.eGFR}
                  </p>
                  <p>
                    <strong>CKD Stage:</strong> {item.CKD_Stage}
                  </p>
                  <p>
                    <strong>Created At:</strong> {new Date(item.CreatedAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default CalculationData;

const styles = {
  section: {
    marginBottom: "2rem",
    padding: "1rem",
  },
  h2: {
    marginTop: "2rem",
    color: "#2c3e50",
  },
  recordCount: {
    marginBottom: "1rem",
    fontSize: "1.1rem",
    color: "#666",
  },
  dataList: {
    listStyle: "none",
    padding: 0,
  },
  dataItem: {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    margin: "1rem 0",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
  },
  patientInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
};
