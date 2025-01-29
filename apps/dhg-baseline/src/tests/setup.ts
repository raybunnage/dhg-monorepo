import '@testing-library/jest-dom';

// Mock matchMedia if needed
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
}; 