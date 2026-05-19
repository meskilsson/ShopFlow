// jwt.ts throws at module load time if JWT_SECRET is missing, so set it first
process.env.JWT_SECRET = 'test-secret-for-jest';

import { signAccessToken, verifyAccessToken, type JwtPayload } from '../utils/jwt';
import jwt from 'jsonwebtoken';

const payload: JwtPayload = { id: 'user-1', email: 'test@example.com', role: 'buyer' };

describe('signAccessToken', () => {
  it('returns a non-empty JWT string', () => {
    const token = signAccessToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('encodes the provided payload fields', () => {
    const token = signAccessToken(payload);
    const decoded = jwt.decode(token) as Record<string, unknown>;
    expect(decoded['id']).toBe(payload.id);
    expect(decoded['email']).toBe(payload.email);
    expect(decoded['role']).toBe(payload.role);
  });
});

describe('verifyAccessToken', () => {
  it('returns the original payload for a valid token', () => {
    const token = signAccessToken(payload);
    const result = verifyAccessToken(token);
    expect(result.id).toBe(payload.id);
    expect(result.email).toBe(payload.email);
    expect(result.role).toBe(payload.role);
  });

  it('throws for a tampered token', () => {
    const token = signAccessToken(payload);
    const tampered = token.slice(0, -4) + 'xxxx';
    expect(() => verifyAccessToken(tampered)).toThrow();
  });

  it('throws for a token signed with a different secret', () => {
    const foreign = jwt.sign(payload, 'wrong-secret');
    expect(() => verifyAccessToken(foreign)).toThrow();
  });
});
