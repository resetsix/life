---
title: docs
createTime: 2026/01/11 15:04:40
permalink: /flutter/docs/
---

# Flutter 社区实践

## 技术栈

| **模块** | 库 | 作用 |
| --- | --- | --- |
| **状态管理✓** | [flutter_riverpod](https://pub.dev/packages/flutter_riverpod) + [riverpod_annotation](https://pub.dev/packages/riverpod_annotation)（代码生成器） | 全局状态管理 |
| **网络请求✓** | [dio](https://pub.dev/packages/dio) | HTTP 和 Stream 请求与响应 |
| **路由管理✓** | [go_router](https://pub.dev/packages/go_router) + [go_router_builder](https://pub.dev/packages/go_router_builder)（代码生成器） | 页面跳转与深链接 |
| **Markdown** | [gpt_markdown](https://pub.dev/packages/gpt_markdown) 或 [markdown_widget](https://pub.dev/packages/markdown_widget) | 渲染 AI 返回的文本 |
| **本地存储✓** | [shared_preferences](https://pub.dev/packages/shared_preferences)（存简单配置） + [flutter_secure_storage](https://pub.dev/packages/flutter_secure_storage)(存token) | 存 配置/token |
| **图片预览** | [photo_view](https://pub.dev/packages/photo_view) | 图片预览 |
| **图片选择✓** | [image_picker](https://pub.dev/packages/image_picker) | 调用相册/相机 |
| **文件选择✓** | [file_picker](https://pub.dev/packages/file_picker) | 上传文件 |
| 图片/视频上传(WeChat) | [wechat_assets_picker](https://pub.dev/packages/wechat_assets_picker) | 微信风格上传组件 |
| **图片压缩** | [flutter_image_compress](https://pub.dev/packages/flutter_image_compress) | 压缩与格式转换 |
| **图片缓存✓** | [cached_network_image](https://pub.dev/packages/cached_network_image) | 网络图片缓存显示 |
| **视频播放** | [video_player](https://pub.dev/packages/video_player) 或 [chewie](https://pub.dev/packages/chewie) | 视频预览 |
| **内购订阅** | [in_app_purchase](https://pub.dev/packages/in_app_purchase) | 调用原生内购 |
| **设备信息✓** | [device_info_plus](https://pub.dev/packages/device_info_plus) | 获取唯一标识 |
| **权限管理✓** | [permission_handler](https://pub.dev/packages/permission_handler) | 请求相册/麦克风权限 |
| **应用图标✓** | [flutter_launcher_icons](https://pub.dev/packages/flutter_launcher_icons) | 应用图标 |
| **启动页** | [flutter_native_splash](https://pub.dev/packages/flutter_native_splash) | 启动页 |
| **介绍页** | [introduction_screen](https://pub.dev/packages/introduction_screen) | 介绍页 |
| **刷新✓** | [easy_refresh](https://pub.dev/packages/easy_refresh) | 下拉刷新和滚动加载指示器 |
| **Toast✓** | [fluttertoast](https://pub.dev/packages/fluttertoast) | 操作通知 |
| **DTO 生成器✓** | [freezed](https://pub.dev/packages/freezed) | 代码生成器 |
| **序列化/反序列化✓** | [json_serializable](https://pub.dev/packages/json_serializable) | Json 处理工具 |
| **TTS** | [flutter_tts](https://pub.dev/packages/flutter_tts) | 文本转语音 |
| **STT** | [speech_to_text](https://pub.dev/packages/speech_to_text) | 语音转文本 |
| **WebRTC** | [flutter_webrtc](https://pub.dev/packages/flutter_webrtc) | 实时通话 |
| **庆祝动画** | [flutter_confetti](https://cj0x39e.github.io/flutter_confetti/) | 订阅成功展示 |
| **apple 登录** | [sign_in_with_apple](https://pub.dev/packages/sign_in_with_apple) |  |
| **用户分析** | [firebase_analytics](https://pub.dev/packages/firebase_analytics) |  |
| **崩溃报告** | [sentry_flutter](https://pub.dev/packages/sentry_flutter) |  |
| **骨架屏** | [skeletonizer](https://pub.dev/packages/skeletonizer) |  |
| **动态长度文本** | [readmore](https://pub.dev/packages/readmore) |  |
| **系统评级** | [in_app_review](https://pub.dev/packages/in_app_review) |  |
| **液态玻璃** | [liquid_glass_renderer](https://pub.dev/packages/liquid_glass_renderer) |  |
| **模糊时间戳** | [timeago](https://pub.dev/packages/timeago) | 例如“ 15 分钟前” |
| **时间线** | [timelines_plus](https://pub.dev/packages/timelines_plus) |  |
| **进度条** | [percent_indicator](https://pub.dev/packages/percent_indicator) |  |
| **Webview** | [webview_flutter](https://pub.dev/packages/webview_flutter) 或 [flutter_inappwebview](https://pub.dev/packages/flutter_inappwebview) |  |
| **全屏 loading** | [flutter_easyloading](https://pub.dev/packages/flutter_easyloading) |  |
| **剪贴板** | [super_clipboard](https://pub-web.flutter-io.cn/packages/super_clipboard) |  |
| **图片/文件保存** | [gal](https://pub.dev/packages/gal) |  |
| **分享** | [share_plus](https://pub-web.flutter-io.cn/packages/share_plus) |  |
| **尺寸适配** | [flutter_screenutil](https://pub.dev/packages/flutter_screenutil) |  |
| **响应式布局** | [responsive_builder](https://pub.dev/packages/responsive_builder) 或 [responsive_framework](https://pub.dev/packages/responsive_framework) |  |
| **主题适配** | [adaptive_theme](https://pub.dev/packages/adaptive_theme) |  |
| **音频水波** | [wave_blob](https://pub.dev/packages/wave_blob) |  |
| **图标处理** | [flutter_svg](https://pub.dev/packages/flutter_svg) |  |
| **图表**📊 | [fl_chart](https://pub.dev/packages/fl_chart)、[graphic](https://pub.dev/packages/graphic)、[syncfusion_flutter_charts](https://pub.dev/packages/syncfusion_flutter_charts)、[k_chart_plus](https://pub.dev/packages/k_chart_plus) |  |
| 资源路经处理 | [flutter_gen](https://pub.dev/packages/flutter_gen) | 静态资源路经硬编码处理方案 |

---

- 自定义相机：[**camerawesome**](https://pub.dev/packages/camerawesome)
- 官方 flutter_markdown [已停止维护](https://github.com/flutter/packages/tree/860ecdea6c8d7ee36021cf79e7c332982b050060/packages/flutter_markdown#discontinued)
- flutter_gen 补充如下

```bash
flutter pub add flutter_gen
flutter pub add dev:flutter_gen_runner
```

```yaml
dev_dependencies:
  flutter_gen_runner: any
  build_runner: any

flutter_gen:
  output: lib/generated/ # 生成代码存放位置
  integrations:
    flutter_svg: true # 如果使用了 flutter_svg
```

## 目录结构 

(Feature-First 架构)

不要按层级分（pages/widgets），要按**业务功能**分。这是大型 Flutter 项目的标准。

```
lib/
├── main.dart                  # 应用入口 (ProviderScope)
├── app.dart                   # MaterialApp, Theme, GoRouter 配置
├── core/                      # 全局通用模块
│   ├── constants/             # API Key, URL, Enum
│   ├── theme/                 # AppTheme (颜色, 字体)
│   ├── network/               # Dio Client 封装 (拦截器, Token注入)
│   ├── utils/                 # 通用工具 (DateFormatter, ImageCompressor)
│   └── router/                # 路由定义 (GoRouter)
├── features/                  # 业务模块 (Feature-First)
│   ├── chat/                  # AI 对话模块
│   │   ├── models/            # ChatMessage (含 role, isStreaming)
│   │   ├── providers/         # ChatController (Riverpod, SSE逻辑)
│   │   ├── repositories/      # API 调用层 (Dio 请求)
│   │   └── ui/                # ChatScreen, ChatBubble, MarkdownWidget
│   ├── creation/              # 图片/视频生成模块
│   │   ├── providers/
│   │   └── ui/
│   └── settings/              # 设置与内购模块
│       ├── providers/         # RevenueCat 逻辑
│       └── ui/                # Paywall (付费墙), Profile
└── l10n/                      # (可选) 国际化文件

```

---

补充：

- 解决静态资源硬编码问题：flutter_gen
- 代码生成器：json_serializable + freezed

---
