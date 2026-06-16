import { POST, GET } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';

// Mock GoogleGenAI completely
const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: mockGenerateContent,
        },
      };
    }),
  };
});

describe('POST /api/chat', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockGenerateContent.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('returns AI response when successful', async () => {
    process.env.GEMINI_API_KEY = 'test_api_key';
    mockGenerateContent.mockResolvedValue({
      text: 'Hello, this is your AI sustainability coach Eco.',
    });

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: 'Analyze my score.' }],
        context: {
          emissions: { total: 400, score: 75, rating: 'A' },
          twin: { identity: 'Green Warrior' },
          gamification: { level: 'Green Warrior', xp: 500 },
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200); // Assertion 1
    const data = await res.json();
    expect(data.text).toBe('Hello, this is your AI sustainability coach Eco.'); // Assertion 2
  });

  test('returns simulated fallback response when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: 'how can i reduce my carbon footprint?' }],
        context: {
          emissions: { total: 400, score: 75, rating: 'A' },
          twin: { identity: 'Green Warrior' },
          gamification: { level: 'Green Warrior', xp: 500 },
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200); // Assertion 3
    const data = await res.json();
    expect(data.isFallback).toBe(true); // Assertion 4
    expect(data.text).toContain('monthly footprint'); // Assertion 5
  });

  test('returns 400 Bad Request when request body is malformed or messages missing', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400); // Assertion 6
    const data = await res.json();
    expect(data.error).toBe('Messages array is required'); // Assertion 7
  });

  test('rejects messages longer than 2000 characters with 400 Bad Request', async () => {
    const longMessage = 'a'.repeat(2001);
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: longMessage }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400); // Assertion 8
    const data = await res.json();
    expect(data.error).toContain('Message length exceeds limit'); // Assertion 9
  });
});

describe('GET /api/chat', () => {
  test('returns 405 Method Not Allowed', async () => {
    const res = await GET();
    expect(res.status).toBe(405); // Assertion 10
    const data = await res.json();
    expect(data.error).toBe('Method Not Allowed'); // Assertion 11
  });
});
