import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { colors, typography, spacing } from "../theme";

const calculateStage = (eGFR) => {
  if (eGFR > 90) return "G1";
  if (eGFR >= 60 && eGFR <= 89) return "G2";
  if (eGFR >= 45 && eGFR <= 59) return "G3a";
  if (eGFR >= 30 && eGFR <= 44) return "G3b";
  if (eGFR >= 15 && eGFR <= 29) return "G4";
  if (eGFR < 15) return "G5";
  return "Unknown";
};

const GFRGraph = ({ data }) => {
  // Data --------------------------------------------------------------------
  const chartData = Array.isArray(data) ? data : [];

  // Sort data by date
  const sortedData = [...chartData].sort((a, b) => {
    return new Date(a.CreatedAt) - new Date(b.CreatedAt);
  });

  const preparedData = sortedData.map((item) => {
    // Ensure eGFR is a number
    let eGFRValue;
    if (typeof item.eGFR_numeric === "number") {
      eGFRValue = item.eGFR_numeric;
    } else {
      const eGFRString = String(item.eGFR || "0");
      eGFRValue = parseFloat(eGFRString.replace(/[^\d.]/g, ""));
    }

    return {
      date: new Date(item.CreatedAt).toLocaleDateString(),
      eGFR: isNaN(eGFRValue) ? 0 : eGFRValue,
      stage: calculateStage(eGFRValue),
      rawDate: item.CreatedAt,
    };
  });

  // Methods -----------------------------------------------------------------
  const getStageColor = (stage) => {
    switch (stage) {
      case "G1":
        return "#4caf50"; // Normal
      case "G2":
        return "#8bc34a"; // Mildly decreased
      case "G3a":
        return "#ffeb3b"; // Mildly to moderately decreased
      case "G3b":
        return "#ff9800"; // Moderately to severely decreased
      case "G4":
        return "#ff5722"; // Severely decreased
      case "G5":
        return "#f44336"; // Kidney failure
      default:
        return "#2196f3";
    }
  };

  // View --------------------------------------------------------------------
  return (
    <div style={styles.container}>
      <div style={styles.chartSection}>
        <h3 style={styles.title}>Your eGFR History</h3>

        {preparedData.length === 0 ? (
          <p style={styles.noData}>No calculation history available yet.</p>
        ) : (
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={preparedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: "eGFR (ml/min/1.73m²)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="eGFR"
                  stroke={colors.primary.blue}
                  activeDot={{ r: 8 }}
                  name="eGFR Value"
                />
                <Line
                  type="monotone"
                  dataKey="eGFR"
                  stroke={(entry) => getStageColor(entry.stage)}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill={getStageColor(payload.stage)}
                        stroke={getStageColor(payload.stage)}
                        strokeWidth={1}
                      />
                    );
                  }}
                  activeDot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill={getStageColor(payload.stage)}
                        stroke={getStageColor(payload.stage)}
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div style={styles.legend}>
        <p style={styles.legendTitle}>
          <strong>CKD Stages Color Guide:</strong>
        </p>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#4caf50" }}></span>
          <span>G1: Normal (90)</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#8bc34a" }}></span>
          <span>G2: Mildly decreased (60-89)</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#ffeb3b" }}></span>
          <span>G3a: Mildly to moderately decreased (45-59)</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#ff9800" }}></span>
          <span>G3b: Moderately to severely decreased (30-44)</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#ff5722" }}></span>
          <span>G4: Severely decreased (15-29)</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#f44336" }}></span>
          <span>G5: Kidney failure (15)</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: spacing.md,
  },
  chartSection: {
    backgroundColor: colors.neutral.white,
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.h3,
    color: colors.primary.midnightBlue,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  chartContainer: {
    width: "100%",
    height: 300,
  },
  noData: {
    textAlign: "center",
    color: colors.neutral.mediumGray,
    padding: spacing.lg,
  },
  legend: {
    marginTop: spacing.lg,
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  legendTitle: {
    marginBottom: spacing.sm,
    color: colors.primary.midnightBlue,
  },
  stageLegend: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.3rem",
  },
  stageColor: {
    display: "inline-block",
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    marginRight: "8px",
  },
};

GFRGraph.propTypes = {
  data: PropTypes.array.isRequired,
  payload: PropTypes.shape({
    stage: PropTypes.string,
  }),
  cx: PropTypes.number,
  cy: PropTypes.number,
};

export default GFRGraph;
