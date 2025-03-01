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
    { icon: 'bilibili', link: 'https://space.bilibili.com/1542057315' },
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
      `© ${new Date().getFullYear()} zzw · Made with ❤️`,
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
