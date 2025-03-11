import { useState } from "react";
import PropTypes from "prop-types";
import { colors, typography, spacing } from "../theme";
import { getCkdStageById, getCkdStageFromEgfr, formatGender } from "../constants/ckdStages";
import CkdStageLegend from "./CkdStageLegend";

const CalculationResultsList = ({ results }) => {
  const [sortField, setSortField] = useState("CreatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showLegend, setShowLegend] = useState(false);

  if (!results || results.length === 0) {
    return <p>No calculation results available.</p>;
  }

  // Handle changing sort field and direction
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort the results
  const sortedResults = [...results].sort((a, b) => {
    let comparison = 0;

    if (sortField === "eGFR" || sortField === "Creatinine" || sortField === "Age") {
      comparison = a[sortField] - b[sortField];
    } else if (sortField === "CKD_Stage") {
      // Extract stage information for comparison
      const stageA = getCkdStageById(a[sortField]);
      const stageB = getCkdStageById(b[sortField]);

      // Compare by minValue (lower minValue means more severe stage)
      if (stageA && stageB) {
        comparison = stageB.minValue - stageA.minValue; // Reverse order so G5 comes before G1
      }
    } else {
      comparison = String(a[sortField]).localeCompare(String(b[sortField]));
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Get CKD stage information
  const getCkdStageInfo = (result) => {
    if (result.CKD_Stage) {
      return getCkdStageById(result.CKD_Stage);
    }
    return getCkdStageFromEgfr(result.eGFR);
  };

  // Format gender for display
  const getFormattedGender = (gender) => {
    return formatGender(gender);
  };

  // Toggle legend visibility
  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  return (
    <div style={styles.container}>
      <div style={styles.controlPanel}>
        <div style={styles.sortControls}>
          <span style={styles.sortLabel}>Sort by:</span>
          <select
            value={sortField}
            onChange={(e) => handleSort(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="CreatedAt">Date</option>
            <option value="eGFR">eGFR Value</option>
            <option value="CKD_Stage">CKD Stage</option>
            <option value="PatientID">Patient ID</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            style={styles.sortDirectionButton}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
        <div style={styles.resultCount}>
          <span>
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
          <button onClick={toggleLegend} style={styles.legendToggleButton}>
            {showLegend ? "Hide Legend" : "Show Legend"}
          </button>
        </div>
      </div>

      {showLegend && <CkdStageLegend />}

      <ul style={styles.resultsList}>
        {sortedResults.map((result, index) => {
          const ckdStageInfo = getCkdStageInfo(result);
          const formattedGender = getFormattedGender(result.Gender);

          return (
            <li key={index} style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div style={styles.patientInfo}>
                  <h3 style={styles.patientId}>Patient ID: {result.PatientID}</h3>
                  <p style={styles.timestamp}>{new Date(result.CreatedAt).toLocaleString()}</p>
                </div>
                <div style={styles.resultSummary}>
                  <div style={styles.egfrValue}>
                    <span style={styles.egfrLabel}>eGFR</span>
                    <span style={styles.egfrNumber}>{result.eGFR}</span>
                  </div>
                  <div
                    style={{
                      ...styles.ckdStage,
                      backgroundColor: ckdStageInfo ? ckdStageInfo.color : "#999999",
                    }}
                  >
                    {ckdStageInfo ? ckdStageInfo.id : result.CKD_Stage || "Unknown"}
                  </div>
                </div>
              </div>

              <div style={styles.resultDetails}>
                <div style={styles.detailColumn}>
                  <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Age:</span> {result.Age}
                  </p>
                  <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Gender:</span> {formattedGender}
                  </p>
                  <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Ethnicity:</span> {result.Ethnicity}
                  </p>
                </div>
                <div style={styles.detailColumn}>
                  <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Creatinine:</span> {result.Creatinine} mg/dL
                  </p>
                  <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Clinician ID:</span> {result.ClinicianID}
                  </p>
                  {ckdStageInfo && (
                    <p style={styles.detailItem}>
                      <span style={styles.detailLabel}>Stage description:</span>
                      <span style={{ color: ckdStageInfo.color, fontWeight: "500" }}>
                        {ckdStageInfo.description}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

CalculationResultsList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      PatientID: PropTypes.string.isRequired,
      ClinicianID: PropTypes.string,
      Age: PropTypes.number.isRequired,
      Gender: PropTypes.string.isRequired,
      Ethnicity: PropTypes.string.isRequired,
      Creatinine: PropTypes.number.isRequired,
      eGFR: PropTypes.number.isRequired,
      CKD_Stage: PropTypes.string.isRequired,
      CreatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const styles = {
  container: {
    marginTop: spacing.md,
  },
  controlPanel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    flexWrap: "wrap",
  },
  sortControls: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  sortLabel: {
    marginRight: spacing.xs,
    fontSize: typography.fontSize.small,
    color: colors.neutral.darkGray,
  },
  sortSelect: {
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: "0.25rem",
    border: `1px solid ${colors.neutral.mediumGray}`,
    backgroundColor: colors.neutral.white,
    marginRight: spacing.xs,
  },
  sortDirectionButton: {
    padding: `0 ${spacing.xs}`,
    backgroundColor: colors.primary.blue,
    color: colors.neutral.white,
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    height: "2rem",
    width: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  resultCount: {
    fontSize: typography.fontSize.small,
    color: colors.neutral.mediumGray,
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
  },
  resultsList: {
    listStyle: "none",
    padding: 0,
  },
  resultCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: "0.5rem",
    boxShadow: "0 0.125rem 0.25rem rgba(0,0,0,0.1)",
    marginBottom: spacing.md,
    overflow: "hidden",
    border: `1px solid ${colors.neutral.lightGray}`,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.sm,
    borderBottom: `1px solid ${colors.neutral.mediumGray}`,
    backgroundColor: colors.primary.lightBlue,
    flexWrap: "wrap",
  },
  patientInfo: {
    flex: 2,
  },
  patientId: {
    margin: 0,
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary.midnightBlue,
  },
  timestamp: {
    margin: 0,
    fontSize: typography.fontSize.small,
    color: colors.neutral.mediumGray,
  },
  resultSummary: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  egfrValue: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  egfrLabel: {
    fontSize: typography.fontSize.small,
    color: colors.neutral.darkGray,
    fontWeight: typography.fontWeight.semiBold,
  },
  egfrNumber: {
    fontSize: "1.5rem",
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.blue,
  },
  ckdStage: {
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: "1rem",
    color: "white",
    fontWeight: typography.fontWeight.semiBold,
    fontSize: typography.fontSize.small,
    textAlign: "center",
    minWidth: "5rem",
  },
  resultDetails: {
    padding: spacing.md,
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  detailColumn: {
    flex: 1,
    minWidth: "12rem",
  },
  detailItem: {
    margin: `${spacing.xs} 0`,
    fontSize: typography.fontSize.body,
    color: colors.neutral.darkGray,
  },
  detailLabel: {
    fontWeight: typography.fontWeight.semiBold,
    marginRight: spacing.xs,
  },
  legendToggleButton: {
    backgroundColor: "transparent",
    color: colors.primary.blue,
    border: "none",
    cursor: "pointer",
    fontSize: typography.fontSize.small,
    textDecoration: "underline",
    padding: "0",
  },
};

export default CalculationResultsList;
