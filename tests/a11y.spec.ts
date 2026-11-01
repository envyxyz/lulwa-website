// T8
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { allRoutes, visit } from './lib';

for (const width of [1440, 390]) {
  for (const path of allRoutes()) {
    test(`T8 ${path} at ${width} has no serious axe issue`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await visit(page, path);
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
}
