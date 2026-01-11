import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume';

/* =================== locale: zh-CN ======================= */

const zhIosNote = defineNoteConfig({
  dir: 'ios',
  link: '/ios/',
  sidebar: [
    {
      text: 'Apple 原生开发',
      collapsed: false,
      items: [
        { text: '目录', link: '/ios/' },
        { text: '参考手册', link: '/ios/docs/' },
        { text: 'Xcode', link: '/ios/xcode/' },
        { text: 'Skills', link: '/ios/skills/' },
        { text: 'SwiftUI 组件指南', link: '/ios/swiftui-components/' },
        { text: 'SwiftUI 导航指南', link: '/ios/swiftui-navigation/' },
        { text: 'SwiftUI 修饰符指南', link: '/ios/swiftui-modifier/' },
        { text: 'FAQ', link: '/ios/faq/' },
      ],
    },
  ],
});

const zhFlutterNote = defineNoteConfig({
  dir: 'flutter',
  link: '/flutter/',
  sidebar: [
    {
      text: 'Flutter 开发',
      collapsed: false,
      items: [
        { text: '目录', link: '/flutter/' },
        { text: '参考手册', link: '/flutter/docs/' },
        { text: 'FAQ', link: '/flutter/faq/' },
      ],
    },
  ],
});

const zhQuickLookNote = defineNoteConfig({
  dir: 'quicklook',
  link: '/quicklook/',
  sidebar: [
    {
      text: '小记速查',
      collapsed: false,
      items: [
        { text: '目录', link: '/quicklook/' },
        { text: 'Git', link: '/quicklook/80kzn14y/' },
        { text: 'Npm', link: '/quicklook/unh3a5ug/' },
        { text: 'Nodejs', link: '/quicklook/j7z98t3n/' },
        { text: 'MacOS', link: '/quicklook/drbtzl4l/' },
        { text: 'Cursor', link: '/quicklook/j19svoqk/' },
        { text: '移除 Figma 图片透明度', link: '/quicklook/v8c4l10g/' },
      ],
    },
  ],
});

const zhKeepNote = defineNoteConfig({
  dir: 'keep',
  link: '/keep/',
  sidebar: [
    {
      // text: '记录',
      // collapsed: true,
      items: [{ text: '记录', link: '/notes/keep/' }],
    },
  ],
});

const zhMoviesNote = defineNoteConfig({
  dir: 'watch',
  link: '/watch/',
  sidebar: [
    {
      items: [
        { text: '目录', link: '/watch/' },
        { text: '书籍 📚', link: '/watch/book/' },
        { text: '电影 🍿', link: '/watch/movies/' },
        { text: '韩剧 🍜', link: '/watch/kdrama/' },
      ],
    },
  ],
});

