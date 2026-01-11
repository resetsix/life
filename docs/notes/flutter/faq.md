---
title: 常见问题
createTime: 2026/01/11 15:07:07
permalink: /flutter/faq/
---

### 如何声明一个对象？

### 如何声明嵌套数组和对象数组？

### 数组有哪些属性与方法？

- `add` 、`addAll` 、`remove`、`removeLast`、`removeRange(start,end)` …
- `generate`

### Map有哪些属性与方法？

### 函数声明有哪些要求

- 支持自动类型推断`dynamic`，但推荐显式声明返回值类型（可使用 `void`）。
- 必需参数，可选位置参数[]，可选命名参数{}。
- 推荐使用`默认值`替代`?` ，能避免 null 值和对应判断逻辑。
- 箭头函数要注意，只能返回单行代码逻辑且可省略`return`关键字，不能返回`{}` 。

### 声明 DTO 推荐

- 添加`final` 关键字。
- 不在声明字段时赋值，而是在构造函数中。
- `默认构造(同名)函数` 、`命名构造函数` 、`工厂构造函数`
- 如何声明枚举（TODO）

### 关于继承

- 子类默认不会继承父类的构造函数。

### 关于多态

- `extends`+`@override`
- `abstract`+`implements` +`@override`
- `mixin`（不支持构造函数，也不支持使用 `final`）
- `Composition` 组合

### 关于泛型

- 泛型集合、泛型方法、泛型类。

### 异步编程隐形陷阱

```dart
Future<void> safeTask() async {
	// 无需 await
  return Future.error("爆炸了！");
}

Future<void> safeTask() async {
  try {
	  // 注意，因为被 try/catch 包裹所以此处需要 await
    return await Future.error("爆炸了！");
  } catch (e) {
    print("抓到了: $e");
  }
}
```

### 定时器的使用与销毁

### 组件的生命周期

- 无状态组件：当**组件被创建或父组件状态变化**导致其需要重新构建时，`build` 方法会被调用。（唯一阶段）
- 有状态组件：创建阶段、构建与更新阶段、卸载阶段

![](/images/notes/2026/01/2026-01-11-14.png)

### 官方/社区推荐的代码生成器

- `freezed`
- **`json_serializable`**

### 元素声明顺序

- 三明治" 阅读逻辑 (可读性)。代码的阅读顺序应该符合**从外到内**的视觉逻辑：
    - Identity (我是谁): Container
    - Properties (我长什么样): width, color, decoration (相当于 CSS 样式)
    - Content (我肚子里有什么): child (具体的内容)

### 如何关闭自动闭合标签显式

- 搜索`dart closing lables` ，取消选中`Whether to show annotations against constructor...` 。

![](/images/notes/2026/01/2026-01-11-15.png)

### 屏幕适配方案

- flutter_screenutil - 类似 rem

### GestureDetector 不会响应透明区域点击事件

- 使用`HitTestBehavior.translucent`

```dart
GestureDetector(
  onTap: () { print("空白处也能点！"); },
  // ⚡️ 关键属性：让透明区域也能响应点击
  behavior: HitTestBehavior.translucent, 
  
  child: Container(
    width: 200,
    height: 200,
    // 没有设置 color，默认为透明
    child: const Center(child: Text("只有中间有字")),
  ),
)
```

### padding 调整内边距方向

- `all` 、`only(top:xx, left:xx, right:xx, bottom:xx)` 、`symmetric(vertical:xx, horizontal:xx)`

### 对齐组件

- Column、Row、Flex、Wrap

### 使用一张图片作为图片背景

- 借助 `Stack` 叠层组件和 `Positioned`组件的 `fill` 属性

```dart
Stack(
  children: [
    Positioned.fill( // 自动填满
      child: Image.asset("bg.png", fit: BoxFit.cover),
    ),
    Content(), // 前景内容
  ],
)
```

### Stack 顶层的透明区域会挡住底层的点击事件

- 解决：使用 IgnorePointer 包裹顶层不需要交互的组件，让点击事件穿透下去。

