import PropTypes from "prop-types";

const CalculationData = ({ mongoData, loading, error }) => {
  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>Patient Records</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
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
                  <strong>Created At:</strong> {item.CreatedAt}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

CalculationData.propTypes = {
  mongoData: PropTypes.arrayOf(
    PropTypes.shape({
      PatientID: PropTypes.string.isRequired,
      ClinicianID: PropTypes.string.isRequired,
      Age: PropTypes.number.isRequired,
      Gender: PropTypes.string.isRequired,
      Ethnicity: PropTypes.string.isRequired,
      Creatinine: PropTypes.number.isRequired,
      eGFR: PropTypes.number.isRequired,
      CKD_Stage: PropTypes.string.isRequired,
      CreatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
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
