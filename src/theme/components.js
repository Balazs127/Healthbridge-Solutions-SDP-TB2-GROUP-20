/**
 * Component styles for Healthbridge Solutions application
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';

const components = {
  // Button styles
  buttons: {
    primary: {
      backgroundColor: colors.primary.blue,
      color: colors.neutral.white,
      padding: spacing.elements.buttonPadding,
      borderRadius: '0.25rem', // 4px
      border: 'none',
      fontWeight: typography.fontWeight.semiBold,
      hover: {
        backgroundColor: colors.buttons.primaryHover,
      },
      active: {
        backgroundColor: colors.buttons.primaryActive,
      },
      disabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.secondary.teal,
      padding: spacing.elements.buttonPadding,
      borderRadius: '0.25rem', // 4px
      border: `0.0625rem solid ${colors.secondary.teal}`, // 1px
      fontWeight: typography.fontWeight.semiBold,
      hover: {
        backgroundColor: colors.secondary.teal,
        color: colors.neutral.white,
      },
      active: {
        backgroundColor: colors.buttons.secondaryActive,
        color: colors.neutral.white,
      },
      disabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
  },
  
  // Form elements
  forms: {
    input: {
      border: `0.0625rem solid ${colors.forms.border}`, // 1px
      borderRadius: '0.25rem', // 4px
      padding: spacing.elements.inputPadding,
      fontSize: typography.fontSize.body,
      focus: {
        borderColor: colors.forms.focusBorder,
        boxShadow: `0 0 0 0.1875rem rgba(26, 115, 232, 0.2)`, // 3px
      },
      error: {
        borderColor: colors.forms.errorBorder,
      },
      disabled: {
        backgroundColor: colors.neutral.lightGray,
        cursor: 'not-allowed',
      },
    },
    label: {
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: spacing.xs,
      display: 'block',
    },
    errorMessage: {
      fontSize: typography.fontSize.small,
      color: colors.semantic.error,
      marginTop: spacing.xs,
    },
  },
  
  // Cards and containers
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: '0.5rem', // 8px
    boxShadow: '0 0.125rem 0.625rem rgba(0,0,0,0.1)', // 0 2px 10px
    padding: spacing.elements.cardPadding,
  },
  
  // Tables
  table: {
    headerBackground: colors.neutral.lightGray,
    borderColor: colors.forms.border,
    rowHeight: '2.5rem', // 40px
    cellPadding: spacing.elements.tableCellPadding,
    zebraStripe: {
      even: colors.neutral.white,
      odd: colors.neutral.lightGray,
    },
  },
  
  // Alerts and notifications
  alert: {
    padding: spacing.md,
    borderRadius: '0.25rem', // 4px
    marginBottom: spacing.md,
    info: {
      backgroundColor: 'rgba(26, 115, 232, 0.1)',
      borderLeft: `0.25rem solid ${colors.semantic.info}`, // 4px
      color: colors.primary.midnightBlue,
    },
    warning: {
      backgroundColor: 'rgba(255, 177, 0, 0.1)',
      borderLeft: `0.25rem solid ${colors.semantic.warning}`, // 4px
      color: colors.primary.midnightBlue,
    },
    error: {
      backgroundColor: 'rgba(231, 70, 70, 0.1)',
      borderLeft: `0.25rem solid ${colors.semantic.error}`, // 4px
      color: colors.primary.midnightBlue,
    },
    success: {
      backgroundColor: 'rgba(52, 199, 89, 0.1)',
      borderLeft: `0.25rem solid ${colors.semantic.success}`, // 4px
      color: colors.primary.midnightBlue,
    },
  },
};

export default components;
