import { useState } from "react";
import BarGraph from "./BarGraph";

export default function GFRCalculator() {
  const [creatinine, setCreatinine] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("mg/dL");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [egfr, setEGFR] = useState("");
  const [ckdStage, setCKDStage] = useState("");
  const [previousResults, setPreviousResults] = useState([]);
  const [pediatricMessage, setPediatricMessage] = useState("");

  const determineCKDStage = (egfrValue) => {
    if (egfrValue >= 90) return "Stage 1 (Normal or High)";
    if (egfrValue >= 60) return "Stage 2 (Mildly Decreased)";
    if (egfrValue >= 45) return "Stage 3A (Mild to Moderate Decrease)";
    if (egfrValue >= 30) return "Stage 3B (Moderate to Severe Decrease)";
    if (egfrValue >= 15) return "Stage 4 (Severely Decreased)";
    return "Stage 5 (Kidney Failure)";
  };

  const handleCreatinineUnitChange = (e) => {
    const newUnit = e.target.value;
    let newCreatinine = parseFloat(creatinine);

    if (creatinineUnit === "mg/dL" && newUnit === "µmol/L") {
      newCreatinine = newCreatinine * 88.4;
    } else if (creatinineUnit === "µmol/L" && newUnit === "mg/dL") {
      newCreatinine = newCreatinine / 88.4;
    }

    setCreatinineUnit(newUnit);
    setCreatinine(newCreatinine.toFixed(2));
  };

  const calculateEGFR = () => {
    let creatValue = parseFloat(creatinine);
    const ageValue = parseFloat(age);

    if (isNaN(creatValue) || creatValue <= 0) {
      setEGFR("Invalid creatinine level");
      return;
    }

    if (isNaN(ageValue) || ageValue < 18) {
      setPediatricMessage(
        "For users under 18 years old, please use the Pediatric version of the calculator."
      );
      return;
    }

    // Convert creatinine to mg/dL if the unit is µmol/L
    if (creatinineUnit === "µmol/L") {
      creatValue = creatValue / 88.4;
    }

    let gFactor = gender.toLowerCase() === "female" ? 0.742 : 1;
    let eFactor = ethnicity.toLowerCase() === "black" ? 1.21 : 1;
    let formula =
      186 * Math.pow(creatValue, -1.154) * Math.pow(ageValue || 1, -0.203) * gFactor * eFactor;
    const egfrValue = parseFloat(formula.toFixed(2));
    const stage = determineCKDStage(egfrValue);
    setEGFR(`${egfrValue} ml/min/1.73m²`);
    setCKDStage(stage);
    setPreviousResults([...previousResults, { egfr: egfrValue, stage }]);
    setPediatricMessage("");
  };

  const graphData = previousResults.map((result, index) => ({
    index: index + 1,
    egfr: result.egfr,
  }));

  return (
    <div>
      <h2>eGFR Calculator</h2>
      <div>
        <label>Creatinine: </label>
        <input type="number" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
        <select value={creatinineUnit} onChange={handleCreatinineUnitChange}>
          <option value="mg/dL">mg/dL</option>
          <option value="µmol/L">µmol/L</option>
        </select>
      </div>
      <div>
        <label>Age (years): </label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div>
        <label>Gender (male/female): </label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label>Ethnicity: </label>
        <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}>
          <option value="">Select Ethnicity</option>
          <option value="black">Black</option>
          <option value="other">White</option>
          <option value="other">Asian</option>
          <option value="other">Indian</option>
          <option value="other">White</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button onClick={calculateEGFR}>Calculate eGFR</button>
      {pediatricMessage && (
        <div>
          <p>{pediatricMessage}</p>
        </div>
      )}
      {egfr && (
        <div>
          <p>Result: {egfr}</p>
          <p>CKD Stage: {ckdStage}</p>
        </div>
      )}
      {previousResults.length > 0 && (
        <div>
          <h3>Previous Results</h3>
          <ul>
            {previousResults.map((result, index) => (
              <li key={index}>
                eGFR: {result.egfr} ml/min/1.73m² - CKD Stage: {result.stage}
              </li>
            ))}
          </ul>
          <BarGraph data={graphData} />
        </div>
      )}
    </div>
  );
}
