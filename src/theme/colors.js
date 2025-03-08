/**
 * Color palette for Healthbridge Solutions application
 * Following WCAG 2.1 AA standards for accessibility
 */

const colors = {
  // Primary colors
  primary: {
    blue: '#1A73E8',
    midnightBlue: '#0D1B2A',
  },
  
  // Secondary colors
  secondary: {
    teal: '#1BC5BD',
    orange: '#FFB100',
  },
  
  // Neutral palette
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F3F3F3',
    mediumGray: '#8A8A8A',
    darkGray: '#3D3D3D',
  },
  
  // Semantic colors
  semantic: {
    info: '#1A73E8',     // Primary blue
    warning: '#FFB100',  // Warm orange
    error: '#E74646',    // Red for errors
    success: '#34C759',  // Green for success
  },
  
  // Button states
  buttons: {
    primaryHover: '#1665C1',
    primaryActive: '#135BB0',
    secondaryHover: '#18B7AF',
    secondaryActive: '#15A8A1',
  },
  
  // Form elements
  forms: {
    border: '#CED4DA',
    focusBorder: '#1A73E8',
    errorBorder: '#E74646',
    warningBorder: '#FFB100',
  },
};

export default colors;