```dart
Stack(
  children: [
    ElevatedButton(onPressed: (){}, child: Text("点我")), // 底层按钮
    
    IgnorePointer( // 让这个蒙层“隐形”，不拦截点击
      child: Container(color: Colors.transparent),
    ),
  ],
)
```

## 解决数字跳动问题

- 在倒计时场景会遇到数字跳动问题。解决：使用 OpenType 的 tnum 特性（即 FontFeature.tabularFigures()）。

```dart
import 'dart:ui';

Text(
  "11:11:11", 
  style: TextStyle(
    fontSize: 30,
    // 开启等宽数字特性
    fontFeatures: [
      FontFeature.tabularFigures(),
    ],
  ),
)
```

## Text的进阶用法

- 最大行数自动省略（直接传递 `maxLines: int` 和 `overflow: TextOverflow.ellipsis`）
- 单行文本不同样式。（使用 Text.rich搭配 TextSpan）
- 解决数字跳动问题

## 请求和处理权限问题，包括异常处理重新请求

## 图片进阶

![](/images/notes/2026/01/2026-01-11-16.png)

## 滚动组件

- SingleChildScrollView、ListView.builder、ListView.separated、GridView.count、CustomScrollView

## 移除 Divider 外边距

- Divider 默认有 16.0 的 height, 线粗细为 1，上下各占 7.5。因此将 height 调整为 1 即可。如`Divider(height: 1)`

## 如何获取屏幕宽高

- 使用`MediaQuery` 媒体查询。`MediaQuery.of(context).size.width` or `MediaQuery.of(context).size.height`

## Flutter输入框如何去除下划线

```dart
TextField(
    decoration: InputDecoration(
    border: InputBorder.none, // add this line
  ),
)
```

## Text如何实现删除线样式

```dart
Text(
    style: const TextStyle(
	    decoration: TextDecoration.lineThrough,
    )
  ),
)
```

## 富文本如何实现不同样式

常见的原价 vs 优惠价示例

```dart
RichText(
  text: TextSpan(
    children: [
      TextSpan(
        text: "¥${item.price}",
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: Colors.black,
        ),
      ),
      const TextSpan(text: "  ", style: TextStyle(fontSize: 4)),
      TextSpan(
        text: "¥${(item.price * 1.2).toStringAsFixed(2)}",
        style: const TextStyle(
          fontSize: 12,
          color: Colors.grey,
          decoration: TextDecoration.lineThrough,
        ),
      ),
    ],
  ),
),
```

## 请求是异步的，但是目前请求都在 initState 中但是不可能将initState 修改为异步，该怎么解决这个问题，另外多个接口请求是不是考虑并发而不是线性单个请求

## easy_refresh 内置样式

header

- **ClassicHeader**
- **MaterialHeader**
- **CupertinoHeader**

footer

- **ClassicFooter**
- **MaterialFooter**
- **CupertinoFooter**

## 虚拟机无法使用外部硬件键盘

打开 `/Users/resetsix/.android/avd/Pixel4_ARM_API_34.avd/config.ini`

搜索`hw.mainKeys` ，将`no` 修改为`yes` ，保存后重启虚拟机。

---

## GoRouter 基础步骤

1. 新建 app_router 文件，定义路由表映射关系；添加注解（如`part 'app_router.g.dart';`），实例化 `GoRouter` 并返回其实例。
2. 该实例的`routes`数组只有`StatefulShellRoute`唯一元素，
    
    StatefulShellBranch 接收两个关键参数：
    
    `builder`：应用的最大父组件（如自定义的MainScaffold），
    
    `branches` ：数组，接收 `StatefulShellBranch` 实例（每个对应一个 Tab）
    
3. StatefulShellBranch 的 `routes` 数组参数接收`GoRoute`实例，包含`path` 、`routes` 、`builder/PageBuilder` 。

<aside>
💡

如何控制底部菜单的显隐？

定义`final _rootNavigatorKey = GlobalKey<NavigatorState>();`

给`根GoRouter` 传递 `navigatorKey: _rootNavigatorKey;`

