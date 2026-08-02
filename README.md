# 个人介绍网站

一个单页个人主页，基于 **React + Vite**。深色 / 浅色双主题，桌面到手机自适应，项目截图支持点击预览。

在线地址：`https://<项目名>.pages.dev`（部署在 Cloudflare Pages，域名在控制台可查）

仓库：<https://github.com/OPera2438/Personal_Introduction>

---

## 技术栈

| 项目 | 说明 |
| --- | --- |
| 框架 | React 19（函数组件 + Hooks，无类组件） |
| 构建 | Vite 8，输出到 `build/` |
| 样式 | 原生 CSS 单文件，主题走 CSS 自定义属性，布局用 Grid / Flex / **subgrid** |
| 路由 | 无。单页锚点滚动，不需要 react-router |
| 状态 | 无。组件内 `useState` 足够，不需要 Redux / Zustand |
| 外部资源 | Google Fonts（Playfair Display / Inter / Noto Sans SC）、Font Awesome 6（CDN） |

样式刻意没有用 CSS Modules 或 styled-components：这套样式表是按板块编号组织的整体设计，
拆进组件反而会打散 subgrid 这类跨组件的布局关系。

---

## 目录结构

```
personal/
├── index.html              # Vite 入口，含防闪屏的主题预设脚本
├── package.json
├── vite.config.js          # 关键：build.outDir 设为 build
├── .node-version           # Cloudflare 构建用的 Node 版本
├── public/
│   └── assets/             # 原样复制到产物，路径保持 /assets/xxx
│       ├── favicon.svg
│       ├── sports.png      # 项目截图：校园运动会系统
│       ├── OKR.png         # 项目截图：OKR 智能管理系统
│       └── carbon.png      # 项目截图：碳排放监测面板
└── src/
    ├── main.jsx            # 挂载 + 引入样式表
    ├── App.jsx             # 页面骨架，持有弹层状态
    ├── style.css           # 全部样式，按 19 个编号小节组织
    ├── data/
    │   ├── skills.js       # 六条技能：名称、百分比、说明
    │   └── projects.js     # 三个项目：截图、标题、简介、标签
    ├── hooks/
    │   ├── usePrefersReducedMotion.js
    │   ├── useTheme.js             # 主题切换 + 持久化 + 跟随系统
    │   ├── useTypewriter.js        # 副标题打字机
    │   ├── useHashScroll.js        # 锚点平滑滚动（事件委托）
    │   ├── useScrollValue.js       # rAF 节流的滚动派生值底座
    │   ├── useScrollSpy.js         # 导航高亮
    │   ├── useFadeOnScroll.js      # 首页箭头随滚动淡出
    │   └── useInView.js            # 进入视口检测
    └── components/
        ├── Header.jsx  Hero.jsx  Section.jsx
        ├── About.jsx   Skills.jsx  Projects.jsx  Contact.jsx
        ├── Footer.jsx  Lightbox.jsx  BackToTop.jsx
```

`style.css` 顶部的编号目录和文件里的分节注释一一对应，改样式时先看注释定位小节。

---

## 功能一览

- **深色 / 浅色主题**：跟随系统偏好，手动切换后记进 `localStorage`；`index.html` 里有一段同步执行的内联脚本，在 React 挂载前就定好主题，避免刷新闪白屏
- **打字机副标题**：逐字打出，停顿后清空重播
- **首页箭头淡出**：随滚动连续变淡，滚过 45% 屏高时完全消失
- **导航联动**：滚动到哪个板块就高亮哪个链接，导航栏离开首屏后转为毛玻璃
- **技能进度条**：滚动进入视口时从 0 动画到目标百分比，只播一次
- **项目卡片对齐**：截图 / 标题 / 简介 / 标签 / 按钮五行用 CSS subgrid 逐行对齐，文案长短不一也不会错位
- **截图预览**：点「查看详情」弹出大图 + 完整简介，支持 Esc、点背景、点关闭按钮三种关法，带焦点管理和滚动锁
- **无障碍与降级**：跳转链接、`aria-label`、焦点管理，并尊重系统的「减少动效」设置

