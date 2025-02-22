import GFRCalculator from "../components/GFRCalculator";

const Calculator = () => {
  return (
    <section style={styles.section}>
      <GFRCalculator />
    </section>
  );
};

export default Calculator;

const styles = {
  section: {
    marginBottom: "2rem",
  },
};