const zustandNote = defineNoteConfig({
  dir: 'zustand',
  link: '/zustand/',
  sidebar: [
    {
      text: '入门指南',
      collapsed: false,
      items: [
        { text: '介绍', link: '/notes/zustand/getting-started/introduction' },
        { text: '对比', link: '/notes/zustand/getting-started/comparison' },
      ],
    },
    {
      text: 'API 文档',
      collapsed: false,
      items: [
        { text: 'create', link: '/notes/zustand/apis/create' },
        { text: 'createStore', link: '/notes/zustand/apis/create-store' },
        {
          text: 'createWithEqualityFn',
          link: '/notes/zustand/apis/create-with-equality-fn',
        },
        { text: 'shallow', link: '/notes/zustand/apis/shallow' },
      ],
    },
    {
      text: '使用指南',
      collapsed: false,
      items: [
        { text: 'TypeScript', link: '/notes/zustand/guides/typescript' },
        { text: '更新状态', link: '/notes/zustand/guides/updating-state' },
        {
          text: '不可变状态与合并',
          link: '/notes/zustand/guides/immutable-state-and-merging',
        },
        {
          text: '如何重置状态',
          link: '/notes/zustand/guides/how-to-reset-state',
        },
        { text: '切片模式', link: '/notes/zustand/guides/slices-pattern' },
        {
          text: '自动生成选择器',
          link: '/notes/zustand/guides/auto-generating-selectors',
        },
        {
          text: '使用 useShallow 防止重渲染',
          link: '/notes/zustand/guides/prevent-rerenders-with-use-shallow',
        },
        {
          text: 'Flux 风格实践',
          link: '/notes/zustand/guides/flux-inspired-practice',
        },
        {
          text: '无 Store Actions 实践',
          link: '/notes/zustand/guides/practice-with-no-store-actions',
        },
        {
          text: '使用 Props 初始化状态',
          link: '/notes/zustand/guides/initialize-state-with-props',
        },
        {
          text: 'Maps 和 Sets 使用',
          link: '/notes/zustand/guides/maps-and-sets-usage',
        },
        { text: '测试', link: '/notes/zustand/guides/testing' },
        { text: 'Next.js', link: '/notes/zustand/guides/nextjs' },
        { text: 'SSR 和水合', link: '/notes/zustand/guides/ssr-and-hydration' },
        {
          text: '连接到 URL Hash 状态',
          link: '/notes/zustand/guides/connect-to-state-with-url-hash',
        },
        {
          text: 'React 18 前的事件处理',
          link: '/notes/zustand/guides/event-handler-in-pre-react-18',
        },
        {
          text: '井字棋教程',
          link: '/notes/zustand/guides/tutorial-tic-tac-toe',
        },
      ],
    },
    {
      text: 'Hooks',
      collapsed: false,
      items: [
        { text: 'useStore', link: '/notes/zustand/hooks/use-store' },
        {
          text: 'useStoreWithEqualityFn',
          link: '/notes/zustand/hooks/use-store-with-equality-fn',
        },
        { text: 'useShallow', link: '/notes/zustand/hooks/use-shallow' },
      ],
    },
    {
      text: '中间件',
      collapsed: false,
      items: [
        { text: 'persist', link: '/notes/zustand/middlewares/persist' },
        { text: 'immer', link: '/notes/zustand/middlewares/immer' },
        { text: 'devtools', link: '/notes/zustand/middlewares/devtools' },
        { text: 'redux', link: '/notes/zustand/middlewares/redux' },
        { text: 'combine', link: '/notes/zustand/middlewares/combine' },
        {
          text: 'subscribeWithSelector',
          link: '/notes/zustand/middlewares/subscribe-with-selector',
        },
      ],
    },
    {
      text: '集成',
      collapsed: false,
      items: [
        {
          text: '持久化存储数据',
          link: '/notes/zustand/integrations/persisting-store-data',
        },
        {
          text: 'Immer 中间件',
          link: '/notes/zustand/integrations/immer-middleware',
        },
        {
          text: '第三方库',
          link: '/notes/zustand/integrations/third-party-libraries',
        },
      ],
    },
    {
      text: '迁移指南',
      collapsed: true,
      items: [
        {
          text: '迁移到 v5',
          link: '/notes/zustand/migrations/migrating-to-v5',
        },
        {
          text: '迁移到 v4',
          link: '/notes/zustand/migrations/migrating-to-v4',
        },
      ],
    },
    {
      text: '历史版本',
      collapsed: true,
      items: [
        {
          text: 'Zustand v3 createContext',
          link: '/notes/zustand/previous-versions/zustand-v3-create-context',
        },
      ],
    },
  ],
});

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    zhIosNote,
    zhFlutterNote,
    zhKeepNote,
    zhMoviesNote,
    zhQuickLookNote,
    zustandNote,
  ],
});

/* =================== locale: en-US ======================= */

const enDemoNote = defineNoteConfig({
  dir: 'ios',
  link: '/ios',
  sidebar: ['', 'Swift', 'SwiftUI'],
});

export const enNotes = defineNotesConfig({
  dir: 'en/notes',
  link: '/en/',
  notes: [enDemoNote],
});