---

## 本地开发

```bash
npm install     # 首次
npm run dev     # 开发服务器，改完自动热更新
```

打开终端提示的地址（默认 <http://localhost:5173>）。

```bash
npm run build   # 构建到 build/
npm run preview # 本地预览构建产物，行为最接近线上
```

---

## 部署上线

站点托管在 **Cloudflare Pages**，绑定 GitHub 仓库，推送到 `main` 即自动构建发布。

### 构建配置

在 Cloudflare 控制台 **Workers & Pages → 项目 → 设置 → 构建** 里确认：

| 配置项 | 值 |
| --- | --- |
| 框架预设 | React |
| 构建命令 | `npm run build` |
| 构建输出目录 | `build` |
| 根目录 | 留空 |

Vite 默认输出到 `dist/`，这里在 `vite.config.js` 里改成了 `build/`，就是为了和
React 预设的默认值对上，控制台不用额外改。

> 如果预设填的构建命令不是 `npm run build`（个别预设会填 `react-scripts build`），
> 手动改成 `npm run build`——本项目用的是 Vite，没有 react-scripts。

Node 版本由仓库根目录的 `.node-version` 指定（22）。Vite 8 要求 Node 20.19+，
Cloudflare 默认的 Node 版本可能偏低，这个文件是必需的。

`package-lock.json` 已提交，Cloudflare 会据此安装完全一致的依赖版本。

### 日常发布

```bash
git add .
git commit -m "更新内容"
git push
```

推送后 Cloudflare 自动拉取、`npm install`、`npm run build`、发布，一般一两分钟。
控制台的**部署**页面能看到每次记录，出问题可以一键回滚到任意历史版本。

### 其他

- **预览部署**：非 `main` 分支的推送会生成独立的预览地址，正式站点不受影响
- **自定义域名**：控制台 → 项目 → 自定义域，加一条 CNAME 即可，证书自动签发
- 字体和图标走 CDN；没有后端、环境变量和密钥

---

## 想改成自己的内容

大部分内容已经抽成数据文件，改数据就行，不用碰 JSX：

| 位置 | 内容 |
| --- | --- |
| `src/data/skills.js` | 六条技能：名称、百分比、说明（无障碍标签自动生成，不会再对不上） |
| `src/data/projects.js` | 三个项目：截图路径、标题、简介、标签、图片尺寸 |
| `src/components/About.jsx` | 关于我的两段文字、三个统计数字 |
| `src/components/Contact.jsx` | 邮箱、GitHub、微信、QQ |
| `src/components/Hero.jsx` | 大标题、打字机副标题 |
| `src/components/Header.jsx` | 导航项、左上角名字 |
| `src/components/Footer.jsx` | 页脚版权文字 |
| `index.html` | `<title>`、`<meta name="description">`、`<meta name="author">` |

换项目截图时把新图放进 `public/assets/`，同时更新 `projects.js` 里的 `image`、`width`、`height`
（尺寸填图片真实像素，浏览器据此预留位置，避免加载时页面跳动）。

配色改 `src/style.css` 第 1 节的两组 CSS 变量，浅色和深色各改一处即可，全站跟着变。

---

## 浏览器支持

面向现代浏览器，需要 **Chrome 117+ / Edge 117+ / Firefox 71+ / Safari 16+**。

门槛主要来自项目卡片用的 CSS `subgrid`。老版本浏览器会走
`@supports not (grid-template-rows: subgrid)` 的兜底样式，退回弹性布局——底部按钮仍然对齐，
只是标题、简介的起点可能差一点。IE 不支持，也不打算支持。

---

## 许可

站点代码可自由参考。文字、截图和个人信息属于本人，请勿直接照搬。
