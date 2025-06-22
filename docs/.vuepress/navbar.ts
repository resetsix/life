import { defineNavbarConfig } from 'vuepress-theme-plume';

export const zhNavbar = defineNavbarConfig([
  {
    text: '首页',
    icon: 'flat-color-icons:home',
    link: '/'
  },
  {
    text: '博客',
    icon: 'twemoji:memo',
    link: '/blog/'
  },
  {
    text: '技术笔记',
    icon: 'flat-color-icons:document',
    items: [
      {
        text: '前端开发',
        items: [
          { text: 'React 实践 (TODO)', link: '/notes/frontend/react/' },
          { text: 'TypeScript 指南 (TODO)', link: '/notes/frontend/typescript/' },
        ]
      },
      {
        text: '移动开发',
        items: [
          { text: 'iOS 开发 (TODO)', link: '/notes/mobile/ios/' },
          { text: 'Swift 语言 (TODO)', link: '/notes/mobile/swift/' },
          { text: 'SwiftUI 实践 (TODO)', link: '/notes/mobile/swiftui/' },
        ]
      },
      {
        text: '状态管理',
        items: [
          { text: 'Zustand 完整指南', link: '/zustand/' },
        ]
      },
      {
        text: '工具与环境',
        items: [
          { text: 'Node.js 配置 (TODO)', link: '/notes/tools/nodejs/' },
          { text: '开发工具 (TODO)', link: '/notes/tools/dev-tools/' },
          { text: '效率提升 (TODO)', link: '/notes/tools/productivity/' },
        ]
      }
    ]
  },
  {
    text: '生活记录',
    icon: 'twemoji:sparkles',
    items: [
      { text: '日常随笔 (TODO)', link: '/life/daily/' },
      { text: '美食记录 (TODO)', link: '/life/food/' },
      { text: '运动健身 (TODO)', link: '/life/fitness/' },
      { text: '旅行见闻 (TODO)', link: '/life/travel/' },
    ]
  },
  {
    text: '发现',
    icon: 'flat-color-icons:search',
    items: [
      { text: '文章归档', link: '/blog/archives/' },
      { text: '标签云', link: '/blog/tags/' },
      { text: '分类浏览', link: '/blog/categories/' },
      // { text: '时间线', link: '/blog/timeline/' },
    ]
  },
  {
    text: '关于',
    icon: 'fluent-emoji:love-you-gesture',
    link: '/about/'
  },
  {
    text: '友链',
    icon: 'noto:people-wrestling',
    link: '/friends/',
  },
]);

export const enNavbar = defineNavbarConfig([
  {
    text: 'Home',
    icon: 'flat-color-icons:home',
    link: '/en/'
  },
  {
    text: 'Blog',
    icon: 'twemoji:memo',
    link: '/en/blog/'
  },
  {
    text: 'Tech Notes',
    icon: 'flat-color-icons:document',
    items: [
      {
        text: 'Frontend',
        items: [
          { text: 'React Practice', link: '/en/notes/frontend/react/' },
          { text: 'TypeScript Guide', link: '/en/notes/frontend/typescript/' },
          { text: 'Vue.js Notes', link: '/en/notes/frontend/vue/' },
        ]
      },
      {
        text: 'Mobile',
        items: [
          { text: 'iOS Development', link: '/en/notes/mobile/ios/' },
          { text: 'Swift Language', link: '/en/notes/mobile/swift/' },
          { text: 'SwiftUI Practice', link: '/en/notes/mobile/swiftui/' },
        ]
      },
      {
        text: 'State Management',
        items: [
          { text: 'Zustand Guide', link: '/en/zustand/' },
          { text: 'Redux Practice', link: '/en/notes/state/redux/' },
        ]
      }
    ]
  },
  {
    text: 'Life',
    icon: 'twemoji:sparkles',
    items: [
      { text: 'Daily Notes', link: '/en/life/daily/' },
      { text: 'Food Records', link: '/en/life/food/' },
      { text: 'Fitness', link: '/en/life/fitness/' },
      { text: 'Travel', link: '/en/life/travel/' },
    ]
  },
  {
    text: 'Discover',
    icon: 'flat-color-icons:search',
    items: [
      { text: 'Archives', link: '/en/blog/archives/' },
      { text: 'Tags', link: '/en/blog/tags/' },
      { text: 'Categories', link: '/en/blog/categories/' },
      { text: 'Timeline', link: '/en/blog/timeline/' },
    ]
  },
  {
    text: 'About',
    icon: 'fluent-emoji:love-you-gesture',
    link: '/en/about/'
  },
  {
    text: 'Friends',
    icon: 'noto:people-wrestling',
    link: '/en/friends/',
  },
]);
