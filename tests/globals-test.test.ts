// Testing without imports to confirm globals work
import { describe, it, expect } from 'vitest';

describe('Globals Test', () => {
  it('should work with imports', () => {
    expect(1 + 1).toBe(2);
  });
});
