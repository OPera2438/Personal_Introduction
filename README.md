# 刘畅 · 个人介绍网站

一个纯静态的个人主页：无框架、无构建步骤，克隆下来双击 `index.html` 就能看。
深色 / 浅色双主题，桌面到手机自适应，项目截图支持点击预览。

在线地址：部署后填在这里（见下方「部署上线」）

---

## 技术栈

| 项目 | 说明 |
| --- | --- |
| 结构 | 原生 HTML5，语义化标签 |
| 样式 | 原生 CSS，主题走 CSS 自定义属性，布局用 Grid / Flex / **subgrid** |
| 交互 | 原生 JavaScript（ES5 语法 + IIFE），无任何依赖 |
| 外部资源 | Google Fonts（Playfair Display / Inter / Noto Sans SC）、Font Awesome 6（CDN） |

没有 npm、没有打包器、没有 CI 构建——这是刻意的选择：静态站点用不上，也省掉一整套维护成本。

---

## 目录结构

```
personal/
├── index.html              # 全部页面结构（单页，五个板块）
├── style.css               # 全部样式，按 19 个编号小节组织
├── script.js               # 全部交互，7 个 init 函数
├── assets/
│   ├── favicon.svg         # 站点图标
│   ├── sports.png          # 项目截图：校园运动会系统
│   ├── OKR.png             # 项目截图：OKR 智能管理系统
│   └── carbon.png          # 项目截图：碳排放监测面板
├── .github/workflows/
│   └── deploy.yml          # 推送到 main 自动发布到 GitHub Pages
├── .nojekyll               # 告诉 Pages 别用 Jekyll 处理，原样发布
└── .gitignore
```

`style.css` 顶部的编号目录和文件里的分节注释一一对应，改样式时先看注释定位小节。

---

## 功能一览

- **深色 / 浅色主题**：跟随系统偏好，手动切换后记进 `localStorage`；`<head>` 里有一段同步执行的内联脚本，避免刷新时闪白屏
- **打字机副标题**：逐字打出，停顿后清空重播
- **首页箭头淡出**：随滚动连续变淡，滚过 45% 屏高时完全消失
- **导航联动**：滚动到哪个板块就高亮哪个链接，导航栏离开首屏后转为毛玻璃
- **技能进度条**：滚动进入视口时从 0 动画到目标百分比，只播一次
- **项目卡片对齐**：截图 / 标题 / 简介 / 标签 / 按钮五行用 CSS subgrid 逐行对齐，文案长短不一也不会错位
- **截图预览**：点「查看详情」弹出大图 + 完整简介，支持 Esc、点背景、点关闭按钮三种关法
- **回到顶部**：下滚约一屏后浮现在右下角
- **无障碍与降级**：跳转链接、`aria-label`、焦点管理，并尊重系统的「减少动效」设置

---

## 本地预览

最简单的方式是直接双击 `index.html`。如果想用本地服务器（路径行为更接近线上）：

```bash
# 有 Node 就用这个
npx serve .

# 有 Python 3 也行
python -m http.server 8000
```

然后打开终端里提示的地址。VS Code 用户装个 Live Server 插件，右键「Open with Live Server」最省事，还能改完自动刷新。

---

## 部署上线

### 方案 A：GitHub Pages（推荐，已配好）

仓库里的 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 已经写好，**只差在 GitHub 上开一次开关**：

1. 推送代码到 `main` 分支
2. 打开仓库的 **Settings → Pages**
3. 把 **Source** 从 `Deploy from a branch` 改成 **`GitHub Actions`**
4. 回到 **Actions** 标签页，看那次工作流跑完（约一分钟）

之后每次 `git push` 到 `main` 都会自动重新发布，不需要再操作。

访问地址是 `https://<用户名>.github.io/<仓库名>/`。

> **注意**：当前远程仓库名是 `-`（一个短横线），地址会变成 `https://opera2438.github.io/-/`，既难念也难分享。
> 建议先在 GitHub 上把仓库改名，比如 `personal-site`；如果改成 `OPera2438.github.io`，
> 地址就会变成 `https://opera2438.github.io/` 这种根路径。
> 改名后本地要同步更新远程地址：
>
> ```bash
> git remote set-url opera https://github.com/OPera2438/新仓库名.git
> ```

### 方案 B：Vercel / Netlify

两家都能直接托管静态站点，也都免费：

- **Vercel**：导入 GitHub 仓库，框架预设选 **Other**，构建命令留空，输出目录填 `.`
- **Netlify**：可以直接把整个文件夹拖进网页；或连接仓库，同样不填构建命令

两者都会自动配好 HTTPS，也支持绑定自己的域名。

### 部署前检查

- 站内所有路径都是相对路径（`style.css`、`assets/...`），放在子目录下也不会失效，不需要改 `base`
- 字体和图标走 CDN，服务器不用做任何配置
- 没有后端、没有环境变量、没有密钥

---

## 想改成自己的内容

主要集中在 `index.html`，改这几处就够：

| 位置 | 内容 |
| --- | --- |
| `<head>` | `<title>`、`<meta name="description">`、`<meta name="author">` |
| 导航栏 | `.nav__logo` 里的名字 |
| Hero | `.hero__display` 的大标题、`#typewriter` 的 `data-text`（**要和标签里的文字保持一致**） |
| 关于我 | `.about__text` 三段文字、`.about__stats` 三个数字 |
| 技能 | 六个 `.skill`：名称、百分比、`data-width`、`aria-valuenow` 和说明文字 |
| 项目 | 三张 `.project-card`：截图、标题、简介、标签 |
| 联系 | `.contact-list` 里的邮箱、GitHub、微信、QQ |
| 页脚 | 版权文字 |

换项目截图时把新图放进 `assets/`，同时更新 `<img>` 的 `src` 和 `width` / `height`（填图片真实像素，浏览器据此预留位置，避免加载时页面跳动）。

配色改 `style.css` 第 1 节的两组 CSS 变量，浅色和深色各改一处即可，全站跟着变。

---

## 浏览器支持

面向现代浏览器，需要 **Chrome 117+ / Edge 117+ / Firefox 71+ / Safari 16+**。

门槛主要来自项目卡片用的 CSS `subgrid`。老版本浏览器会走 `@supports not (grid-template-rows: subgrid)` 的兜底样式，退回弹性布局——底部按钮仍然对齐，只是标题、简介的起点可能差一点。IE 不支持，也不打算支持。

---

## 许可

站点代码可自由参考。文字、截图和个人信息属于本人，请勿直接照搬。
