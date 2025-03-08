/**
 * Typography styles for Healthbridge Solutions application
 */

const typography = {
  // Font families
  fontFamily: {
    primary: "'Open Sans', 'Roboto', Arial, Helvetica, sans-serif",
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    semiBold: 600,
    bold: 700,
  },
  
  // Font sizes in REM (with pixel equivalents in comments)
  fontSize: {
    h1: '2rem',      // 32px
    h2: '1.5rem',    // 24px
    h3: '1.25rem',   // 20px
    body: '1rem',    // 16px
    small: '0.875rem', // 14px
    xsmall: '0.75rem', // 12px
  },
  
  // Line heights
  lineHeight: {
    default: 1.5,
    tight: 1.3,
    relaxed: 1.6,
  },
  
  // Complete text styles
  textStyles: {
    h1: {
      fontSize: '2rem',    // 32px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h2: {
      fontSize: '1.5rem',  // 24px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: '1rem',    // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    small: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
};

export default typography;
