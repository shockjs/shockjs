// __tests__/shared/utils/isPrimative-test.js
"use strict";
jest.dontMock('../../../src/shared/utils/isPrimative');
const isPrimative = require('../../../src/shared/utils/isPrimative').default;

describe('isPrimative', () => {

  it('returns true when parsed undefined.', () => {
    expect(isPrimative(undefined)).toBeTruthy();
  });

  it('returns true when parsed null.', () => {
    expect(isPrimative(null)).toBeTruthy();
  });

  it('returns true when parsed string.', () => {
    expect(isPrimative("Hello World")).toBeTruthy();
  });

  it('returns true when parsed number.', () => {
    expect(isPrimative(123)).toBeTruthy();
  });

  it('returns true when parsed boolean.', () => {
    expect(isPrimative(true)).toBeTruthy();
  });

  it('returns false when parsed function.', () => {
    expect(isPrimative(()=> {})).toBeFalsy();
  });

  it('returns false when parsed object.', () => {
    expect(isPrimative({})).toBeFalsy();
  });

  it('returns false when parsed array.', () => {
    expect(isPrimative([])).toBeFalsy();
  });

});