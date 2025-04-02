import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import degit from 'degit';

export type CreateProjectOptions = {
  name: string;
  template: string;
};

export async function createProject({ name, template }: CreateProjectOptions) {
  const targetDir = path.resolve(process.cwd(), name);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ 專案資料夾 ${name} 已存在`);
    process.exit(1);
  }

  console.log(`📥 從 GitHub 下載模板 ${template}...`);

  const emitter = degit(template, { cache: false, force: true });

  await emitter.clone(targetDir);

  // 移除 .git
  fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });

  console.log(`✅ 專案 ${name} 已建立於 ${targetDir}`);

  // 初始化 git（可選）
  execSync('git init', { cwd: targetDir, stdio: 'inherit' });

  // 安裝依賴（可選）
  // execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
}
