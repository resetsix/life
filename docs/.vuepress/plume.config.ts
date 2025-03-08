import { defineThemeConfig } from 'vuepress-theme-plume';
import { enNavbar, zhNavbar } from './navbar';
import { enNotes, zhNotes } from './notes';

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'https://resetsix.netlify.app/head/cat.webp',

  appearance: true, // 配置 深色模式

  social: [
    { icon: 'github', link: 'https://github.com/resetsix' },
    {
      icon: {
        name: 'bilibili',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="currentColor" d="M488.6 104.1c16.7 18.1 24.4 39.7 23.3 65.7v202.4c-.4 26.4-9.2 48.1-26.5 65.1c-17.2 17-39.1 25.9-65.5 26.7H92.02c-26.45-.8-48.21-9.8-65.28-27.2C9.682 419.4.767 396.5 0 368.2V169.8c.767-26 9.682-47.6 26.74-65.7C43.81 87.75 65.57 78.77 92.02 78h29.38L96.05 52.19c-5.75-5.73-8.63-13-8.63-21.79c0-8.8 2.88-16.06 8.63-21.797C101.8 2.868 109.1 0 117.9 0q13.2 0 21.9 8.603L213.1 78h88l74.5-69.397C381.7 2.868 389.2 0 398 0q13.2 0 21.9 8.603c5.7 5.737 8.6 12.997 8.6 21.797c0 8.79-2.9 16.06-8.6 21.79L394.6 78h29.3c26.4.77 48 9.75 64.7 26.1m-38.8 69.7c-.4-9.6-3.7-17.4-10.7-23.5c-5.2-6.1-14-9.4-22.7-9.8H96.05c-9.59.4-17.45 3.7-23.58 9.8c-6.14 6.1-9.4 13.9-9.78 23.5v194.4c0 9.2 3.26 17 9.78 23.5s14.38 9.8 23.58 9.8H416.4c9.2 0 17-3.3 23.3-9.8s9.7-14.3 10.1-23.5zm-264.3 42.7c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2c-6.2 6.3-14 9.5-23.6 9.5s-17.5-3.2-23.6-9.5s-9.4-14-9.8-23.2v-33.3c.4-9.1 3.8-16.9 10.1-23.2s13.2-9.6 23.3-10c9.2.4 17 3.7 23.3 10m191.5 0c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2s-14 9.5-23.6 9.5s-17.4-3.2-23.6-9.5c-7-6.3-9.4-14-9.7-23.2v-33.3c.3-9.1 3.7-16.9 10-23.2s14.1-9.6 23.3-10c9.2.4 17 3.7 23.3 10"/></svg>',
      },
      link: 'https://space.bilibili.com/1542057315',
    },
    {
      icon: {
        name: 'LinuxDo',
        svg: '<svg width="512" height="512" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><clipPath id="a"><circle cx="60" cy="60" r="47"/></clipPath><circle fill="#f0f0f0" cx="60" cy="60" r="50"/><rect fill="#1c1c1e" clip-path="url(#a)" x="10" y="10" width="100" height="30"/><rect fill="#f0f0f0" clip-path="url(#a)" x="10" y="40" width="100" height="40"/><rect fill="#ffb003" clip-path="url(#a)" x="10" y="80" width="100" height="30"/></svg>',
      },
      link: 'https://linux.do/u/resetsix/summary',
    },
    {
      icon: {
        name: 'Gmail',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm3.519 0L12 11.671L18.481 6zM20 7.329l-7.341 6.424a1 1 0 0 1-1.318 0L4 7.329V18h16z"/></svg>',
      },
      link: 'mailto:resetsix223@gmail.com',
    },
    {
      icon: {
        name: 'qq',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path fill="currentColor" d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112C331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3c-34 109.5-23 154.8-14.6 155.8c18 2.2 70.1-82.4 70.1-82.4c0 49 25.2 112.9 79.8 159c-26.4 8.1-85.7 29.9-71.6 53.8c11.4 19.3 196.2 12.3 249.5 6.3c53.3 6 238.1 13 249.5-6.3c14.1-23.8-45.3-45.7-71.6-53.8c54.6-46.2 79.8-110.1 79.8-159c0 0 52.1 84.6 70.1 82.4c8.5-1.1 19.5-46.4-14.5-155.8"/></svg>',
      },
      link: 'https://qm.qq.com/q/Aunc2Pi4GA',
    },
    { icon: 'juejin', link: 'https://juejin.cn/user/1042816744822648' },
  ],
  navbarSocialInclude: ['github'], // 允许显示在导航栏的 social 社交链接
  aside: true, // 页内侧边栏， 默认显示在右侧
  outline: [2, 3], // 页内大纲， 默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/
   */
  // copyright: true,

  prevPage: true, // 是否启用上一页链接
  nextPage: true, // 是否启用下一页链接
  createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  footer: {
    message:
      // 'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
      `© ${new Date().getFullYear()} · Made By <a href="https://github.com/resetsix">Zzw</a> with <a target="_blank" href="https://theme-plume.vuejs.press/guide/intro">Plume</a> ❤️`,
    copyright: '',
  },

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/basic/#transition */
  // transition: {
  //   page: true, // 启用 页面间跳转过渡动画
  //   postList: true, // 启用 博客文章列表过渡动画
  //   appearance: 'fade', // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  // },

  locales: {
    '/': {
      /**
       * @see https://theme-plume.vuejs.press/config/basic/#profile
       */
      profile: {
        avatar: 'https://resetsix.netlify.app/head/cat.webp',
        name: '一闪一闪亮晶晶',
        description: '生活志 / 技术记录 / 数字花园',
        circle: true,
        location: 'Chengdu, China',
        // organization: '2',
      },

      navbar: zhNavbar,
      notes: zhNotes,

      /**
       * 公告板
       * @see https://theme-plume.vuejs.press/guide/features/bulletin/
       */
      // bulletin: {
      //   layout: 'top-right',
      //   contentType: 'markdown',
      //   title: '公告',
      //   content: '内容',
      // },
    },
    '/en/': {
      /**
       * @see https://theme-plume.vuejs.press/config/basic/#profile
       */
      profile: {
        avatar: 'https://resetsix.netlify.app/head/cat.webp',
        name: '一闪一闪亮晶晶',
        description: '一闪一闪亮晶晶的生活志',
        // circle: true,
        // location: '',
        // organization: '',
      },

      navbar: enNavbar,
      notes: enNotes,

      /**
       * 公告板
       * @see https://theme-plume.vuejs.press/guide/features/bulletin/
       */
      // bulletin: {
      //   layout: 'top-right',
      //   contentType: 'markdown',
      //   title: '',
      //   content: '',
      // },
    },
  },
});
