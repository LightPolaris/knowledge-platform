import { test, expect } from '@playwright/test';

test.describe('审核按钮跳转调试测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/documents');
    await page.waitForLoadState('networkidle');
  });

  test('调试审核按钮点击和跳转', async ({ page }) => {
    // 切换到所有文档标签页
    await page.getByRole('button', { name: '所有文档' }).click();
    await page.waitForTimeout(500);

    // 监听控制台错误
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 监听页面导航
    const navigationPromises: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/documents/review/')) {
        navigationPromises.push(response.url());
      }
    });

    // 查找审核按钮
    const reviewButton = page.getByRole('button', { name: '审核' }).first();
    await expect(reviewButton).toBeVisible();

    // 点击审核按钮
    console.log('点击审核按钮...');
    await reviewButton.click();

    // 等待可能的导航
    await page.waitForTimeout(2000);

    // 检查当前URL
    const currentUrl = page.url();
    console.log('当前URL:', currentUrl);

    // 检查是否有控制台错误
    if (consoleErrors.length > 0) {
      console.log('控制台错误:', consoleErrors);
    }

    // 检查是否成功跳转
    if (currentUrl.includes('/documents/review/')) {
      console.log('✅ 成功跳转到审核页面');
      await expect(page.getByText('文档审核')).toBeVisible();
    } else {
      console.log('❌ 跳转失败，当前仍在文档列表页面');
      
      // 尝试直接访问审核页面
      console.log('尝试直接访问审核页面...');
      await page.goto('http://localhost:3000/documents/review/1');
      await page.waitForLoadState('networkidle');
      
      const reviewPageUrl = page.url();
      console.log('直接访问后的URL:', reviewPageUrl);
      
      if (reviewPageUrl.includes('/documents/review/')) {
        console.log('✅ 审核页面可以正常访问');
        await expect(page.getByText('文档审核')).toBeVisible();
      } else {
        console.log('❌ 审核页面无法访问');
      }
    }
  });

  test('检查审核按钮的事件处理', async ({ page }) => {
    await page.getByRole('button', { name: '所有文档' }).click();
    await page.waitForTimeout(500);

    // 监听点击事件
    let clickHandled = false;
    page.on('console', msg => {
      if (msg.text().includes('handleDocumentAction') || msg.text().includes('review')) {
        clickHandled = true;
        console.log('点击事件处理:', msg.text());
      }
    });

    const reviewButton = page.getByRole('button', { name: '审核' }).first();
    
    // 检查按钮是否可点击
    const isEnabled = await reviewButton.isEnabled();
    console.log('审核按钮是否可点击:', isEnabled);

    // 检查按钮的onClick属性
    const onClick = await reviewButton.getAttribute('onclick');
    console.log('按钮onClick属性:', onClick);

    // 点击按钮
    await reviewButton.click();
    await page.waitForTimeout(1000);

    console.log('点击事件是否被处理:', clickHandled);
  });

  test('检查路由配置', async ({ page }) => {
    // 直接测试审核页面路由
    const testUrls = [
      'http://localhost:3000/documents/review/1',
      'http://localhost:3000/documents/review/2',
      'http://localhost:3000/documents/review/999'
    ];

    for (const url of testUrls) {
      console.log(`测试URL: ${url}`);
      
      const response = await page.goto(url);
      const status = response?.status();
      console.log(`状态码: ${status}`);
      
      if (status === 200) {
        const title = await page.title();
        console.log(`页面标题: ${title}`);
        
        const hasReviewContent = await page.getByText('文档审核').isVisible().catch(() => false);
        console.log(`包含审核内容: ${hasReviewContent}`);
      }
      
      await page.waitForTimeout(500);
    }
  });
});