给非 Tab 页的 GoRoute 添加`parentNavigatorKey: _rootNavigatorKey`

</aside>

路由推荐使用命名式。

## Riverpod 基础步骤

1. 在 main 入口文件为 `MyApp()` 包括 `ProviderScope` 上下文。
2. 新建 xx_provide 文件。
3. 添加注解，定义 class，继承`_$xx`，编写 part（如`part 'counter_provider.g.dart';` ），定义 state 和 action。
4. 执行`flutter pub run build_runner build --delete-conflicting-outputs`。（可将 build 替换为 watch）
5. 为消费者组件继承`ConsumerWidget` ，通过 `ref` 对象（watch 和 read 属性）来操作 state 和 action。（要注意read中需要`.notifier` 属性）。

## 在异步代码中更新UI一定要加上 mounted 判断

- 若在 async 代码块中出现 `setState` 一定要在其前加上`if (!mounted) return;` 判断。
- **口诀**：**await 之后必检查，context 之前再检查！**

```dart
onPressed: () async {
  final deviceId = await _getId();
  if (!mounted) return;
  setState(() {
    _id = deviceId;
  });
},
```

## **Android 13+ “预测性返回” (Predictive Back)警告**

- 从 Android 13 (API 33) 开始，Google 引入了一个新的交互体验。
1. 打开文件：android/app/src/main/AndroidManifest.xml
2. 找到 `<application>` 标签。
3. 添加属性：android:enableOnBackInvokedCallback="true"

```dart
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.example.hello_flutter">

  <application
    android:label="hello_flutter"
    android:name="${applicationName}"
    android:icon="@mipmap/ic_launcher"

    <!-- 添加这一行 -->
    android:enableOnBackInvokedCallback="true"> 

    <activity
      ...>
      <!-- ... -->
    </activity>
    <!-- ... -->
  </application>
</manifest>
```

## SharedPreferences 用法

