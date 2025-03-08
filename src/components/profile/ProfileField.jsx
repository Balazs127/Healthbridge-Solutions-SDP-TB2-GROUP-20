import React from "react";
import { colors, typography, spacing } from "../../theme";

const ProfileField = ({ label, value, children }) => {
  return (
    <div style={styles.profileField}>
      <span style={styles.fieldLabel}>{label}</span>
      {children || <span style={styles.fieldValue}>{value || 'Not specified'}</span>}
    </div>
  );
};

const styles = {
  profileField: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${spacing.xs} 0`,
    borderBottom: `1px solid ${colors.neutral.lightGray}`,
  },
  fieldLabel: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.mediumGray,
  },
  fieldValue: {
    color: colors.neutral.darkGray,
  },
};

export default ProfileField;
