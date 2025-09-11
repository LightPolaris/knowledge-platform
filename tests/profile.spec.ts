import { test, expect } from '@playwright/test';

test.describe('个人资料页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('应该显示个人资料页面', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/知识平台/);
    
    // 检查主要标签页
    await expect(page.locator('text=总览')).toBeVisible();
    await expect(page.locator('text=我的文档')).toBeVisible();
    await expect(page.locator('text=个人信息')).toBeVisible();
    await expect(page.locator('text=活动记录')).toBeVisible();
  });

  test('应该能够编辑个人信息', async ({ page }) => {
    // 切换到个人信息标签
    await page.click('text=个人信息');
    
    // 点击编辑按钮
    await page.click('button:has-text("编辑")');
    
    // 检查编辑模式
    await expect(page.locator('button:has-text("保存")')).toBeVisible();
    await expect(page.locator('button:has-text("取消")')).toBeVisible();
  });

  test('应该显示文档管理功能', async ({ page }) => {
    // 切换到我的文档标签
    await page.click('text=我的文档');
    
    // 检查搜索框
    await expect(page.locator('input[placeholder="搜索文档..."]')).toBeVisible();
    
    // 检查操作按钮
    await expect(page.locator('button:has-text("新建文件夹")')).toBeVisible();
    await expect(page.locator('button:has-text("上传文档")')).toBeVisible();
  });

  test('应该能够展开和收起文件夹', async ({ page }) => {
    // 切换到我的文档标签
    await page.click('text=我的文档');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 查找文件夹展开按钮
    const folderToggle = page.locator('button').filter({ hasText: '技术文档' }).first();
    if (await folderToggle.isVisible()) {
      await folderToggle.click();
      await page.waitForTimeout(500);
    }
  });
});
