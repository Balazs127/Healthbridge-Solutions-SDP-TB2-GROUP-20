import PropTypes from "prop-types";
import { colors, typography, spacing } from "../theme";
import { CKD_STAGES } from "../constants/ckdStages";

const CkdStageLegend = ({ compact = false }) => {
  return (
    <div style={styles.legendContainer}>
      <h3 style={styles.legendTitle}>CKD Stage Legend</h3>
      <div style={compact ? styles.compactLegendGrid : styles.legendGrid}>
        {CKD_STAGES.map((stage) => (
          <div key={stage.id} style={styles.stageLegend}>
            <span
              style={{
                ...styles.stageColor,
                backgroundColor: stage.color,
              }}
            ></span>
            <span style={styles.stageText}>
              {compact ? stage.id : `${stage.name} (${stage.range})`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  legendContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.neutral.white,
    padding: spacing.sm,
    borderRadius: "0.5rem",
    border: `1px solid ${colors.neutral.lightGray}`,
  },
  legendTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.sm,
    color: colors.primary.midnightBlue,
  },
  legendGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: spacing.sm,
  },
  compactLegendGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.xs,
    justifyContent: "center",
  },
  stageLegend: {
    display: "flex",
    alignItems: "center",
    gap: spacing.xs,
  },
  stageColor: {
    width: "1rem",
    height: "1rem",
    borderRadius: "50%",
    display: "inline-block",
  },
  stageText: {
    fontSize: typography.fontSize.small,
    color: colors.neutral.darkGray,
  },
};

CkdStageLegend.propTypes = {
  compact: PropTypes.bool,
};

export default CkdStageLegend;
