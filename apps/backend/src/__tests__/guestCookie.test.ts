import type { Request, Response } from 'express';
import { getGuestId } from '../utils/guestCookie';

function makeReq(cookieValue?: string): Partial<Request> {
  const cookieName = process.env.GUEST_COOKIE_NAME ?? 'shopflow.guestId';
  return {
    cookies: cookieValue !== undefined ? { [cookieName]: cookieValue } : {},
  };
}

function makeRes(): { res: Partial<Response>; cookies: Record<string, string> } {
  const cookies: Record<string, string> = {};
  const res: Partial<Response> = {
    cookie: jest.fn((name: string, value: string) => {
      cookies[name] = value;
      return res as Response;
    }),
  };
  return { res, cookies };
}

describe('getGuestId', () => {
  it('returns the existing cookie value when present', () => {
    const { res } = makeRes();
    const id = getGuestId(makeReq('existing-id') as Request, res as Response);
    expect(id).toBe('existing-id');
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('creates and returns a new UUID when no cookie exists', () => {
    const { res, cookies } = makeRes();
    const id = getGuestId(makeReq() as Request, res as Response);
    expect(typeof id).toBe('string');
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(res.cookie).toHaveBeenCalled();
    const cookieName = process.env.GUEST_COOKIE_NAME ?? 'shopflow.guestId';
    expect(cookies[cookieName]).toBe(id);
  });

  it('returns undefined and does not set a cookie when create is false and no cookie exists', () => {
    const { res } = makeRes();
    const id = getGuestId(makeReq() as Request, res as Response, { create: false });
    expect(id).toBeUndefined();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('returns the existing cookie even when create is false', () => {
    const { res } = makeRes();
    const id = getGuestId(makeReq('some-id') as Request, res as Response, { create: false });
    expect(id).toBe('some-id');
  });
});
