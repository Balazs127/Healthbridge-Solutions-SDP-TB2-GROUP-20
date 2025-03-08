/**
 * Accessibility guidelines for Healthbridge Solutions application
 * Follows WCAG 2.1 AA standards
 * Using REM units for better responsiveness
 */

const accessibility = {
  // Contrast ratios
  contrast: {
    minimum: '4.5:1',  // for normal text
    enhanced: '7:1',   // for better accessibility
  },
  
  // Focus styles
  focus: {
    outlineWidth: '0.125rem', // 2px
    outlineStyle: 'solid',
    outlineColor: '#1A73E8',
    outlineOffset: '0.125rem', // 2px
  },
  
  // Reduced motion preferences
  reducedMotion: {
    transitionDuration: '0ms',
  },
  
  // ARIA guidelines
  aria: {
    requiredProps: [
      'aria-required',
      'aria-invalid',
      'aria-expanded',
      'aria-selected',
      'aria-controls',
    ],
    landmarks: [
      'banner',
      'navigation',
      'main',
      'contentinfo',
      'complementary',
      'form',
    ],
  },
  
  // Screen reader only class properties
  screenReaderOnly: {
    position: 'absolute',
    width: '0.0625rem',  // 1px
    height: '0.0625rem', // 1px
    padding: '0',
    margin: '-0.0625rem', // -1px
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: '0',
  },
};

export default accessibility;
