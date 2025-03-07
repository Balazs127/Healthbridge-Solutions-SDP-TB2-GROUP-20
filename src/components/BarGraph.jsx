import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import PropTypes from "prop-types";

const BarGraph = ({ data }) => {
  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="index" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="egfr" fill="#8884d8" />
    </BarChart>
  );
};

BarGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      egfr: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BarGraph;
