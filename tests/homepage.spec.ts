import { test, expect } from '@playwright/test';

test.describe('知识平台首页', () => {
  test('应该显示页面标题', async ({ page }) => {
    await page.goto('/');
    
    // 检查页面标题
    await expect(page).toHaveTitle(/知识平台/);
    
    // 检查主要元素是否存在
    await expect(page.locator('h1')).toBeVisible();
  });

  test('应该显示PDF预览组件', async ({ page }) => {
    await page.goto('/');
    
    // 检查PDF预览区域是否存在
    await expect(page.locator('iframe')).toBeVisible();
  });

  test('应该能够切换PDF文档', async ({ page }) => {
    await page.goto('/');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 检查PDF选择器是否存在
    const pdfSelector = page.locator('select').first();
    await expect(pdfSelector).toBeVisible();
    
    // 尝试选择不同的PDF
    await pdfSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);
  });
});
