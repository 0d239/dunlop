import { describe, expect, test } from 'bun:test';
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  stepCategory,
} from './categories';

describe('CATEGORY_ORDER', () => {
  test('contains all 9 categories in reading order', () => {
    expect(CATEGORY_ORDER).toEqual([
      'picks',
      'electronics',
      'capos',
      'slides',
      'strings',
      'cables',
      'straps',
      'apparel',
      'artists',
    ]);
  });

  test('every entry has a label', () => {
    for (const cat of CATEGORY_ORDER) {
      expect(CATEGORY_LABELS[cat]).toBeTruthy();
    }
  });
});

describe('stepCategory', () => {
  test('moves forward by one', () => {
    expect(stepCategory('picks', 1)).toBe('electronics');
    expect(stepCategory('slides', 1)).toBe('strings');
  });

  test('moves backward by one', () => {
    expect(stepCategory('electronics', -1)).toBe('picks');
    expect(stepCategory('strings', -1)).toBe('slides');
  });

  test('wraps at the end going forward', () => {
    expect(stepCategory('artists', 1)).toBe('picks');
  });

  test('wraps at the start going backward', () => {
    expect(stepCategory('picks', -1)).toBe('artists');
  });
});
