import { formatIssues } from '../utils/formatIssues';
import { z } from 'zod';

function getZodIssues(schema: z.ZodTypeAny, data: unknown) {
  const result = schema.safeParse(data);
  if (result.success) throw new Error('Expected validation to fail');
  return result.error.issues;
}

describe('formatIssues', () => {
  it('maps a single zod issue to a ValidationError', () => {
    const schema = z.object({ name: z.string() });
    const issues = getZodIssues(schema, { name: 123 });
    const errors = formatIssues('body', issues);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      location: 'body',
      field: 'name',
    });
    expect(typeof errors[0]?.message).toBe('string');
  });

  it('maps multiple zod issues', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });
    const issues = getZodIssues(schema, { email: 'bad', age: 5 });
    const errors = formatIssues('query', issues);

    expect(errors.length).toBeGreaterThanOrEqual(2);
    errors.forEach((e) => expect(e.location).toBe('query'));
  });

  it('uses dot-joined path for nested fields', () => {
    const schema = z.object({ address: z.object({ city: z.string() }) });
    const issues = getZodIssues(schema, { address: { city: 42 } });
    const errors = formatIssues('body', issues);

    expect(errors[0]?.field).toBe('address.city');
  });

  it('returns an empty array when there are no issues', () => {
    expect(formatIssues('params', [])).toEqual([]);
  });
});