- [链接](https://github.com/flutter/packages/tree/main/packages/shared_preferences/shared_preferences#sharedpreferences)

## flutter_secure_storage 用法

- [链接](https://github.com/juliansteenbakker/flutter_secure_storage/tree/develop/flutter_secure_storage#usage)。注意：官方推荐使用 flutter_secure_storage 时关闭 Android 自动备份，[详见](https://github.com/juliansteenbakker/flutter_secure_storage/tree/develop/flutter_secure_storage#disabling-auto-backup)。

## 依赖安装

```bash
flutter pub add flutter_riverpod riverpod_annotation go_router freezed_annotation json_annotation shared_preferences uuid talker_flutter talker_riverpod_logger
```

```bash
flutter pub add dev:build_runner dev:riverpod_generator dev:go_router_builder dev:freezed dev:json_serializable
```

riverpod 对应的插件和 lint

- [flutter-riverpod-snippets](https://github.com/RobertBrunhage/flutter-riverpod-snippets)
- `flutter pub add dev:custom_lint dev:riverpod_lint`

## Android 版本注意事项

- 无论 minSdkVersion 设为多少，compileSdkVersion 和 targetSdkVersion 请务必保持在 **34 (Android 14)** 或 **35 (Android 15)**，这是 Google Play 上架的强制要求，也是使用最新 permission_handler 库的前提。

```xml
android {
    // 强制要求 34 (Android 14) 或 35 (Android 15)
    compileSdkVersion 34

    defaultConfig {
        // 建议值 (对应 iOS 16+)
        minSdkVersion 26
        // 强制要求 34 或 35
        targetSdkVersion 34
    }
}
```

## 打包时权限处理注意事项

- `permission_handler` 库包含了几十种权限处理的逻辑，在编译阶段之前需要针对权限进行裁剪，只打包需要使用到的权限，否则可能会因为苹果审核严格被拒。

找到 post_install do |installer| 模块，在 installer.pods_project.targets.each 循环内部添加以下配置：

*(注：1 = 启用，0 = 禁用/移除代码)*

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)

    # --- 粘贴开始 ---
    target.build_configurations.each do |config|
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= [
        '$(inherited)',

        ## ✅ 需要使用的权限 (设为 1) ##
        'PERMISSION_CAMERA=1',
        'PERMISSION_PHOTOS=1',
        'PERMISSION_NOTIFICATIONS=1',

        ## ❌ 不需要使用的权限 (设为 0) ##
        'PERMISSION_MICROPHONE=0',
        'PERMISSION_LOCATION=0',
        'PERMISSION_BLUETOOTH=0',
        'PERMISSION_CONTACTS=0',
        'PERMISSION_CALENDAR=0',
        'PERMISSION_REMINDERS=0',
        'PERMISSION_SENSORS=0',
        'PERMISSION_SPEECH_RECOGNIZER=0',
        'PERMISSION_MEDIA_LIBRARY=0',
        'PERMISSION_APP_TRACKING_TRANSPARENCY=0',
      ]
    end
    # --- 粘贴结束 ---
  end
end
```

修改保存 Podfile 后，必须执行：`pod install` 。

在 Info.plist 中补充权限声明：

```xml
<!-- 相机 -->
<key>NSCameraUsageDescription</key>
<string>App需要您的同意才能访问相机</string>

<!-- 相册 -->
<key>NSPhotoLibraryUsageDescription</key>
<string>App需要您的同意才能访问相册</string>
```

## Color主流方案 - 拓展

```dart
/// 十六进制字符串转颜色
extension HexColor on String {
  /// 转换为颜色（可能返回 null）
  Color? get colorOrNull {
    try {
      String hex = replaceAll('#', '').replaceAll(' ', '');

      // 验证格式
      if (!RegExp(r'^[0-9A-Fa-f]+$').hasMatch(hex)) {
        return null;
      }

      // 处理简写 #fff -> #ffffff
      if (hex.length == 3) {
        hex = hex.split('').map((c) => c + c).join();
      }

      // 处理透明度
      if (hex.length == 6) {
        hex = 'FF$hex';
      } else if (hex.length != 8) {
        return null;
      }

      return Color(int.parse(hex, radix: 16));
    } catch (e) {
      return null;
    }
  }

  /// 转换为颜色（带默认值）
  Color colorOr(Color defaultColor) => colorOrNull ?? defaultColor;

  /// 转换为颜色（失败返回黑色）
  Color get color => colorOrNull ?? const Color(0xFF000000);
}
/// 颜色转十六进制字符串
extension ColorToHex on Color {
  String toHex({bool withAlpha = false}) {
    if (withAlpha) {
      return '#${value.toRadixString(16).padLeft(8, '0').toUpperCase()}';
    }
    return '#${value.toRadixString(16).substring(2).toUpperCase()}';
  }
}
```

## Fluttertoast 的使用

- 在入口处添加`builder: FToastBuilder()`（总在MaterialApp处） 和

```dart
final _rootNavigatorKey = GlobalKey<NavigatorState>();
navigatorKey: _rootNavigatorKey
```

## 自定义EasyLoading

```dart
void configureEasyLoading() {
  EasyLoading.instance
    ..loadingStyle = EasyLoadingStyle.custom
    ..backgroundColor = const Color(0x0ff55555)
    ..indicatorColor = const Color(0xFF2196F3)
    ..indicatorWidget = const SizedBox(
    width: 40.0,
    height: 40.0,
    child: CircularProgressIndicator(
      strokeWidth: 4.0,
      backgroundColor: Colors.white,
      valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2196F3)),
    ),
  )
    ..textColor = Colors.white
    ..textAlign = TextAlign.center
    ..fontSize = 15.0
    ..contentPadding = const EdgeInsets.symmetric(
    vertical: 18.0,
    horizontal: 18.0,
  )
    ..textPadding = const EdgeInsets.only(
    top: 10.0,
    left: 15.0,
    right: 15.0,
    bottom: 10.0,
  )
    ..indicatorSize = 40.0
    ..radius = 8.0
    ..maskColor = Colors.black.withValues(alpha: 0.5)
    ..userInteractions = false
    ..dismissOnTap = false;
}
```

## 权限

| 操作 | Android 13+ | Android 12- | iOS | 需要权限 | permission_handler |
| --- | --- | --- | --- | --- | --- |
| **保存图片到相册** | ❌ 不需要 | ✅ storage | ✅ photos | Android 12- 需要 | ✅ 支持 |
| **保存文件到下载** | ❌ 不需要 | ✅ storage | ❌ 不需要 | Android 12- 需要 | ✅ 支持 |
| **从相册选择图片** | ✅ photos | ✅ storage | ✅ photos | 都需要 | ✅ 支持 |
| **从文件管理器选择文件** | ❌ 不需要 | ❌ 不需要 | ❌ 不需要 | 都不需要 | ❌ 不支持 |
| **TTS (文字转语音)** | ❌ 不需要 | ❌ 不需要 | ❌ 不需要 | 都不需要 | ❌ 不支持 |
| **STT (语音转文字)** | ✅ microphone | ✅ microphone | ✅ microphone + speech | 都需要 | ✅ 支持 |
| **实时语音通话** | ✅ microphone | ✅ microphone | ✅ microphone | 都需要 | ✅ 支持 |
| **网络请求** | ⚠️ 正常权限 | ⚠️ 正常权限 | ❌ 不需要 | Android 需要声明 | ❌ 不支持 |
| **获取剪贴板内容** | ❌ 不需要 | ❌ 不需要 | ⚠️ 会提示 | 都不需要 | ❌ 不支持 |
| **屏幕捕捉/录制** | ⚠️ 系统授权 | ⚠️ 系统授权 | ⚠️ 系统授权 | 需要用户手动授权 | ❌ 不支持 |

## 如何配置名称包名版本号

- [Flutter 应用在 iOS 和 Android](https://www.notion.so/Flutter-iOS-Android-2cc015f846f581ef9d5bec603a322b71?pvs=21)

## 如何给图片裁切圆角

- 1、

```dart
ClipRRect(
  borderRadius: BorderRadius.circular(8),  // 圆角半径
  child: AssetEntityImage(
    entity,
    isOriginal: false,
    thumbnailSize: ThumbnailSize.square(200),
    fit: BoxFit.cover,
  ),
)
```

- 2、

```dart
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(8),
  ),
  clipBehavior: Clip.antiAlias,  // 关键：裁剪子组件
  child: AssetEntityImage(
    entity,
    isOriginal: false,
    fit: BoxFit.cover,
  ),
)
```

- 3、

```dart
ClipOval(
  child: AssetEntityImage(
    entity,
    width: 100,
    height: 100,
    fit: BoxFit.cover,
  ),
)
```

## 容器限制最大宽度

width/height 配置的是容器指定高度，而且约束。

```dart
Container(
  constraints: const BoxConstraints(
    maxWidth: 300,
    maxHeight: 300,
    minWidth: 100,
    minHeight: 100,
  ),
)
```

## 修改容器指定处圆角值

- `copyWith` 属性。支持复制所有属性并同时修改指定值。
- BorderRadius 等价写法
    
    ```dart
    // 第一步：创建四个圆角都是 14 的圆角
    BorderRadius.circular(14)
    // 等价于：
    BorderRadius.all(Radius.circular(14))
    // 等价于：
    BorderRadius.only(
      topLeft: Radius.circular(14),
      topRight: Radius.circular(14),
      bottomLeft: Radius.circular(14),
      bottomRight: Radius.circular(14),
    )
    ```
    

```dart
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(
      14,
    ).copyWith(bottomRight: Radius.zero),
  )
