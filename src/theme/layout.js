/**
 * Layout configuration for Healthbridge Solutions application
 */

const layout = {
  // Responsive breakpoints
  breakpoints: {
    mobile: '20rem',      // 320px
    tablet: '48rem',      // 768px
    desktop: '64rem',     // 1024px
    largeDesktop: '90rem', // 1440px
  },
  
  // Container widths
  container: {
    maxWidth: '75rem',    // 1200px
    readingWidth: '50rem', // 800px
  },
  
  // Grid configuration
  grid: {
    columns: 12,
    gutter: '1.5rem',     // 24px
    margin: '2rem',       // 32px
  },
  
  // Section layouts
  sections: {
    header: {
      height: '5rem',     // 80px
    },
    footer: {
      padding: '1.5rem 0', // 24px 0
    },
    sidebar: {
      width: '17.5rem',   // 280px
    },
  },
  
  // Z-index layers
  zIndex: {
    base: 1,
    navigation: 100,
    dropdown: 200,
    modal: 300,
    toast: 400,
  },
};

export default layout;
