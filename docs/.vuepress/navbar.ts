import { defineNavbarConfig } from 'vuepress-theme-plume';

export const zhNavbar = defineNavbarConfig([
  { text: '首页', icon: 'flat-color-icons:home', link: '/' },
  { text: '博客', icon: 'twemoji:memo', link: '/blog/' },
  { text: '目录', icon: 'flat-color-icons:folder', link: '/blog/archives/' },
  { text: '标签', icon: 'icon-park:tag-one', link: '/blog/tags/' },
  { text: 'Zustand', icon: 'mdi:state-machine', link: '/zustand/' },
  // { text: 'iOS', icon: 'logos:apple', link: '/ios/' },
  // { text: '关于', icon: 'fluent-emoji:love-you-gesture', link: '/about/' },
  {
    text: '更多',
    icon: 'icon-park:more-two',
    items: [
      {
        text: '关于我',
        icon: 'fluent-emoji:love-you-gesture',
        link: '/about/',
      },
      {
        text: '友情链接',
        icon: 'noto:people-wrestling',
        link: '/friends/',
      },
    ],
  },
]);

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  { text: 'Blog', link: '/en/blog/' },
  { text: 'Archives', link: '/en/blog/archives/' },
  { text: 'Tags', link: '/en/blog/tags/' },
  {
    text: 'More',
    items: [{ text: 'Friends', link: '/en/friends/' }],
  },
]);
