import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { get, put } from "../../api/api";
import { colors, typography, spacing, components } from "../../theme";
import ProfileField from "./ProfileField";

const ClinicianSelection = ({ userId, userData, updateUserData }) => {
  // State -------------------------------------------------------------------
  const [clinicians, setClinicians] = useState([]);
  const [selectedClinicianId, setSelectedClinicianId] = useState("");
  const [savingClinician, setSavingClinician] = useState(false);
  const [clinicianUpdateError, setClinicianUpdateError] = useState("");
  const [clinicianUpdateSuccess, setClinicianUpdateSuccess] = useState(false);
  const [isEditingClinician, setIsEditingClinician] = useState(false);
  const [currentClinician, setCurrentClinician] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effects -----------------------------------------------------------------
  // Fetch available clinicians
  useEffect(() => {
    setLoading(true);
    get("clinicianlogin")
      .then((response) => {
        setClinicians(response.data);

        // If patient already has an assigned clinician, select it by default
        if (userData && userData.ClinicianID) {
          setSelectedClinicianId(userData.ClinicianID);

          // Find the clinician object to display name in profile
          const assignedClinician = response.data.find(
            (c) => c.ClinicianID === userData.ClinicianID
          );
          if (assignedClinician) {
            setCurrentClinician(assignedClinician);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching clinicians:", err);
        setLoading(false);
      });
  }, [userData]);

  // Handle clinician selection change
  const handleClinicianChange = (e) => {
    setSelectedClinicianId(e.target.value);
    setClinicianUpdateError("");
    setClinicianUpdateSuccess(false);
  };

  // Toggle clinician editing mode
  const toggleEditClinician = () => {
    setIsEditingClinician(!isEditingClinician);
    setClinicianUpdateError("");
    setClinicianUpdateSuccess(false);
  };

  // Save selected clinician
  const saveSelectedClinician = () => {
    setSavingClinician(true);
    setClinicianUpdateError("");
    setClinicianUpdateSuccess(false);

    put(`patientlogin/${userId}`, {
      ...userData,
      ClinicianID: selectedClinicianId,
    })
      .then(() => {
        setSavingClinician(false);
        setClinicianUpdateSuccess(true);

        // Find the clinician object to update the displayed name
        const updatedClinician = clinicians.find((c) => c.ClinicianID === selectedClinicianId);
        if (updatedClinician) {
          setCurrentClinician(updatedClinician);
        }

        // Update parent component's state
        if (updateUserData) {
          updateUserData({ ...userData, ClinicianID: selectedClinicianId });
        }

        // Hide edit mode after successful update
        setTimeout(() => {
          setClinicianUpdateSuccess(false);
          setIsEditingClinician(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Error updating clinician:", err);
        setSavingClinician(false);
        setClinicianUpdateError("Failed to update clinician. Please try again.");
      });
  };

  // View --------------------------------------------------------------------
  return (
    <>
      {/* Display current clinician with edit button */}
      <ProfileField label="Clinician:">
        <div style={styles.clinicianContainer}>
          <span style={styles.fieldValue}>
            {loading ? (
              <span style={styles.loadingText}>Loading clinician info...</span>
            ) : currentClinician ? (
              `Dr. ${currentClinician.FirstName} ${currentClinician.LastName}`
            ) : (
              "Not assigned"
            )}
          </span>
          <button onClick={toggleEditClinician} style={styles.editButton} disabled={loading}>
            {isEditingClinician ? "Cancel" : "Edit"}
          </button>
        </div>
      </ProfileField>

      {/* Clinician Selection Section - Only show when editing */}
      {isEditingClinician && (
        <div style={styles.clinicianSelectionCard}>
          <h3 style={styles.sectionTitle}>
            {currentClinician ? "Change Assigned Clinician" : "Assign a Clinician"}
          </h3>

          {clinicianUpdateSuccess && (
            <div style={styles.successMessage}>Clinician assignment updated successfully!</div>
          )}

          {clinicianUpdateError && <div style={styles.errorMessage}>{clinicianUpdateError}</div>}

          <div style={styles.formGroup}>
            <label htmlFor="clinician-select" style={styles.label}>
              Select your clinician:
            </label>
            <select
              id="clinician-select"
              value={selectedClinicianId}
              onChange={handleClinicianChange}
              style={styles.select}
              disabled={savingClinician}
            >
              <option value="">-- Select a clinician --</option>
              {clinicians.map((clinician) => (
                <option key={clinician.ClinicianID} value={clinician.ClinicianID}>
                  Dr. {clinician.FirstName} {clinician.LastName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={saveSelectedClinician}
            disabled={!selectedClinicianId || savingClinician}
            style={selectedClinicianId ? styles.button : styles.buttonDisabled}
          >
            {savingClinician ? "Saving..." : "Save Clinician"}
          </button>
        </div>
      )}
    </>
  );
};

const styles = {
  clinicianContainer: {
    display: "flex",
    alignItems: "center",
    gap: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primary.blue,
    color: colors.neutral.white,
    border: "none",
    borderRadius: "0.25rem",
    padding: "0.25rem 0.5rem",
    fontSize: typography.fontSize.small,
    cursor: "pointer",
    marginLeft: spacing.xs,
  },
  clinicianSelectionCard: {
    ...components.card,
    width: "100%",
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutral.lightGray,
  },
  sectionTitle: {
    fontSize: typography.fontSize.h3,
    marginBottom: spacing.sm,
    color: colors.primary.midnightBlue,
  },
  formGroup: {
    marginBottom: spacing.sm,
    width: "100%",
  },
  label: {
    ...components.forms.label,
    display: "block",
    marginBottom: spacing.xs,
  },
  select: {
    width: "100%",
    padding: spacing.xs,
    fontSize: typography.fontSize.body,
    borderRadius: "0.25rem",
    border: `1px solid ${colors.forms.border}`,
    marginBottom: spacing.sm,
  },
  button: {
    ...components.buttons.primary,
    cursor: "pointer",
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    ...components.buttons.primary,
    opacity: 0.6,
    cursor: "not-allowed",
    marginTop: spacing.sm,
  },
  successMessage: {
    ...components.alert.success,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...components.alert.error,
    marginBottom: spacing.sm,
  },
  fieldValue: {
    color: colors.neutral.darkGray,
  },
  loadingText: {
    color: colors.neutral.mediumGray,
    fontSize: typography.fontSize.small,
    fontStyle: "italic",
  },
};

ClinicianSelection.propTypes = {
  userId: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired,
  updateUserData: PropTypes.func,
};

export default ClinicianSelection;