```

## 隔离重绘

- `RepaintBoundary` 属性
- **没有 RepaintBoundary 的情况**

```
<TEXT>
┌─────────────────────────────────┐
│  ListView (父容器)               │
│  ┌───────────────────────────┐  │
│  │ 消息 1                    │  │  ← 这条消息变化
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 消息 2                    │  │  ← 这条也被重绘 ❌
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 消息 3                    │  │  ← 这条也被重绘 ❌
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**问题：** 一条消息变化，整个 ListView 都要重绘！

---

- **使用 RepaintBoundary 的情况**

```
<TEXT>
┌─────────────────────────────────┐
│  ListView (父容器)               │
│  ┌───────────────────────────┐  │
│  │ RepaintBoundary           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │ 消息 1              │  │  │  ← 只重绘这个区域 ✅
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ RepaintBoundary           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │ 消息 2              │  │  │  ← 不受影响 ✅
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**效果：** 每条消息独立重绘，互不影响！

推荐添加的三个地方：`输入框` 、`列表容器` 、`列表项`

![](/images/notes/2026/01/2026-01-11-17.png)

## 调整输入框的光标样式

| 属性 | 类型 | 作用 | 推荐值 |
| --- | --- | --- | --- |
| **`cursorHeight`** | `double?` | 光标高度 | `18-22` |
| **`cursorWidth`** | `double` | 光标宽度 | `2` |
| **`cursorColor`** | `Color?` | 光标颜色 | `Colors.blueAccent` |
| **`cursorRadius`** | `Radius?` | 光标圆角 | `Radius.circular(2)` |

## Riverpod 加载顺序

官方推荐`value -> error -> loading`而不是传统 web 的 `isloading - data -error` 。[详见](https://riverpod.dev/docs/tutorials/first_app#handling-loading-and-error-states)

```dart
// 场景：用户下拉刷新列表
// 此时 AsyncValue 状态：
// - isLoading: true (正在刷新)
// - value: [旧的列表数据] (上次加载的数据)
// - error: null

