# 快速开始

patch-mark 是一个零依赖的 Web Component：在预览页上指一个元素、写一句意见，你的 AI 编程助手就能拿到修代码所需的结构化上下文——CSS 选择器、元素名、位置、可见文本和反馈内容。不用再发"左边那个按钮"的截图了。

它不是给人审阅用的批注库——它是**人和 AI 编程助手之间的反馈通道**。

## 零配置（localStorage）

```html
<script type="module" src="https://unpkg.com/patch-mark"></script>
<patch-mark visible></patch-mark>
```

点浮动按钮，悬停任意元素，点击选中，写下意见，发送即可。批注存在 `localStorage`。

浮动按钮可拖动——拖到任意位置，或拖到屏幕边缘（也可点 hover 时出现的小折叠按钮）收成边缘细条。hover 细条预览展开，点击恢复。位置和折叠状态刷新后保留。

选中模式下页面动画和循环视频会冻结，移动中的目标停住便于选中——退出即恢复。快捷键：`Esc` 逐层退出（compose → picking → 关闭，或关闭列表），`Cmd/Ctrl+Enter` 发送正在写的批注。

> `visible` 属性控制工具是否显示。它在原生元素上**默认关闭**，生产构建保持干净——只在预览/预发布环境开启。`patch-mark/react` 封装反过来了：默认可见，所以只需门控渲染这一步。

```html
<!-- 隐藏（默认，生产） -->
<patch-mark></patch-mark>

<!-- 可见（预发布） -->
<patch-mark visible></patch-mark>
```

```js
document.querySelector('patch-mark').visible = true; // 运行时切换
```

> 生产环境建议自托管脚本，或给 CDN 标签加 [SRI 完整性](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) 校验。

## CDN（免安装、免构建）

```html
<!-- unpkg，始终最新 -->
<script type="module" src="https://unpkg.com/patch-mark"></script>

<!-- jsdelivr，锁定版本（共享场景推荐） -->
<script type="module" src="https://cdn.jsdelivr.net/npm/patch-mark@0.5.0"></script>
```

用不了 `type="module"`？（CMS 代码框、标签管理器、老管线）——用 IIFE 构建，它会注册元素并暴露 `PatchMark` 全局：

```html
<script src="https://unpkg.com/patch-mark/dist/patch-mark.iife.js"></script>
<patch-mark visible></patch-mark>
<script>
  // 全局上有编程 API：
  // PatchMark.createFetchStore, PatchMark.formatAnnotationsAsPrompt, ...
</script>
```

## 接后端

```ts
import 'patch-mark';
import { createFetchStore } from 'patch-mark';

const tool = document.querySelector('patch-mark')!;
tool.store = createFetchStore({ endpoint: '/api/annotations' });
```

批注就流向你的服务器，编程助手以结构化数据读取。见 [Store 适配器与 REST 契约](/zh/guide/store)。

## 浏览器支持

Chrome 111+ / Firefox 113+ / Safari 16.2+（`color-mix` 支持线）。

内置跨浏览器回退：

- `color-mix()` → 旧浏览器回退为纯色
- `backdrop-filter` → `-webkit-` 前缀 + `@supports` 纯色背景回退
- `100vh` → `100dvh` 带 `vh` 回退（移动端视口修正）
- `localStorage` → 隐私模式回退为内存数组

无需 polyfill。Shadow DOM、Custom Elements、CSS 自定义属性在目标范围内原生支持。

## 从源码构建

```bash
npm install
npm run build
# dist/patch-mark.js       (ESM，gzip ~11 KB，零依赖)
# dist/patch-mark.iife.js (IIFE，用于原生 <script> 标签)
```
