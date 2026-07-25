# 森屿 · 种子花园 Seed Garden

> 把长期目标拆成每日行动，并将坚持的过程可视化为一片逐渐生长的森林。

专注 / 目标管理类 Web 应用：每一次专注投入都会在你的「土地」上长出一棵树，短时任务开成花草，日积月累汇成一片属于自己的森林。

🌱 **在线体验**：<https://seedgarden.vercel.app/> _(部署后替换为真实链接)_

## 功能亮点

- **目标 → 土地 → 树木** 的成长隐喻：目标拆解为任务，专注时长决定树木的生长阶段（幼苗 → 成材）
- **数据统计**：土地数、树木总数、累计投入时长、种类分布、生长阶段分布，支持日 / 月 / 年切换
- **连续打卡与花园星光**：连签激励、荣誉指标、成林进度条
- **社区拜访**：浏览邻居花园、点赞 / 留言（带时间戳）/ 加好友（需对方同意的申请流程）
- **个性化**：土地外观（森林 / 秋景等）与天气主题实时预览切换
- **纯前端持久化**：数据保存在浏览器本地，无需登录、无需后端

## 技术栈

| 领域 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript |
| 构建 | Vite（`vite-plugin-singlefile` 支持单文件产物） |
| 状态管理 | Zustand + `persist` 中间件（localStorage 持久化） |
| 测试 | Vitest + @testing-library/react（jsdom） |

数据模型采用「目标 Project → 任务 Task → 专注记录 FocusSession」的独立分层设计，核心业务逻辑（星光计算、连签、生长阶段、时间聚合）与视图解耦，并由 16 个用例覆盖验收。

## 本地运行

```bash
npm install
npm run dev      # 本地开发
```

## 构建与测试

```bash
npm test         # 运行 Vitest 测试
npm run build    # 构建到 dist/
```

## 部署

纯静态站点，可一键部署到 Vercel / Netlify / Cloudflare Pages：

- Framework Preset：**Vite**
- Build Command：`npm run build`
- Output Directory：`dist`