// ❌ 错误顺序：先检查 isLoading
// 结果：列表消失，显示加载圈

// ✅ 正确顺序：先检查 value
// 结果：列表继续显示，可以在顶部显示小的刷新指示器
```

## **Effective Dart 官方推荐顺序**

```dart
class MyWidget extends StatelessWidget {
  // 1️⃣ 静态常量
  static const double defaultPadding = 16.0;

  // 2️⃣ 实例字段（按重要性排序）
  final String title;
  final VoidCallback? onTap;
  final bool enabled;

  // 3️⃣ 构造函数
  const MyWidget({
    super.key,
    required this.title,
    this.onTap,
    this.enabled = true,
  });

  // 4️⃣ 命名构造函数
  const MyWidget.disabled({
    super.key,
    required this.title,
  }) : onTap = null,
  enabled = false;

  // 5️⃣ 重写方法
  @override
  Widget build(BuildContext context) {
    return Container();
  }

  // 6️⃣ 公共方法
  void doSomething() {}

  // 7️⃣ 私有方法
  void _helperMethod() {}
}
```

## IconButton 如何添加 disabled 样式

- 为`onPressed` 传递 `null` 值。

## Flutter中集成 TTS 和 STT 的三种方案

1. [**flutter_tts](https://pub.dev/packages/flutter_tts) 与** [speech_to_text](https://pub.dev/packages/speech_to_text)
2. [Azure 语音服务](https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/)（[websocket 方案](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-lower-speech-synthesis-latency?pivots=programming-language-csharp#input-text-streaming)，为了更简单集成实时翻译）
3. Platform Channel

## 按钮动画不一致

1. 禁止动画

```dart
IconButton.filled(
  style: IconButton.styleFrom(
  ).copyWith(animationDuration: Duration.zero),
)
```

1. 保留动画，同步动画。TweenAnimationBuilder 组件
2. 如果是 theme 切换时的动画，那么可以使用`themeAnimationDuration` 

```dart
// 方案 A：设置时长为零
MaterialApp(
	// 立即切换，无动画
	themeAnimationDuration: Duration.zero,
  // 慢速切换（500毫秒）  
  // themeAnimationDuration: Duration(milliseconds: 500),
)

