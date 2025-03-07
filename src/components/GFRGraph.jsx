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
        stage: item.CKD_Stage,
        rawDate: item.CreatedAt,
      };
    })
    .filter((item) => item.eGFR > 0)
    .sort((a, b) => {
      try {
        return new Date(a.rawDate) - new Date(b.rawDate);
      } catch (e) {
        console.error("Error sorting dates:", e);
        return 0; // Fallback to keep the order unchanged
      }
    });

  // Define colors for different CKD stages
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
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" label={{ value: "Date", position: "bottom", offset: 0 }} />
            <YAxis
              label={{ value: "eGFR Value (mL/min/1.73m²)", angle: -90, position: "insideLeft" }}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value, name) => [
                value.toFixed(1),
                name === "eGFR" ? "eGFR (mL/min/1.73m²)" : name,
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="eGFR"
              stroke="#2196f3"
              strokeWidth={2}
              dot={{
                stroke: "#fff",
                strokeWidth: 2,
                fill: (entry) => getStageColor(entry.stage),
                r: 6,
              }}
              activeDot={{ r: 8 }}
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
          <span>G1: Normal</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#8bc34a" }}></span>
          <span>G2: Mildly decreased</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#ffeb3b" }}></span>
          <span>G3a: Mildly to moderately decreased</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#ff9800" }}></span>
          <span>G3b: Moderately to severely decreased</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#ff5722" }}></span>
          <span>G4: Severely decreased</span>
        </div>
        <div style={styles.stageLegend}>
          <span style={{ ...styles.stageColor, backgroundColor: "#f44336" }}></span>
          <span>G5: Kidney failure</span>
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
    marginTop: "1rem",
    fontSize: "0.9rem",
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
      CKD_Stage: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default GFRGraph;
