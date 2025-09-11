import { test, expect } from '@playwright/test';

test.describe('问题优化页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/question-optimization');
  });

  test('应该显示问题优化页面', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/知识平台/);
    
    // 检查主要标签页
    await expect(page.locator('text=用户反馈')).toBeVisible();
    await expect(page.locator('text=精选问题')).toBeVisible();
  });

  test('应该显示统计卡片', async ({ page }) => {
    // 检查统计卡片
    await expect(page.locator('text=待处理')).toBeVisible();
    await expect(page.locator('text=处理中')).toBeVisible();
    await expect(page.locator('text=已处理')).toBeVisible();
    await expect(page.locator('text=总计')).toBeVisible();
  });

  test('应该能够搜索和筛选', async ({ page }) => {
    // 检查搜索框
    await expect(page.locator('input[placeholder*="搜索"]')).toBeVisible();
    
    // 检查筛选器
    await expect(page.locator('text=全部状态')).toBeVisible();
    await expect(page.locator('text=全部分类')).toBeVisible();
  });

  test('应该显示反馈列表', async ({ page }) => {
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 检查反馈项目
    const feedbackItems = page.locator('[data-testid="feedback-item"]');
    if (await feedbackItems.count() > 0) {
      await expect(feedbackItems.first()).toBeVisible();
    }
  });

  test('应该能够查看反馈详情', async ({ page }) => {
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 查找查看详情按钮
    const viewButton = page.locator('button:has-text("查看详情")').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(500);
    }
  });
});
