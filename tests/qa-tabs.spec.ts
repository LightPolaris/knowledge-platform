import { test, expect } from '@playwright/test';

test.describe('智能问答标签页功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
  });

  test('应该显示所有6个标签页', async ({ page }) => {
    // 检查所有标签页是否显示
    const tabs = [
      '智能对话',
      '错题库', 
      '精选问题',
      '专家优化',
      '对话历史',
      '统计分析'
    ];

    for (const tabName of tabs) {
      await expect(page.getByRole('button', { name: tabName })).toBeVisible();
    }
  });

  test('默认应该激活"智能对话"标签页', async ({ page }) => {
    // 检查"智能对话"标签页是否为激活状态
    const activeTab = page.getByRole('button', { name: '智能对话' });
    await expect(activeTab).toHaveClass(/text-blue-600/);
    await expect(activeTab).toHaveClass(/bg-white/);
  });

  test('点击标签页应该切换激活状态', async ({ page }) => {
    // 点击"错题库"标签页
    await page.getByRole('button', { name: '错题库' }).click();
    
    // 等待状态更新
    await page.waitForTimeout(200);
    
    // 检查"错题库"是否变为激活状态
    const wrongQuestionsTab = page.getByRole('button', { name: '错题库' });
    await expect(wrongQuestionsTab).toHaveClass(/text-blue-600/);
    await expect(wrongQuestionsTab).toHaveClass(/bg-white/);
    
    // 检查"智能对话"是否变为非激活状态
    const intelligentDialogueTab = page.getByRole('button', { name: '智能对话' });
    await expect(intelligentDialogueTab).toHaveClass(/text-gray-600/);
    await expect(intelligentDialogueTab).toHaveClass(/bg-gray-100/);
  });

  test('所有标签页都应该可以点击', async ({ page }) => {
    const tabs = [
      '错题库', 
      '精选问题',
      '专家优化',
      '对话历史',
      '统计分析'
    ];

    for (const tabName of tabs) {
      await page.getByRole('button', { name: tabName }).click();
      
      // 等待状态更新
      await page.waitForTimeout(100);
      
      // 检查标签页是否变为激活状态
      const tab = page.getByRole('button', { name: tabName });
      await expect(tab).toHaveClass(/text-blue-600/);
      await expect(tab).toHaveClass(/bg-white/);
    }
  });

  test('标签页应该有正确的样式', async ({ page }) => {
    // 检查激活标签页的样式
    const activeTab = page.getByRole('button', { name: '智能对话' });
    await expect(activeTab).toHaveClass(/rounded-t-lg/);
    await expect(activeTab).toHaveClass(/border-t/);
    await expect(activeTab).toHaveClass(/border-l/);
    await expect(activeTab).toHaveClass(/border-r/);
  });

  test('标签页切换应该保持界面稳定', async ({ page }) => {
    // 记录初始状态
    const initialHeight = await page.locator('main').boundingBox();
    
    // 切换标签页
    await page.getByRole('button', { name: '精选问题' }).click();
    
    // 检查界面高度是否保持稳定
    const afterClickHeight = await page.locator('main').boundingBox();
    expect(afterClickHeight?.height).toBe(initialHeight?.height);
  });
});
