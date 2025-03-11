/**
 * Constants for CKD (Chronic Kidney Disease) stages based on eGFR values
 */

export const CKD_STAGES = [
  {
    id: "G1",
    dbValue: "1",
    name: "G1: Normal",
    range: "≥90",
    color: "#4caf50",
    minValue: 90,
    maxValue: Infinity,
    description: "Normal or high kidney function",
  },
  {
    id: "G2",
    dbValue: "2",
    name: "G2: Mildly decreased",
    range: "60-89",
    color: "#8bc34a",
    minValue: 60,
    maxValue: 89.9,
    description: "Mildly decreased kidney function",
  },
  {
    id: "G3A",
    dbValue: "3A",
    name: "G3A: Mildly to moderately decreased",
    range: "45-59",
    color: "#ffeb3b",
    minValue: 45,
    maxValue: 59.9,
    description: "Mildly to moderately decreased kidney function",
  },
  {
    id: "G3B",
    dbValue: "3B",
    name: "G3B: Moderately to severely decreased",
    range: "30-44",
    color: "#ff9800",
    minValue: 30,
    maxValue: 44.9,
    description: "Moderately to severely decreased kidney function",
  },
  {
    id: "G4",
    dbValue: "4",
    name: "G4: Severely decreased",
    range: "15-29",
    color: "#ff5722",
    minValue: 15,
    maxValue: 29.9,
    description: "Severely decreased kidney function",
  },
  {
    id: "G5",
    dbValue: "5",
    name: "G5: Kidney failure",
    range: "<15",
    color: "#f44336",
    minValue: 0,
    maxValue: 14.9,
    description: "Kidney failure",
  },
];

/**
 * Get CKD stage information based on eGFR value
 * @param {number} egfr - The eGFR value
 * @returns {Object} The CKD stage information object
 */
export function getCkdStageFromEgfr(egfr) {
  for (const stage of CKD_STAGES) {
    if (egfr >= stage.minValue && egfr <= stage.maxValue) {
      return stage;
    }
  }
  return null;
}

/**
 * Get CKD stage information based on stage ID
 * @param {string} stageId - The stage ID (e.g., "G1", "3A", "3B", etc.)
 * @returns {Object} The CKD stage information object
 */
export function getCkdStageById(stageId) {
  if (!stageId) return null;

  // First try to match by exact database value (from enum)
  const exactMatch = CKD_STAGES.find((stage) => stage.dbValue === stageId);
  if (exactMatch) return exactMatch;

  // Normalize the stage ID for different format variations
  let normalizedId = stageId.toString().toUpperCase();

  // Handle "Stage X" format
  if (normalizedId.startsWith("STAGE ")) {
    normalizedId = normalizedId.replace("STAGE ", "G");
  }

  // Handle special cases for 3A and 3B which might come as "3A" or "3B" without G prefix
  if (normalizedId === "3A") {
    normalizedId = "G3A";
  } else if (normalizedId === "3B") {
    normalizedId = "G3B";
  }
  // Handle regular cases (1, 2, 4, 5) that need G prefix
  else if (!normalizedId.startsWith("G") && !isNaN(Number(normalizedId))) {
    normalizedId = "G" + normalizedId;
  }

  return CKD_STAGES.find((stage) => stage.id === normalizedId) || null;
}

/**
 * Format gender display
 * @param {string} gender - The gender value from data
 * @returns {string} Formatted gender display (Male or Female)
 */
export function formatGender(gender) {
  if (!gender) return "Unknown";

  const normalizedGender = gender.toString().toLowerCase().trim();

  if (normalizedGender === "m" || normalizedGender === "male") {
    return "Male";
  } else if (
    normalizedGender === "f" ||
    normalizedGender === "fm" ||
    normalizedGender === "female"
  ) {
    return "Female";
  }

  // If we can't determine, return the original with first letter capitalized
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}
