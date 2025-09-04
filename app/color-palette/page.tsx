"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ColorPalettePage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">设计规范颜色展示</h1>
        <p className="text-muted-foreground">基于科技蓝主题的完整配色方案</p>
      </div>

      {/* 主色调 */}
      <Card>
        <CardHeader>
          <CardTitle>主色调 - 科技蓝系列</CardTitle>
          <CardDescription>纯净、沉稳、广阔，充分诠释产品的商务性和科技感</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">主色(正常)</div>
                <div className="text-muted-foreground">#0060DF</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary-hover rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">鼠标点击</div>
                <div className="text-muted-foreground">#0A58BF</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary-active rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">鼠标悬停</div>
                <div className="text-muted-foreground">#247FF8</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary-loading rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">加载中</div>
                <div className="text-muted-foreground">#5997EA</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary-disabled rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">禁用</div>
                <div className="text-muted-foreground">#B2CFF5</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary-bg-hover rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">背景鼠标移入</div>
                <div className="text-muted-foreground">#E5EFFB</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 中性色 */}
      <Card>
        <CardHeader>
          <CardTitle>中性色</CardTitle>
          <CardDescription>用于背景、边框、分割线等场景，通过运用不同明度的中性色来表现层次结构</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-overlay rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">模态窗遮罩层</div>
                <div className="text-muted-foreground">#000000 36%</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-border rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">边框描边</div>
                <div className="text-muted-foreground">#E8BE83</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-shadow rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">投影</div>
                <div className="text-muted-foreground">#000000 10%</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-secondary rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">表格表头背景色</div>
                <div className="text-muted-foreground">#EEF0F2</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 功能色 */}
      <Card>
        <CardHeader>
          <CardTitle>功能色（辅助）</CardTitle>
          <CardDescription>代表明确的信息以及状态，用于表现界面的韵律感和细节</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-info rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">处理中/正常</div>
                <div className="text-muted-foreground">#0091FF</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-destructive rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">删除/失败/错误</div>
                <div className="text-muted-foreground">#F4333C</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-warning rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">预警/警告/异常</div>
                <div className="text-muted-foreground">#F2AC06</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-success rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">成功/通过</div>
                <div className="text-muted-foreground">#02CF80</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-link rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">链接色</div>
                <div className="text-muted-foreground">#204BE3</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-inactive rounded-lg border"></div>
              <div className="text-sm">
                <div className="font-medium">未审/已结束</div>
                <div className="text-muted-foreground">#8EA3B8</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 文字色 */}
      <Card>
        <CardHeader>
          <CardTitle>文字色</CardTitle>
          <CardDescription>不同灰度的文字色，使页面信息明确的主次关系和对比</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-foreground rounded-lg border flex items-center justify-center">
                <span className="text-white font-medium">大标题色/正文</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">#333333</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-muted-foreground rounded-lg border flex items-center justify-center">
                <span className="text-white font-medium">次要文本/辅助</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">#666666</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-lg border flex items-center justify-center" style={{backgroundColor: '#999999'}}>
                <span className="text-white font-medium">辅助类/提示类</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">#999999</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 rounded-lg border flex items-center justify-center" style={{backgroundColor: '#CCCCCC'}}>
                <span className="text-white font-medium">禁用/失效</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">#CCCCCC</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 按钮示例 */}
      <Card>
        <CardHeader>
          <CardTitle>按钮示例</CardTitle>
          <CardDescription>使用新配色方案的按钮组件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>主要按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="destructive">危险按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button disabled>禁用按钮</Button>
          </div>
        </CardContent>
      </Card>

      {/* 徽章示例 */}
      <Card>
        <CardHeader>
          <CardTitle>徽章示例</CardTitle>
          <CardDescription>使用新配色方案的徽章组件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>默认</Badge>
            <Badge variant="secondary">次要</Badge>
            <Badge variant="destructive">错误</Badge>
            <Badge variant="outline">轮廓</Badge>
            <Badge className="bg-success text-success-foreground">成功</Badge>
            <Badge className="bg-warning text-warning-foreground">警告</Badge>
            <Badge className="bg-info text-info-foreground">信息</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