// 方案 B：使用 AnimationStyle（Flutter 3.16+，更简洁）
MaterialApp(
  themeAnimationStyle: AnimationStyle.noAnimation,
  // ...
)
```

## 如何判断深色模式

```dart
final isDark = Theme.of(context).brightness == Brightness.dark;
```

## **MaterialApp 主题动画属性对比**

| 属性 | 作用 | 默认值 |
| --- | --- | --- |
| `themeAnimationDuration` | 动画**持续时间** | `Duration(milliseconds: 200)` |
| `themeAnimationCurve` | 动画**曲线/缓动效果** | `Curves.linear` |
| `themeAnimationStyle` | 动画**整体开关** | `AnimationStyle()` |

## **FreezedUnionCase 对照表**

| FreezedUnionCase | googleSearch | scholarSearch | myAwesomeTool |
| --- | --- | --- | --- |
| **snake** | `google_search` | `scholar_search` | `my_awesome_tool` |
| **kebab** | `google-search` | `scholar-search` | `my-awesome-tool` |
| **pascal** | `GoogleSearch` | `ScholarSearch` | `MyAwesomeTool` |
| **camel** | `googleSearch` | `scholarSearch` | `myAwesomeTool` |
| **screamingSnake** | `GOOGLE_SEARCH` | `SCHOLAR_SEARCH` | `MY_AWESOME_TOOL` |
| **none** | `googleSearch` | `scholarSearch` | `myAwesomeTool` |

| 枚举值 | 风格名称 | 转换结果 | 常见使用场景 |
| --- | --- | --- | --- |
| `snake` | 蛇形命名 | `google_search` | Python API、Ruby、数据库字段 |
| `kebab` | 烤串命名 | `google-search` | URL slug、CSS 类名、HTML 属性 |
| `pascal` | 帕斯卡命名 | `GoogleSearch` | C#/.NET API、某些 Java API |
| `camel` | 驼峰命名 | `googleSearch` | JavaScript/TypeScript API |
| `screamingSnake` | 尖叫蛇形 | `GOOGLE_SEARCH` | 常量风格、某些旧式 API |
| `none` | 无转换 | `googleSearch` | 保持原样（等同于 camel） |

**转换的依据是：工厂方法命名必须用驼峰（含大写字母），因为**转换算法**依赖大写字母作为分隔点**。

## **appBar默认高度问题**

 Material Design appBar 的默认高度太高，一般需要进行调小。标准如下：

- 移动端：使用 44px（iOS 标准）
- 平板/桌面：使用 48-52px

| 应用 | 高度 | 说明 |
| --- | --- | --- |
| **微信** | 44px | iOS 标准高度 |
| **Twitter** | 48px | 稍高一点 |
| **Telegram** | 44px | 简洁风格 |
| **Material Design** | 56px | Android 标准（偏高） |
| **iOS HIG** | 44px | iOS 标准 |

## 粘性吸顶方案

![](/images/notes/2026/01/2026-01-11-13.png)

## 移除 Button 水波纹

- 直接设置属性

```dart
IconButton(
  icon: const Icon(Icons.menu),
  splashColor: Colors.transparent,      // ✅ 移除水波纹
  highlightColor: Colors.transparent,   // ✅ 移除高亮
  onPressed: () {
    Scaffold.of(context).openDrawer();
  },
)
```

## 全局点击空白关闭键盘

注意：全局方案中使用 FocusManager.instance.primaryFocus?.unfocus() 通常比 FocusScope.of(context) 更安全，因为它不依赖具体的 BuildContext。

```dart
// 在 main.dart 中
MaterialApp(
  // ... 其他配置
  builder: (context, child) => GestureDetector(
    onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
    behavior: HitTestBehavior.translucent,
    child: child,
  ),
);
```

如果使用了flutter_easyloading 库，那么写法更新如下

```dart
MaterialApp(
  builder: EasyLoading.init(
    builder: (context, child) {
      return GestureDetector(
        // 核心逻辑：点击任意空白处，收起键盘
        onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
        // 核心属性：保证透明区域也能响应点击
        behavior: HitTestBehavior.translucent,
        child: child,
      );
    },
  ),
);
```

唯一需要注意的“互斥”场景：列表滚动时的键盘行为。

Flutter 的 ListView / CustomScrollView 有一个专门的属性处理这个：

```dart
ListView.builder(
  // ... 其他属性

  // ✅ 强烈建议在聊天页面加上这一行
  keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,

  itemCount: messages.length,
  itemBuilder: ...
)
```