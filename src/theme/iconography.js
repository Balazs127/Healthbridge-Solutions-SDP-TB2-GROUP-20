/**
 * Iconography and imagery guidelines for Healthbridge Solutions application
 */

const iconography = {
  // Icon sizes
  size: {
    small: '1rem',      // 16px
    medium: '1.5rem',   // 24px
    large: '2rem',      // 32px
  },
  
  // Icon styles
  style: {
    strokeWidth: '0.09375rem', // 1.5px
    cornerRadius: '0.125rem',  // 2px
  },
  
  // Common icon names and uses
  icons: {
    user: {
      name: 'user',
      description: 'Represents a patient or user profile',
    },
    calculator: {
      name: 'calculator',
      description: 'For eGFR calculation functions',
    },
    chart: {
      name: 'chart',
      description: 'For data visualization and history',
    },
    alert: {
      name: 'alert-triangle',
      description: 'For warnings and important notices',
    },
    info: {
      name: 'info',
      description: 'For information and help tooltips',
    },
    settings: {
      name: 'settings',
      description: 'For configuration and preference options',
    },
  },
  
  // Image guidelines
  images: {
    borderRadius: '0.25rem', // 4px
    aspectRatios: {
      standard: '16:9',
      profile: '1:1',
    },
  },
};

export default iconography;
