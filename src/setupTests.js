import '@testing-library/jest-dom';

// Global localStorage mock for Zustand persist and browser storage test scenarios
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (i) => Object.keys(store)[i] || null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
  writable: true
});

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// AudioContext mock
if (typeof window.AudioContext === 'undefined') {
  window.AudioContext = class {
    createOscillator() {
      return {
        connect: () => {},
        start: () => {},
        stop: () => {},
        frequency: { value: 0 }
      };
    }
    createGain() {
      return {
        connect: () => {},
        gain: { value: 0 }
      };
    }
    close() { return Promise.resolve(); }
  };
}

// Canvas getContext mock
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function() {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4).fill(0) }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    };
  };
}

// Browser dialogs, scroll, and toast mocks
if (typeof window !== 'undefined') {
  window.alert = window.alert || vi.fn();
  window.confirm = window.confirm || vi.fn(() => true);
  window.scrollTo = window.scrollTo || vi.fn();
  window.toast = window.toast || {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    warning: vi.fn(),
  };
}
