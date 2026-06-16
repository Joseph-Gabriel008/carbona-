import '@testing-library/jest-dom';

// Polyfill TextEncoder and TextDecoder for JSDOM
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Polyfill TextEncoderStream and TextDecoderStream for JSDOM
if (typeof global.TextEncoderStream === 'undefined') {
  const streamWeb = require('node:stream/web');
  global.TextEncoderStream = streamWeb.TextEncoderStream;
  global.TextDecoderStream = streamWeb.TextDecoderStream;
}

// Polyfill Web Streams for JSDOM
if (typeof global.ReadableStream === 'undefined') {
  const streamWeb = require('node:stream/web');
  global.ReadableStream = streamWeb.ReadableStream;
  global.WritableStream = streamWeb.WritableStream;
  global.TransformStream = streamWeb.TransformStream;
}

// Polyfill structuredClone for JSDOM
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = globalThis.structuredClone;
}

// Polyfill Web API Globals for JSDOM using Next.js compiled primitives
const primitives = require('next/dist/compiled/@edge-runtime/primitives');
global.Request = primitives.Request;
global.Response = primitives.Response;
global.Headers = primitives.Headers;

// Global Next.js navigation mock using Jest mock functions
const mockUsePathname = jest.fn(() => '/');
jest.mock('next/navigation', () => ({
  usePathname: mockUsePathname,
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
}));

// Mock framer-motion to bypass animations in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  const dummyComponent = (name: string) => {
    return React.forwardRef(({ children, ...props }: any, ref: any) => {
      const cleanProps = { ...props };
      delete cleanProps.initial;
      delete cleanProps.animate;
      delete cleanProps.exit;
      delete cleanProps.transition;
      delete cleanProps.variants;
      delete cleanProps.layoutId;
      delete cleanProps.layout;
      
      return React.createElement(name, { ...cleanProps, ref }, children);
    });
  };

  const customMotion = {
    div: dummyComponent('div'),
    span: dummyComponent('span'),
    nav: dummyComponent('nav'),
    button: dummyComponent('button'),
    aside: dummyComponent('aside'),
    main: dummyComponent('main'),
    section: dummyComponent('section'),
    p: dummyComponent('p'),
    h1: dummyComponent('h1'),
    h2: dummyComponent('h2'),
    h3: dummyComponent('h3'),
    ul: dummyComponent('ul'),
    li: dummyComponent('li'),
    a: dummyComponent('a'),
  };

  return {
    motion: customMotion,
    AnimatePresence: ({ children }: any) => children,
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  value: ResizeObserverMock,
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
  writable: true,
});

// Mock Recharts ResponsiveContainer to render standard divs in test mode
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => children,
  };
});
export { mockUsePathname };
