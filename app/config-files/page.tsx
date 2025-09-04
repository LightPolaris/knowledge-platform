import React from 'react';
import ConfigFileDisplay from '@/components/config-file-display';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '配置文件管理',
  description: '系统配置文件展示和管理',
};

export default function ConfigFilesPage() {
  // 模拟配置文件数据
  const configFiles = [
    {
      fileName: 'stagewise.json',
      content: {
        appPort: 3000
      },
      description: '应用端口配置文件'
    },
    {
      fileName: 'package.json',
      content: {
        name: "my-v0-project",
        version: "0.1.0",
        private: true,
        scripts: {
          build: "next build",
          dev: "next dev",
          lint: "next lint",
          start: "next start"
        }
      },
      description: '项目依赖和脚本配置'
    },
    {
      fileName: 'next.config.mjs',
      content: {
        experimental: {
          optimizePackageImports: ["lucide-react"]
        }
      },
      description: 'Next.js 框架配置'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">配置文件管理</h1>
          <p className="text-muted-foreground">查看和管理系统配置文件，所有配置都采用统一的科技蓝主题</p>
        </div>
        
        <div className="space-y-6">
          {configFiles.map((file, index) => (
            <ConfigFileDisplay
              key={index}
              fileName={file.fileName}
              content={file.content}
              description={file.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
