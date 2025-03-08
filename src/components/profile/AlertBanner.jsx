import React from "react";
import { colors, typography, spacing, components } from "../../theme";

const AlertBanner = ({ message, type = "warning" }) => {
  return (
    <div style={{ ...styles.alert, ...components.alert[type] }}>
      {message}
    </div>
  );
};

const styles = {
  alert: {
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    marginBottom: spacing.sm,
    padding: spacing.sm,
    fontWeight: typography.fontWeight.bold,
  }
};

export default AlertBanner;
