import { colors, typography, spacing } from "../theme";

const ProfileStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.h2,
    marginBottom: spacing.sm,
    color: colors.primary.midnightBlue,
  },
  text: {
    fontSize: typography.fontSize.body,
    marginBottom: spacing.xs,
  }
};

export default ProfileStyles;
