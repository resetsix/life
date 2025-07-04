import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from 'vuepress';
import { plumeTheme } from 'vuepress-theme-plume';

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  locales: {
    '/': {
      title: '周正纬',
      lang: 'zh-CN',
      description: '周正纬',
    },
    '/en/': {
      title: "Zhengwei Zhou's Life Ambition",
      lang: 'en-US',
      description: "Zhengwei Zhou's Life Ambition",
    },
  },

  head: [
    // 配置站点图标
    // [
    //   'link',
    //   {
    //     rel: 'icon',
    //     type: 'image/png',
    //     href: '/images/head/avatar.png', // https://resetsix.netlify.app/head/avatar.png
    //   },
    // ],
    // Google Search Console 验证
    [
      'meta',
      {
        name: 'google-site-verification',
        content: '97xDmDkaVoU791xLjVbsbfZAqovoSpEzH9nId2i9r3U',
      },
    ],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false, // 站点较大，页面数量较多时，不建议启用

  theme: plumeTheme({
    /* 添加您的部署域名, 有助于 SEO, 生成 sitemap */
    hostname: 'https://resetsix.netlify.app',

    markdown: {
      chat: true,
    },

    /* 文档仓库配置，用于 editLink */
    // docsRepo: '',
    // docsDir: 'docs',
    // docsBranch: '',

    /* 页内信息 */
    // editLink: true,
    // lastUpdated: true,
    // contributors: true,
    changelog: true,

    /**
     * 博客
     * @see https://theme-plume.vuejs.press/config/basic/#blog
     */
    // blog: false, // 禁用博客
    // blog: {
    //   postList: true, // 是否启用文章列表页
    //   tags: true, // 是否启用标签页
    //   archives: true, // 是否启用归档页
    //   categories: true, // 是否启用分类页
    //   postCover: 'right', // 文章封面位置
    //   pagination: 15, // 每页显示文章数量
    // },

    /* 博客文章页面链接前缀 */
    article: '/article/',

    /**
     * 编译缓存，加快编译速度
     * @see https://theme-plume.vuejs.press/config/basic/#cache
     */
    cache: 'filesystem',

    /**
     * 为 markdown 文件自动添加 frontmatter 配置
     * @see https://theme-plume.vuejs.press/config/basic/#autofrontmatter
     */
    // autoFrontmatter: {
    //   permalink: true,  // 是否生成永久链接
    //   createTime: true, // 是否生成创建时间
    //   title: true,      // 是否生成标题
    // },

    plugins: {
      /**
       * Shiki 代码高亮
       * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
       */
      shiki: {
        // 强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
        // 从 1.0.0-rc.136 版本开始, languages 配置变更为 langs 选项。无需再手动添加你所使用的语言，插件将会自动识别并按需加载语言包。
        // https://theme-plume.vuejs.press/guide/code/intro/#%E6%A6%82%E8%BF%B0
        // langs: [
        //   'shell',
        //   'bash',
        //   'typescript',
        //   'javascript',
        //   'swift',
        //   'html',
        //   'css',
        //   'json',
        // ],
        twoslash: true, // 启用 twoslash
        // whitespace: true, // 启用 空格/Tab 高亮
        lineNumbers: true, // 启用行号
      },

      /* 本地搜索, 默认启用 */
      // search: true,

      /**
       * Algolia DocSearch
       * 启用此搜索需要将 本地搜索 search 设置为 false
       * @see https://theme-plume.vuejs.press/config/plugins/search/#algolia-docsearch
       */
      // docsearch: {
      //   appId: '',
      //   apiKey: '',
      //   indexName: '',
      // },

      /* 文章字数统计、阅读时间，设置为 false 则禁用 */
      // readingTime: true,

      /**
       * markdown enhance
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-enhance/
       */
      // markdownEnhance: {
      //   chartjs: true,
      //   echarts: true,
      //   mermaid: true,
      //   flowchart: true,
      // },

      /**
       *  markdown power
       * @see https://theme-plume.vuejs.press/config/plugin/markdown-power/
       */
      markdownPower: {
        abbr: true, // 启用缩写词
        pdf: true, // 启用 PDF 嵌入 @[pdf](/xxx.pdf)
        caniuse: true, // 启用 caniuse 语法  @[caniuse](feature_name)
        plot: true, // 启用隐秘文本语法 !!xxxx!!
        bilibili: true, // 启用嵌入 bilibili视频 语法 @[bilibili](bid)
        youtube: true, // 启用嵌入 youtube视频 语法 @[youtube](video_id)
        // artPlayer: true, // 启用嵌入 artPlayer 本地视频 语法 @[artPlayer](url)
        audioReader: true, // 启用嵌入音频朗读功能 语法 @[audioReader](url)
        icons: true, // 启用内置图标语法  :[icon-name]:
        codepen: true, // 启用嵌入 codepen 语法 @[codepen](user/slash)
        replit: true, // 启用嵌入 replit 语法 @[replit](user/repl-name)
        codeSandbox: true, // 启用嵌入 codeSandbox 语法 @[codeSandbox](id)
        jsfiddle: true, // 启用嵌入 jsfiddle 语法 @[jsfiddle](user/id)
        npmTo: true, // 启用 npm-to 容器  ::: npm-to
        demo: true, // 启用 demo 容器  ::: demo
        repl: {
          // 启用 代码演示容器
          go: true, // ::: go-repl
          rust: true, // ::: rust-repl
          kotlin: true, // ::: kotlin-repl
        },
        imageSize: 'local', // 启用 自动填充 图片宽高属性，避免页面抖动
      },

      /**
       * 在 Markdown 文件中导入其他 markdown 文件内容。
       * @see https://theme-plume.vuejs.press/guide/markdown/include/
       */
      markdownInclude: true,

      /**
       * Markdown 数学公式
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-math/
       */
      markdownMath: {
        type: 'katex',
      },

      /**
       * 水印
       * @see https://theme-plume.vuejs.press/guide/features/watermark/
       */
      // watermark: true,

      /**
       * 评论 comments
       * @see https://theme-plume.vuejs.press/guide/features/comments/
       */
      comment: {
        provider: 'Twikoo', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
        comment: true,
        envId: 'https://prismatic-khapse-f13765.netlify.app/.netlify/functions/twikoo', // 默认域名。 https://netfily.resetsix.cn/.netlify/functions/twikoo 是自定义域名版本，域名有可能会过期
        // repo: '',
        // repoId: '',
        // category: '',
        // categoryId: '',
        // mapping: 'pathname',
        // reactionsEnabled: true,
        // inputPosition: 'top',
      },
    },

    /**
     * 加密功能
     * @see https://theme-plume.vuejs.press/guide/features/encryption/
     */
    // encrypt: {},
  }),
});
