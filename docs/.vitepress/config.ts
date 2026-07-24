import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'patch-mark',
  description:
    'UI feedback for AI coding agents — point at elements, get structured context for your agent.',
  base: '/patch-mark/docs/',
  locales: {
    root: { label: 'English', lang: 'en' },
    zh: {
      label: '中文',
      lang: 'zh',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '在线演示', link: 'https://lkrcharon.github.io/patch-mark/' },
          { text: '指南', link: '/zh/guide/getting-started' },
          { text: 'API', link: '/zh/api/annotation' },
          { text: 'npm', link: 'https://www.npmjs.com/package/patch-mark' },
        ],
      },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LKRCharon/patch-mark' },
    ],
    nav: [
      { text: 'Live demo', link: 'https://lkrcharon.github.io/patch-mark/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/annotation' },
      { text: 'npm', link: 'https://www.npmjs.com/package/patch-mark' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Store adapter & REST contract', link: '/guide/store' },
            { text: 'Access control', link: '/guide/access-control' },
            { text: 'Framework integration', link: '/guide/frameworks' },
            { text: 'Workflow', link: '/guide/workflow' },
          ],
        },
        {
          text: 'API',
          items: [
            { text: 'Annotation model', link: '/api/annotation' },
            { text: 'Properties', link: '/api/properties' },
            { text: 'Labels', link: '/api/labels' },
          ],
        },
      ],
      '/zh/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/zh/guide/getting-started' },
            { text: '主题', link: '/zh/guide/theming' },
            { text: 'Store 适配器与 REST 契约', link: '/zh/guide/store' },
            { text: '访问控制', link: '/zh/guide/access-control' },
            { text: '框架集成', link: '/zh/guide/frameworks' },
            { text: '工作流', link: '/zh/guide/workflow' },
          ],
        },
        {
          text: 'API',
          items: [
            { text: '批注数据模型', link: '/zh/api/annotation' },
            { text: '属性', link: '/zh/api/properties' },
            { text: '标签', link: '/zh/api/labels' },
          ],
        },
      ],
    },
    footer: {
      message: 'MIT Licensed',
      copyright: 'patch-mark',
    },
    search: {
      provider: 'local',
    },
  },
});
