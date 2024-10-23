// src/setupTests.js
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { server } from './mocks/server';

// Mock de URL.createObjectURL para Vitest
globalThis.URL.createObjectURL = vi.fn(() => 'mocked-url');

// Mock de URL.revokeObjectURL 
globalThis.URL.revokeObjectURL = vi.fn();

// Configuración de MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
