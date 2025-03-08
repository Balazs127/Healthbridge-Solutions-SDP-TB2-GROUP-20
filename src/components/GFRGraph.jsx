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
import PropTypes from "prop-types";

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
  const formattedData = data
    .map((item) => {
      let formattedDate;
      try {
        formattedDate = new Date(item.CreatedAt).toLocaleDateString();
        if (formattedDate === "Invalid Date") {
          formattedDate = "Unknown Date";
        }
      } catch (e) {
        console.error("Error parsing date:", e);
        formattedDate = "Unknown Date";
      }

      let eGFRValue;
      try {
        const eGFRString =
          typeof item.eGFR === "number" ? item.eGFR.toString() : String(item.eGFR || "0");

        const cleanedValue = eGFRString.replace(/[^\d.]/g, "");
        eGFRValue = parseFloat(cleanedValue);

        if (isNaN(eGFRValue)) {
          console.warn("Invalid eGFR value:", item.eGFR);
          eGFRValue = 0;
        }
      } catch (e) {
        console.error("Error parsing eGFR:", e);
        eGFRValue = 0;
      }

      return {
        date: formattedDate,
        eGFR: eGFRValue,
        stage: calculateStage(eGFRValue),
        rawDate: item.CreatedAt,
      };
    })
    .filter((item) => item.eGFR > 0)
    .sort((a, b) => {
      try {
        return new Date(a.rawDate) - new Date(b.rawDate);
      } catch (e) {
        console.error("Error sorting dates:", e);
        return 0;
      }
    });

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

  return (
    <div style={styles.graphContainer}>
      <h3 style={styles.title}>eGFR History</h3>
      {data.length === 0 ? (
        <p style={styles.noData}>No previous calculations found.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 45, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
  dataKey="date" 
  label={{ 
    value: "Date", 
    position: "bottom", 
    offset: 25  // Increased from 20 to 25
  }} 
  padding={{ left: 10, right: 10 }} // Adds spacing on both sides
/>
            <YAxis
      label={{ 
        value: "eGFR Value (mL/min/1.73m²)", 
        angle: -90, 
        position: "insideLeft",
        offset: -35  // Added negative offset to move label away from axis
      }}
      domain={[0, "auto"]}
    />
            <Tooltip
              formatter={(value, name) => [
                value.toFixed(1),
                name === "eGFR" ? "eGFR (mL/min/1.73m²)" : name,
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
  align="center" 
  verticalAlign="top" 
  wrapperStyle={{ paddingBottom: "10px" }} 
  payload={[
    { value: "eGFR", type: "line", color: "#2196f3" },
    { value: "eGFR Data", type: "line", color: "#ff9800" }
  ]}
/>
            <Line
  type="monotone"
  dataKey="eGFR"
  stroke="#2196f3"
  strokeWidth={2}
  
  dot={false}
  connectNulls
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
      )}
      <div style={styles.legend}>
        <p>
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
  graphContainer: {
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    padding: "2rem",
  },
  legend: {
    marginTop: "2rem",  // Increased from 1rem to 2rem
    fontSize: "0.9rem",
    padding: "1rem",    // Added padding
    backgroundColor: "#f5f5f5", // Optional: adds a subtle background
    borderRadius: "8px", // Optional: matches container style
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
  data: PropTypes.arrayOf(
    PropTypes.shape({
      CreatedAt: PropTypes.string.isRequired,
      eGFR: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default GFRGraph;