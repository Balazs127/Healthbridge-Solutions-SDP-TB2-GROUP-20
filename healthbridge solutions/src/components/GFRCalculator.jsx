import { useState } from "react";

export default function GFRCalculator() {
  const [creatinine, setCreatinine] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [egfr, setEGFR] = useState("");

  const calculateEGFR = () => {
    const creatValue = parseFloat(creatinine);
    if (isNaN(creatValue) || creatValue <= 0) {
      setEGFR("Invalid creatinine level");
      return;
    }
    let creatInMg = creatValue / 88.4;
    let gFactor = gender.toLowerCase() === "female" ? 0.742 : 1;
    let eFactor = ethnicity.toLowerCase() === "black" ? 1.21 : 1;
    let formula =
      186 *
      Math.pow(creatInMg, -1.154) *
      Math.pow(parseFloat(age) || 1, -0.203) *
      gFactor *
      eFactor;
    setEGFR(formula.toFixed(2) + " ml/min/1.73m²");
  };

  return (
    <div>
      <h2>eGFR Calculator</h2>
      <div>
        <label>Creatinine (µmol/L): </label>
        <input type="number" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
      </div>
      <div>
        <label>Age (years): </label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div>
        <label>Gender (male/female): </label>
        <input value={gender} onChange={(e) => setGender(e.target.value)} />
      </div>
      <div>
        <label>Ethnicity (black/other): </label>
        <input value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} />
      </div>
      <button onClick={calculateEGFR}>Calculate eGFR</button>
      {egfr && <p>Result: {egfr}</p>}
    </div>
  );
}
