import { test, expect } from '@playwright/test';

test.describe('文档审核功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/documents');
    await page.waitForLoadState('networkidle');
  });

  test('应该显示文档管理页面', async ({ page }) => {
    // 检查页面标题
    await expect(page.getByText('文档管理')).toBeVisible();
    await expect(page.getByText('上传、组织和管理您的技术文档')).toBeVisible();
  });

  test('应该显示所有文档标签页', async ({ page }) => {
    // 检查标签页
    const tabs = ['所有文档', '上传文档', '文档分组'];
    for (const tabName of tabs) {
      await expect(page.getByRole('button', { name: tabName })).toBeVisible();
    }
  });

  test('应该显示已解析未审核文档的审核按钮', async ({ page }) => {
    // 切换到所有文档标签页
    await page.getByRole('button', { name: '所有文档' }).click();
    await page.waitForTimeout(500);

    // 查找已解析未审核的文档
    const reviewButton = page.getByRole('button', { name: '审核' }).first();
    await expect(reviewButton).toBeVisible();
  });

  test('点击审核按钮应该跳转到审核页面', async ({ page }) => {
    // 切换到所有文档标签页
    await page.getByRole('button', { name: '所有文档' }).click();
    await page.waitForTimeout(500);

    // 点击第一个审核按钮
    const reviewButton = page.getByRole('button', { name: '审核' }).first();
    await reviewButton.click();

    // 等待页面跳转
    await page.waitForLoadState('networkidle');

    // 检查是否跳转到审核页面
    await expect(page).toHaveURL(/\/documents\/review\/\d+/);
    await expect(page.getByText('文档审核')).toBeVisible();
  });

  test('审核页面应该显示PDF和Markdown编辑器', async ({ page }) => {
    // 直接访问审核页面
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 检查页面标题
    await expect(page.getByText('文档审核')).toBeVisible();
    await expect(page.getByText('审核解析后的文档内容')).toBeVisible();

    // 检查PDF查看器
    await expect(page.getByText('PDF原文')).toBeVisible();
    await expect(page.locator('iframe')).toBeVisible();

    // 检查Markdown编辑器
    await expect(page.getByText('解析后的Markdown')).toBeVisible();
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('应该支持编辑/预览模式切换', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 检查编辑按钮
    const editButton = page.getByRole('button', { name: '编辑' });
    await expect(editButton).toBeVisible();

    // 点击编辑按钮
    await editButton.click();
    await page.waitForTimeout(200);

    // 检查是否切换到编辑模式
    await expect(page.getByRole('button', { name: '预览' })).toBeVisible();
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('应该支持Markdown内容编辑', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 切换到编辑模式
    await page.getByRole('button', { name: '编辑' }).click();
    await page.waitForTimeout(200);

    // 获取Markdown编辑器
    const markdownEditor = page.getByRole('textbox');
    await expect(markdownEditor).toBeVisible();

    // 清空并输入新内容
    await markdownEditor.clear();
    await markdownEditor.fill('# 测试文档\n\n这是一个测试文档。');

    // 检查内容是否已更新
    await expect(markdownEditor).toHaveValue('# 测试文档\n\n这是一个测试文档。');
  });

  test('应该显示保存按钮当有更改时', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 切换到编辑模式
    await page.getByRole('button', { name: '编辑' }).click();
    await page.waitForTimeout(200);

    // 修改内容
    const markdownEditor = page.getByRole('textbox');
    await markdownEditor.clear();
    await markdownEditor.fill('# 修改后的内容');

    // 检查保存按钮是否出现
    await expect(page.getByRole('button', { name: '保存' })).toBeVisible();
  });

  test('应该支持键盘快捷键', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 测试Ctrl+E切换编辑模式
    await page.keyboard.press('Control+e');
    await page.waitForTimeout(200);

    // 检查是否切换到编辑模式
    await expect(page.getByRole('button', { name: '预览' })).toBeVisible();
  });

  test('应该显示审核操作按钮', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 检查审核按钮
    await expect(page.getByRole('button', { name: '拒绝' })).toBeVisible();
    await expect(page.getByRole('button', { name: '通过审核' })).toBeVisible();
  });

  test('应该显示文档信息', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 检查文档信息
    await expect(page.getByText('会议纪要 2024-01-19.pdf')).toBeVisible();
    await expect(page.getByText('PDF • 856 KB')).toBeVisible();
    await expect(page.getByText('王秘书')).toBeVisible();
    await expect(page.getByText('2024-01-19')).toBeVisible();
  });

  test('应该显示状态标签', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 检查状态标签
    await expect(page.getByText('已解析未审核')).toBeVisible();
  });

  test('应该支持返回功能', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 点击返回按钮
    const backButton = page.getByRole('button', { name: '返回' });
    await expect(backButton).toBeVisible();
    await backButton.click();

    // 检查是否返回到文档列表
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/documents$/);
  });

  test('PDF查看器应该正常加载', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 检查PDF iframe是否存在
    const pdfIframe = page.locator('iframe');
    await expect(pdfIframe).toBeVisible();
    
    // 检查iframe的src属性
    const src = await pdfIframe.getAttribute('src');
    expect(src).toContain('dummy.pdf');
  });

  test('Markdown编辑器应该显示初始内容', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 切换到编辑模式查看内容
    await page.getByRole('button', { name: '编辑' }).click();
    await page.waitForTimeout(200);

    const markdownEditor = page.getByRole('textbox');
    const content = await markdownEditor.inputValue();
    
    // 检查是否包含预期的Markdown内容
    expect(content).toContain('# 会议纪要');
    expect(content).toContain('会议基本信息');
  });

  test('应该显示字符计数', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 切换到编辑模式
    await page.getByRole('button', { name: '编辑' }).click();
    await page.waitForTimeout(200);

    // 检查字符计数显示
    await expect(page.getByText(/字符/)).toBeVisible();
  });

  test('应该支持保存操作', async ({ page }) => {
    await page.goto('http://localhost:3000/documents/review/1');
    await page.waitForLoadState('networkidle');

    // 切换到编辑模式
    await page.getByRole('button', { name: '编辑' }).click();
    await page.waitForTimeout(200);

    // 修改内容
    const markdownEditor = page.getByRole('textbox');
    await markdownEditor.clear();
    await markdownEditor.fill('# 测试保存功能');

    // 点击保存按钮
    const saveButton = page.getByRole('button', { name: '保存' });
    await saveButton.click();

    // 等待保存完成
    await page.waitForTimeout(1000);

    // 检查是否显示保存成功提示（如果有toast的话）
    // 这里可以根据实际的toast实现来调整
  });
});
