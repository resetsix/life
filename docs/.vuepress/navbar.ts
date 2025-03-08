import { defineNavbarConfig } from 'vuepress-theme-plume';

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '目录', link: '/blog/archives/' },
  { text: '标签', link: '/blog/tags/' },
  {
    text: '更多',
    items: [{ text: 'iOS开发', link: '/notes/ios/index.md' }],
  },
]);

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  { text: 'Blog', link: '/en/blog/' },
  { text: 'Archives', link: '/en/blog/archives/' },
  { text: 'Tags', link: '/en/blog/tags/' },
  {
    text: 'Notes',
    items: [{ text: 'iOS', link: '/en/notes/ios/index.md' }],
  },
]);
