// T21. tsc catches a missing key; this also catches different array lengths, the thing types cannot see.
import { expect, test } from '@playwright/test';
import { ar } from '../src/content/ar';
import { en } from '../src/content/en';

const GROUPS = ['home', 'services', 'faults', 'areas', 'brands', 'about', 'contact', 'reviews', 'work', 'legal', 'blog'];

const shape = (value: unknown, path = ''): string[] => {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((item, i) => shape(item, `${path}[${i}]`))];
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => shape(item, `${path}.${key}`));
  return [path];
};

for (const group of GROUPS) {
  test(`T21 both languages have the ${group} group`, () => {
    expect(ar).toHaveProperty(group);
    expect(en).toHaveProperty(group);
  });
}

test('T21 Arabic and English have the same shape', () => {
  expect(shape(en).sort()).toEqual(shape(ar).sort());
});
