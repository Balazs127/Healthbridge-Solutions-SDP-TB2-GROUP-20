/**
 * Spacing and layout metrics for Healthbridge Solutions application
 */

const spacing = {
  // Base spacing units
  unit: 0.5, // Base unit in REM (8px)
  
  // Common spacing values
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  xxl: '4rem',    // 64px
  
  // Component specific spacing
  paragraph: '1em', // Space between paragraphs (relative to element's font size)
  section: '2em',   // Space between sections (relative to element's font size)
  
  // Grid configuration
  grid: {
    columns: 12,
    gutter: '1.5rem',  // 24px
    margin: '2rem',    // 32px
  },
  
  // Element specific spacing
  elements: {
    buttonPadding: '0.75rem 1.5rem',  // 12px 24px
    inputPadding: '0.75rem 1rem',     // 12px 16px
    cardPadding: '1.5rem',            // 24px
    tableCellPadding: '0.75rem 1rem', // 12px 16px
  },
};

export default spacing;
