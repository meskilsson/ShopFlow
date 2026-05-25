import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../errors/AppError';

describe('AppError', () => {
  it('sets message, statusCode and isOperational', () => {
    const err = new AppError('Something broke', 500);
    expect(err.message).toBe('Something broke');
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(true);
    expect(err).toBeInstanceOf(Error);
  });
});

describe('ValidationError', () => {
  it('defaults to 400 with a generic message', () => {
    const err = new ValidationError();
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Validation Error');
    expect(err.errors).toEqual([]);
  });

  it('accepts a custom message', () => {
    const err = new ValidationError('Email is required');
    expect(err.message).toBe('Email is required');
  });
});

describe('UnauthorizedError', () => {
  it('defaults to 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });

  it('accepts a custom message', () => {
    const err = new UnauthorizedError('Token expired');
    expect(err.message).toBe('Token expired');
  });
});

describe('ForbiddenError', () => {
  it('defaults to 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe('Access Denied');
  });
});

describe('NotFoundError', () => {
  it('defaults to 404', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
  });

  it('accepts a custom message', () => {
    const err = new NotFoundError('Order not found');
    expect(err.message).toBe('Order not found');
  });
});

describe('ConflictError', () => {
  it('defaults to 409', () => {
    const err = new ConflictError();
    expect(err.statusCode).toBe(409);
  });
});
