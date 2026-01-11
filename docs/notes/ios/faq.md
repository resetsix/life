---
title: 常见问题
createTime: 2026/01/11 13:46:34
permalink: /ios/faq/
---

### SwiftUI 隐藏 TabView
```swift
struct DetailView: View {
	var body: some View {
		Text("详情页面")
	}
}

#if DEBUG
#Preview {
	NavigationStack {
		TabView {
			NavigationStack {
				NavigationLink("跳转到详情") {
					DetailView()
					.toolbar(.hidden, for: .tabBar) // Pay attention to this line.
				}
			}
			.tabItem {
				Label("首页", systemImage: "house.fill")
			}

			Text("设置")
			.tabItem {
				Label("设置", systemImage: "gear")
			}
		}
	}
}
#endif
```

```swift

struct MainTabView01: View {
    var body: some View {
        NavigationStack {
            TabView {
                HomeView()
                    .tabItem {
                        Label("首页", systemImage: "house.fill")
                    }

                DiscoverView()
                    .tabItem {
                        Label("发现", systemImage: "safari.fill")
                    }

                CreateView()
                    .tabItem {
                        Label("发布", systemImage: "plus.circle.fill")
                    }

                RecommendView()
                    .tabItem {
                        Label("推荐", systemImage: "star.fill")
                    }

                ProfileView()
                    .tabItem {
                        Label("我的", systemImage: "person.fill")
                    }
            }
        }
    }
}

struct HomeView: View {
    var body: some View {
        VStack {
            Text("首页")
            NavigationLink("跳转到详情1") {
                DetailView1()
                    .navigationBarBackButtonHidden(false)
                    .toolbar(.hidden, for: .tabBar)
            }
        }
    }
}

struct DetailView1: View {
    var body: some View {
        VStack {
            Text("详情页面1")
            NavigationLink("跳转到详情2") {
                DetailView2()
                    .navigationBarBackButtonHidden(false)
                    .toolbar(.hidden, for: .tabBar)
            }
        }
    }
}

struct DetailView2: View {
    var body: some View {
        VStack {
            Text("详情页面2")
            NavigationLink("跳转到详情3") {
                DetailView3()
                    .navigationBarBackButtonHidden(false)
                    .toolbar(.hidden, for: .tabBar)
            }
        }
    }
}

struct DetailView3: View {
    var body: some View {
        Text("详情页面3")
    }
}

struct DiscoverView: View {
    var body: some View {
        NavigationLink("发现页面") {
            Text("发现详情")
                .toolbar(.hidden, for: .tabBar)
        }
    }
}

struct CreateView: View {
    var body: some View {
        NavigationLink("发布内容") {
            Text("发布详情")
                .toolbar(.hidden, for: .tabBar)
        }
    }
}

struct RecommendView: View {
    var body: some View {
        NavigationLink("推荐内容") {
            Text("推荐详情")
                .toolbar(.hidden, for: .tabBar)
        }
    }
}

struct ProfileView: View {
    var body: some View {
        NavigationLink("个人中心") {
            Text("个人详情")
                .toolbar(.hidden, for: .tabBar)
        }
    }
}

#Preview("主标签页") {
    MainTabView01()
}
```

### TabView选中标题颜色
`accentColor` 属性是 SwiftUI 中用于设置应用程序强调色(主题色)的属性。在 TabView 中，它主要用于：

+ 设置选中标签页的颜色
+ 控制选中状态下图标和文字的颜色

例如，如果将 TabView 选中项字体的颜色改为红色

```swift
TabView(selection: $selectedTab) {
    // ... tab items ...
}
.accentColor(.red)
```

### 底部导航背景色
iOS 16及以上使用`.toolbarBackground`属性

iOS 15及以下使用`init`方法；并且初始化的颜色值只能使用UIColor(xxx,xxx,xxx,xxx)，测试 hex 不行。

```swift
import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    init() {
        // iOS 15及以下版本设置TabBar背景
        if #available(iOS 15.0, *) {
            let appearance = UITabBarAppearance()
            appearance.configureWithOpaqueBackground()
            // #161D4C
            appearance.backgroundColor = UIColor(
                red: 22 / 255,
                green: 29 / 255,
                blue: 76 / 255,
                alpha: 1
            )
            UITabBar.appearance().scrollEdgeAppearance = appearance
            UITabBar.appearance().standardAppearance = appearance
        }
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            ProfileHome()
                .tabItem {
                    Image(selectedTab == 0 ? "profile_light" : "profile_dark")
                    Text("我的")
                }
                .tag(0)
        }
        .accentColor(.white)
        .ignoresSafeArea(.keyboard)
        // iOS 16及以上可以使用toolbarBackground
        .toolbarBackground(.blue, for: .tabBar)
        .toolbarBackground(.visible, for: .tabBar)
    }
}

#if DEBUG
#Preview {
    MainTabView()
}
#endif

```

### 顶部导航标题
```swift
SettingsView()
.navigationBarTitle("设置")
```

### 顶部导航标题字体大小和颜色
```swift
init() {
	UINavigationBar.appearance().titleTextAttributes = [.foregroundColor: UIColor.white,.font: UIFont.systemFont(ofSize: 18)]
}
```

### 顶部导航背景颜色
```swift
.toolbarBackground(Color.red, for: .navigationBar)
.toolbarBackground(.visible, for: .navigationBar)
```

### SF 返回图标
```swift
// chevron.backward
// chevron.left
```

### 返回图标没有Button的默认动画
不能在外面套`ScrollView`

### 国际化
方法效果：

![](/images/notes/2026/01/2026-01-11-01.png)

方法：

```swift
// 当前 App 使用的语言
let firstLanguage = Bundle.main.preferredLocalizations.first
// 当前设备的首选语言
let languageCode = Locale.preferredLanguages.first?.split(separator: "-").first ?? "默认值en"
// 当前设备的语言代码
let currentLanguage = Locale.current.language.languageCode?.identifier ?? "默认值en" // 默认英语
// 当前设备的语言地区码
let currentLocale = Locale.current.identifier // 如 "en_US", "zh_CN"
// 系统偏好的语言列表
let preferredLanguages = Locale.preferredLanguages // 返回数组，按优先级排序

Text("当前 App 使用的语言: \(firstLanguage ?? "")")
Text("当前设备的首选语言: \(languageCode)")
Text("当前设备的语言代码: \(currentLanguage)")
Text("当前设备的语言地区码: \(currentLocale)")
Text("系统偏好的语言列表: \(preferredLanguages)")
```

### Swift 默认仅支持 https 请求
+ 解决 [https://blog.csdn.net/weixin_44786530/article/details/139357244](https://blog.csdn.net/weixin_44786530/article/details/139357244)

### 滑动容易误触点击事件
在一个`ScrollView`中使用`ForEach`遍历历史记录，原本使用`Button`触发点击操作，但是滑动操作也会误触发点击。

解决：替换为`onTapGesture`更精确的点击

```swift
// 问题示例 - 容易误触发
struct ContentView: View {
    var body: some View {
        ScrollView {
            ForEach(0..<10) { index in
                Button(action: {
                    print("点击了 \(index)")
                }) {
                    Text("项目 \(index)")
                        .frame(maxWidth: .infinity)
                        .padding()
                }
                .swipeActions {
                    Button("删除") {
                        print("删除 \(index)")
                    }
                }
            }
        }
    }
}

// 解决方案 - 使用 onTapGesture
struct ContentView: View {
    var body: some View {
        ScrollView {
            ForEach(0..<10) { index in
                Text("项目 \(index)")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .contentShape(Rectangle()) // 确保整个区域可点击
                    .onTapGesture {
                        print("点击了 \(index)")
                    }
                    .swipeActions {
                        Button("删除") {
                            print("删除 \(index)")
                        }
                    }
            }
        }
    }
}
```

### 背景组件
背景图效果图示例

![](/images/notes/2026/01/2026-01-11-02.png)

```swift
VStack(alignment: .leading, spacing: 12) {
	// ==标题也可以自定义==
	Text("参数设置")
	.foregroundColor(.white)
	.font(.system(size: 18, weight: .medium))
	.padding(.horizontal, 16)
	.padding(.top, 16)

	// ===可以将这里修改为其他组件===
	HStack {
		Text("创意想象力")
		.foregroundColor(.white)
		.font(.system(size: 14))

		CustomSlider(value: Binding(
			get: { viewModel.temperature / 2.0 },
			set: { newValue in
				  let scaledValue = (newValue * 2.0 * 10).rounded() / 10
				  viewModel.temperature = min(max(scaledValue, 0), 2)
				 }
		))
		.frame(height: 2)

		Text("创意相关性")
		.foregroundColor(.white)
		.font(.system(size: 14))
	}
	// ===end===
	.padding(.horizontal, 16)
	.padding(.bottom, 16)
}
.background(Color.black.opacity(0.2))
.cornerRadius(16)
```

### 软键盘导致移动背景图
+ 首先使用`position`固定住图片，`/2`的意思是获取设备的中心位置为了更精确的定位。
+ 仅仅使用`position`时只能覆盖内容区域，而顶部/底部安全区域仍是默认样式（白色背景）。

解决：`position`+`ignoresSafeArea`

注意：顺序是`position`在前`ignoresSafeArea`在后，否则不生效！需要获取计算完整宽高才能忽略安全区域，否则获取的仅有内容区域高度。

```swift
.background(
	Image("background")
	.resizable()
	.scaledToFill()
	.position(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height / 2)
	.ignoresSafeArea()
)
```

### 启动页设置/自适应
[https://juejin.cn/post/7374067795656884261#heading-3](https://juejin.cn/post/7374067795656884261#heading-3)

### 滚动容器位置检测
```swift
import SwiftUI

// 用于传递滚动偏移量的PreferenceKey
struct ScrollOffsetPreferenceKey: PreferenceKey {
	static var defaultValue: CGFloat = 0
	static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
		value = nextValue()
	}
}

struct ContentView: View {
	@State private var isAtBottom = false
	@State private var messages: [Int] = Array(0 ..< 30) // 测试数据

	var body: some View {
		VStack(spacing: 0) {
			ScrollViewReader { proxy in
							  ScrollView {
								  VStack(spacing: 15) {
									  ForEach(messages, id: \.self) { index in
													   Text("Item \(index)")
													   .padding()
													   .frame(maxWidth: .infinity)
													   .background(Color.blue.opacity(0.2))
													   .cornerRadius(12)
													   .id(index) // 给每个item添加id
													  }

									  // 底部检测视图
									  Color.red
									  .frame(height: 1)
									  .id("bottom")
									  .onAppear {
										  withAnimation(.easeInOut(duration: 0.2)) {
											  isAtBottom = true
										  }
									  }
									  .onDisappear {
										  withAnimation(.easeInOut(duration: 0.2)) {
											  isAtBottom = false
										  }
									  }
								  }
								  .padding(.horizontal)
							  }
							  .onChange(of: messages) { _, _ in
										 // 当消息更新时，自动滚动到底部
										 withAnimation {
											 proxy.scrollTo("bottom", anchor: .bottom)
										 }
										}
							 }

			// 底部状态栏
			HStack {
				Spacer()
				Text(isAtBottom ? "已接近底部" : "未到底部")
				.padding(.horizontal, 20)
				.padding(.vertical, 10)
				.background(isAtBottom ? Color.green : Color.red)
				.foregroundColor(.white)
				.cornerRadius(20)
				.animation(.easeInOut, value: isAtBottom)
				Spacer()
			}
			.padding()
			.background(Color.white)

			// 测试按钮
			Button(action: {
				// 添加新消息来测试
				messages.append(messages.count)
			}) {
				Text("添加消息")
				.padding()
				.background(Color.blue)
				.foregroundColor(.white)
				.cornerRadius(10)
			}
			.padding(.bottom)
		}
	}
}

struct ContentView_Previews: PreviewProvider {
	static var previews: some View {
		ContentView()
	}
}

```

### 导航返回一层一层问题
```swift
// 初始代码❎
.onTapGesture {
    navigationPath.append(NavigationItemEnum.youTubeSearch(threadId: history.id))
}

// 优化后✅
.onTapGesture {
    // 先使用目标导航覆盖原有导航
    navigationPath = NavigationPath([NavigationItemEnum.youTubeSearch(threadId: history.id)])
    // 加入延迟原因：访问相同id的历史记录后返回时直接返回至根目录，避免同时进行发生冲突
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        // 关闭当前界面
        dismiss()
    }
}
```

### 进入新导航后又自动返回
目前遇到两个原因导致：

+ AIChatViewModel()实例不一致。**解决：提取到更高的父组件中统一实例化，共享同一实例**。
+ 在onDisappear中有 path?.count > 1 && path.removeLast()**判断导致。**

**注意：ViewModel 提升到全局实例保持不变后，打开某些对话界面仍然保留 messages，需要在view onDisappear的时候清除相关状态。**

### ？父子类传参以及 init 初始化时机
### 思考内容未更新至UI，但重载历史记录和数据库中却有
问题原因：工具智能体在最终返回响应的时候会返回`event`和`node`，而我在处理这个两个字段的时候默认不处理`reasoning`内容，

```swift
{"code": 200, "type": "text", "value": "页面"}
{"code": 200, "type": "text", "value": "。"}
{"code": 200, "type": "status", "event": "on_chain_end", "node": "ai_reason"}
```

```swift
// 优化前
if let event = response.event {
    updateLastAssistantMessage(content: pendingAnswer ?? "", event: event)
}
if let node = response.node {
    updateLastAssistantMessage(content: pendingAnswer ?? "", node: node)
}
if let content = response.content {
    pendingAnswer = (pendingAnswer ?? "") + content
    updateLastAssistantMessage(content: pendingAnswer ?? "", reasoning: pendingReasoning)
}
if let reasoning = response.reasoning {
    pendingReasoning = (pendingReasoning ?? "") + reasoning
    updateLastAssistantMessage(content: pendingAnswer ?? "", reasoning: pendingReasoning)
}

// 优化后
if let event = response.event {
    // 新增reasoning处理
    updateLastAssistantMessage(content: pendingAnswer ?? "", event: event, reasoning: pendingReasoning)
}
if let node = response.node {
    // 新增reasoning处理
    updateLastAssistantMessage(content: pendingAnswer ?? "", node: node, reasoning: pendingReasoning)
}
if let content = response.content {
    pendingAnswer = (pendingAnswer ?? "") + content
    updateLastAssistantMessage(content: pendingAnswer ?? "", reasoning: pendingReasoning)
}
if let reasoning = response.reasoning {
    pendingReasoning = (pendingReasoning ?? "") + reasoning
    updateLastAssistantMessage(content: pendingAnswer ?? "", reasoning: pendingReasoning)
}
```

### Xcode 无法自动收集动态字符串
```swift
// 优化前
Text(NSLocalizedString(
    "Search \(wikiResults.count) data",
    comment: "搜索到\(wikiResults.count)条数据"

// 优化后
Text(String.localizedStringWithFormat(
    NSLocalizedString("Search %d data", comment: "搜索到%d条数据"),
    wikiResults.count
))
```

### iOS 错误码
[参考](https://tmf.qq.com:30036/docs/05-backend-service/mobile-gateway/error-code/ios-error-code.html)

### Simulator模拟器导出图片到本机
首先获取当前运行模拟器的 UUID，在终端执行以下命令

```swift
xcrun simctl list devices | grep Booted

# 得到
# resetsix@resetsixMacBook-Pro ~ % xcrun simctl list devices | grep Booted
# iPhone 16 (44A45AE3-382F-4B21-957B-0A18D65160F5) (Booted) 
```

打开 Finder，按 `Command + Shift + G` 打开"前往文件夹"对话框，输入以下路径（粘贴 UUID）

```swift
~/Library/Developer/CoreSimulator/UUID/
```

模拟器的文件系统中，图片文件通常存储在以下几个位置

```swift
~/Library/Developer/CoreSimulator/Devices/UUID/data/Media/DCIM/
```

```swift
~/Library/Developer/CoreSimulator/Devices/UUID/data/Media/PhotoData/
```

### HStack 顶部对齐和首行对齐
```swift
// 首行对齐
HStack(alignment: .firstTextBaseline, spacing: Int) {
    Text(xxx)
    Text(xxx)
}

// 顶部对齐
HStack(alignment: .top, spacing: Int) {
    Text(xxx)
    Text(xxx)
}
```

### ? 构建的时候不选择 any ios 是否有兼容性
### TextEditor 修改背景色
使用`.scrollContentBackground(.hidden)`

### 调整弹出框高度
弹出框预设高度。(仅针对iPhone。因为iPad上显示的是浮动的小窗口)

```swift
.popover(isPresented: $isShow) {
    VStack {
        Text("弹出框内容")
        Button("关闭") { isShow = false }
    }
    .padding()
    .presentationDetents([.medium]) // 中等尺寸，约为屏幕高度的一半
    // 或使用
    // .presentationDetents([.large]) // 大尺寸，接近全屏
    // .presentationDetents([.medium, .large]) // 允许用户在中等和大尺寸之间拖动调整
}

.popover(isPresented: $isShow) {
    VStack {
        Text("弹出框内容")
        Button("关闭") { isShow = false }
    }
    .padding()
    .presentationDetents([
        .medium,  // 中等尺寸
        .large,   // 大尺寸
        .fraction(0.25), // 自定义25%高度
    ])
    .presentationDragIndicator(.visible) // 显示拖动指示器
}

// iOS 16之前的替代方案
.popover(isPresented: $isShow) {
    GeometryReader { geometry in
        VStack {
            Text("弹出框内容")
            Button("关闭") { isShow = false }
        }
        .padding()
        .frame(height: geometry.size.height * 0.5) // 模拟"medium"高度
    }
}
```

全屏弹出框

```swift
.fullScreenCover(isPresented: $isShowFull) {
    VStack {
        Text("全屏弹出框内容")
        Button("关闭") { isShowFull = false }
    }
    .padding()
    .background(Color.gray.opacity(0.2))
}
```

### 四周设置圆角
```swift
.clipShape(RoundedRectangle(cornerRadius: 16))
```

### 非四周设置圆角
```swift
.clipShape(UnevenRoundedRectangle(topLeadingRadius: UIConf.Rounded.xs,
                                  topTrailingRadius: UIConf.Rounded.xs,
                                  bottomLeadingRadius: 0,
                                  bottomTrailingRadius: 0))
```

### 不再支持 UIWebView 和 WebView
从 iOS 12+ 就开始废弃UIWebView，推荐使用 WKWebView 代替，不然上包都上不了。[详情](https://developer.apple.com/cn/news/?id=edwud51q)

### 隐藏内容滚动时顶部导航出现毛玻璃效果
```swift
.toolbarBackground(.black, for: .navigationBar)

// 或者试试.hidden
```

### App 固定 light/dark 单一主题
Project - Build Settings - 搜索`User Interface Style` - 找到`Info.plist Values` - 开始修改

![](/images/notes/2026/01/2026-01-11-03.png)

### 如何遮挡键盘弹出时的空隙
使用

+ `.background(Color.black.ignoresSafeArea(edges: .bottom))`

用法：

```swift
.safeAreaInset(edge: .bottom) {
    chatInputView()
    .background(Color.black.ignoresSafeArea(edges: .bottom))
}
```

### 右上角添加内容
`.overlay`与`.background`相反，前者是上层后者是底层。

基础用法

```swift
基础视图.overlay(
    // 想放在上面的“覆盖视图”
)
```

> **默认行为**：默认情况下，覆盖视图会**居中**放置在基础视图之上。
>

**示例：在圆形上放置一个加号图标**

```swift
Circle()
.fill(Color.blue)
.frame(width: 100, height: 100)
.overlay(
    Image(systemName: "plus")
    .font(.largeTitle)
    .foregroundColor(.white)
)
```

`.alignment`（Alignment 类型）参数说明：

+ .center (默认值)
+ .top, .bottom, .leading (左), .trailing (右)
+ .topLeading (左上角), .topTrailing (右上角)
+ .bottomLeading (左下角), .bottomTrailing (右下角)

```swift
基础视图.overlay(
    alignment: .someAlignment, // 指定对齐方式
    content: {
        // 覆盖视图
    }
)
```

```swift
// 演示右上角偏移图标
Image(systemName: "app.badge.fill")
.font(.system(size: 80))
.foregroundColor(.green)
.overlay(
    // 在右上角对齐
    alignment: .topTrailing,
    content: {
        Text("3")
        .font(.caption)
        .bold()
        .foregroundColor(.white)
        .padding(6)
        .background(Circle().fill(Color.red))
        // 使用 offset 对位置进行微调
        .offset(x: 10, y: -10)
    }
)
```

### TextField 输入框实现换行
`axis: .vertical` 搭配 `.lineLimit`，前者是多行开关，后者是高度限制。

用法：

```swift
TextField("输入...", text: $text, axis: .vertical)
.lineLimit(1...5)
.padding()
.border(Color.green)
```

### 如何声明类型别名
```swift

```

### 如何隐藏底部指示器
```swift
.persistentSystemOverlays(.hidden)
```

### 如何覆盖组件内置背景色
使用 `.scrollContentBackground(.hidden)`，适用于 `List`、`TextEditor和Form`等。

```swift
List(0..<100) { i in
    Text("Test \(i)")
}
.scrollContentBackground(.hidden)
.background(.indigo)
```

```swift
struct ContentView: View {
    @State private var inputText = "hello"

    var body: some View {
        TextEditor(text: $inputText)
            .scrollContentBackground(.hidden)
            .background(Color.red)
    }
}
```

### 如何扩大点击范围
具体原理：声明一个覆盖层来响应点击事件。

```swift
.contentShape(Rectangle())
```

### 解决隐藏 navigationBarBackButton 导致侧滑手势失效问题
```swift
import ObjectiveC
import SwiftUI

class NavigationControllerDelegate: NSObject, UIGestureRecognizerDelegate {
    private weak var navigationController: UINavigationController?

    init(navigationController: UINavigationController) {
        self.navigationController = navigationController
        super.init()
    }

    func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        guard let navigationController else {
            return false
        }
        return navigationController.viewControllers.count > 1
    }
}

extension UINavigationController {
    private enum AssociatedKeys {
        static var delegateKey: UInt8 = 0
    }

    private var gestureDelegate: NavigationControllerDelegate {
        guard let delegate = objc_getAssociatedObject(
            self,
            &AssociatedKeys.delegateKey
        ) as? NavigationControllerDelegate else {
            let delegate = NavigationControllerDelegate(navigationController: self)
            objc_setAssociatedObject(self, &AssociatedKeys.delegateKey, delegate, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
            return delegate
        }
        return delegate
    }

    open override func viewDidLoad() {
        super.viewDidLoad()
        interactivePopGestureRecognizer?.delegate = gestureDelegate
    }
}

```

### 如何查询模拟器的Device IDs
终端执行，列表所有模拟器的Device IDs

```bash
xcrun simctl list devices
```

查看当前正在运行的模拟器 Device ID

```bash
xcrun simctl list devices | grep "Booted"
```

keyChain 文件所在路径  
`~/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Library/Keychains/`

### 如何解决图片溢出问题
遇到问题的场景是：详情页有一个渐变色的背景图，因为使用`.fill`的缘故导致 pop 导航过程中会看见图片溢出。

解决思路：`.clipped`修饰符顺序先于`.ignoresSafeArea`，并且 ignoresSafeArea的范围修改为 top（使用 top 的原因是当时图片的渐变色只有顶部有渐变色，所以可以视情况而定）。

```swift
Image("ImageBrandBackground")
.resizable()
.aspectRatio(contentMode: .fill)
.frame(width: UIScreen.main.bounds.width)
.clipped()
.ignoresSafeArea(.container, edges: .top)
```

### 本地图片和 SF 图标修改大小的不同方式
SF Symbols：

+ `.font()` 内置文字大小的写法和数字形式都可以，但是不支持`.frame()`
+ `.imageScale()` 可选值有（Image.large、Image.medium、Image.small）

本地图片：

+ 必须先使用 .resizable()，然后再指定尺寸。
+ 主要方法: .resizable() + .frame()
+ 推荐方法: .resizable() + .scaledToFit() / .scaledToFill()

### Animation 四种函数的效果区别
+ `.linear`匀速
+ `.easeIn`加速（先慢后快）
+ `.easeOut`减速（先快后慢）
+ `.easeInOut`慢快慢（开始慢，中间快，结束慢）

### 饱和度修饰符 .saturation
有时会使用`.opacity`透明度修饰符来实现 disabled 样式效果，而`.saturation`的区别是会直接将一个原色的饱和度变灰。

+ `.saturation(0)`: **失去色彩**。视图变得不透明但**是灰色的**。**看不到**它后面的内容。
+ `.opacity(0)`: **失去可见度**。视图变得**完全透明**，最终消失。**能看到**它后面的内容。

```swift
let isButtonDisabled = true

Button(action: {}) {
    Image("MyColorfulIcon")
    .resizable()
    .frame(width: 40, height: 40)
}
.disabled(isButtonDisabled)
// 当按钮禁用时，饱和度为0（灰色）；启用时，饱和度为1（原色）
.saturation(isButtonDisabled ? 0 : 1) 
```

### 如何添加圆角样式
+ `.cornerRadius(_:)`**(旧方法)**: 这是一个简单的“快捷方式”。它在内部实际上做了两件事：给视图添加了一个矩形背景，然后把这个整体裁剪成圆角。这种方式不够灵活。
+ `.clipShape(_:)`** (新方法)**: 这是一个更纯粹、更强大的“裁剪”工具。它只做一件事：用你提供的任何形状（Shape）来作为“面具”或“剪刀”，将视图裁剪成这个形状。它不会自动添加背景。

### 如何获取主色
方法一：

```swift
// 声明
extension Color {
    static let primaryAccent = Color("AccentColor")
}

// 调用
.background(isThinking ? .primaryAccent : Color.white.opacity(0.12))
```

方法二：

```swift
Color.accentColor
```

方法三（快速但不推荐）：

```swift
Color("AccentColor")
```

### .accentColor 和 AccentColor 的区别是什么
+ AccentColor 是你在 Asset Catalog 中定义的一个**有特殊名字的颜色**。SwiftUI 会自动把它识别为整个 App 的**默认主题色**。
+ Color.accentColor 或其简写形式 .accent 是 SwiftUI 提供的一个**便利的静态属性**，它就是专门用来读取 AccentColor 这个 Color Set 的。

以下三种写法在效果上是**完全等价:**

```swift
// 1. 使用便利的 .accent 简写 (最常用)
.tint(.accent)

// 2. 使用完整的静态属性名
.tint(Color.accentColor)

// 3. 直接通过名字从 Asset Catalog 加载 (和加载其他自定义颜色一样)
.tint(Color("AccentColor"))
```

### .tint() 和 .foregroundColor() 的区别是什么
+ `.tint()`** (主题色/强调色)**:
    - **作用于**：可交互的或有状态的控件，如 Button (某些样式)、Toggle、Slider、Link、Picker 等。
    - **行为**：它是一种“建议性”的颜色，控件会根据自己的样式来决定如何使用它（比如按钮的背景色、Toggle 的开关颜色）。
    - **继承性**：会被容器内的所有子视图继承。
+ `.foregroundColor()`** (前景内容色)**:
    - **作用于**：视图的前景内容，如 Text 的文字颜色、Image (SF Symbols) 的图标颜色、Shape 的填充/描边颜色。
    - **行为**：它是一种“强制性”的颜色，直接覆盖掉视图内容的颜色。
    - **继承性**：同样会被子视图继承。

### Rectangle 和 RoundedRectangle 的区别是什么
RoundedRectangle 可以修改圆角，而 Rectangle 四周永远是直角。后者通常搭配 `.contentShape()`实现扩大点击范围。如 .contentShape(Rectangle())

### cornerSize 和 cornerRadius 的区别是什么
+ **cornerRadius**: 创建的是**完美的圆形**拐角。
+ **cornerSize**: 创建的是**椭圆形**拐角，可以让你分别控制拐角的水平和垂直半径。

### 强烈不建议使用 `@FocusState` 作为额外状态管理
背景：有两个 TextField，一个可以输入内容（无法聚焦）另外一个可以输入内容（允许聚焦并且输入内容）。而这两个 TextField 可以进行切换展示。

问题：`@FocusState` 状态来作为布局切换的状态会出现状态同步不一致问题。例如无状态的TextFieldA 切换到 TextFieldB 时，虽然 TextFieldA 的点击事件执行了 FocusState = true，但是因为此时 TextFieldB 在页面不存在或者说还么未被渲染，导致SwiftUI匹配不到元素，最终FocusState = true 也执行失败。

解决：对于布局切换需要使用单独的`@State`状态来管理。

### 空间争夺问题
`.layoutPriority()`。数字（权重）越大越先执行。

### Spacer() 如何设置最小尺寸
```swift
Spacer(minLength: value)
```

### SwiftUI 如何获取 placeholder 颜色
```swift
Color(uiColor: .placeholderText)
```

### 对话输入框位置最佳实践
```swift
.safeAreaInset(edge: .bottom) {
    TextFiled()
        .padding()
}
```

### Pod 自定义命令引起 Xcode 沙箱报错问题
Xcode 14/15 引入了一项名为“用户脚本沙箱”（User Script Sandboxing）的新安全设置，并且默认是开启的。该设置会加强对 CocoaPods 等工具在构建期间运行的脚本的限制。

> Sandbox: rsync.samba（8361） deny（1） file-read-data /Users/resetsix/Library/Developer/Xcode/DerivedData/speech-demo-hlgkxvbwhlysedadgwpoyrbeoikj/Build/Products/Debug-iphonesimulator/XCFrameworklntermediates/MicrosoftCognitiveServicesSpeech-iOS/MicrosoftCognitiveServicesSpeech.framework/_CodeSignature
>

解决：禁用这个用户脚本沙箱功能。

Target - Build Settings - 搜索`User Script Sandboxing` - 将`YES`修改为`No`

![](/images/notes/2026/01/2026-01-11-04.png)

### 如何安装 Pod 和 Pod 依赖
+ 安装

```bash
# brew 方式

brew install cocoapods

# macOS 内置的 Ruby（RubyGems）

sudo gem install cocoapods

# 检查版本
pod --version
```

+ 初始化（项目内）

首先在项目根目录执行`pod init`（会自动生成`Podfile`文件），编辑该文件添加需要安装的依赖，然后执行`pod install`（会自动安装依赖和生成xxx.xcworkspace文件），最后通过双击`xxx.xcworkspace`文件启动项目就行。

```swift
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'xxx' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for xxx
  pod 'MicrosoftCognitiveServicesSpeech-iOS', '~> 1.43.0' // 添加这行，这样写就行

end
```

添加和删除依赖的方式就是有无`pod '依赖名称', '~> version'`，然后重新执行`pod install`即可。

### 如何指定某个元素的主题
接收类型：ColorScheme，可选值：`.lighe`、`.dark`

```swift
.preferredColorScheme(ColorScheme.dark)
```

### 文本对齐方式失效
文本对齐有三种方式

+ `VStack`、`HStack` 的 `.alignment`
+ `frame` 的 `.alignment`
+ `.multilineTextAlignmen`

### fade 修饰符
淡入效果

### 判断url是否有效
```swift
if let url = URL(string: baseURL) {
    Link(destination: url) {
        Text(result.url)
    }
} else {
    Text("Invalid link")
    .foregroundColor(.gray)
}
```

### 实现骨架屏渐变
```swift
struct PromptRowSkeletonView: View {
    var body: some View {
        HStack(spacing: 8) {
            Circle()
            .fill(Color.gray.opacity(0.3))
            .frame(width: 30, height: 30)

            VStack(alignment: .leading, spacing: 4) {
                RoundedRectangle(cornerRadius: 4)
                .fill(Color.gray.opacity(0.3))
                .frame(height: 16)
                .frame(maxWidth: .infinity, alignment: .leading)

                RoundedRectangle(cornerRadius: 4)
                .fill(Color.gray.opacity(0.3))
                .frame(width: 150, height: 12)
            }
            Spacer()

            RoundedRectangle(cornerRadius: 4)
            .fill(Color.gray.opacity(0.3))
            .frame(width: 14, height: 18)
        }
        .padding()
        .background(Color(white: 0.1))
        .cornerRadius(20)
    }
}

/// 包含动画效果的列表骨架屏
struct AnimatedPromptsListSkeletonView: View {
    @State private var isAnimating = false

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                ForEach(0..<6, id: \.self) { _ in
                                            PromptRowSkeletonView()
                                           }
            }
        }
        .opacity(isAnimating ? 0.6 : 1.0)
        .onAppear {
            withAnimation(.easeInOut(duration: 1.0).repeatForever()) {
                isAnimating.toggle()
            }
        }
    }
}
```

### enumerated() 方法使用
`for`循环用来遍历集合中的每个 value

`enumerated`可以得到 index 和 value

```swift
let fruits = ["Apple", "Banana", "Cherry"]

for fruit in fruits {
    print(fruit)
}
// 输出:
// Apple
// Banana
// Cherry

for (index, fruit) in fruits.enumerated() {
    print("Item \(index): \(fruit)")
}
// 输出:
// Item 0: Apple
// Item 1: Banana
// Item 2: Cherry
```

### 视图封装
```swift
// func build 写法
@ViewBuilder
func SettingSection(title: String, content: () -> some View) -> some View {
    VStack {
        Text(title)
        content()
    }
}

// struct 写法
struct SettingSection<Content: View>: View {
    let title: String
    let content: () -> Content

    init(title: String, @ViewBuilder content: @escaping () -> Content) {
        self.title = title
        self.content = content
    }

    var body: some View {
        VStack {
            Text(title)
            content()
        }
    }
}
```

### release 打包找不到 info.plist
参考本 文章第十条 和 [Xcode13 “消失”的Info.plist文件 ](https://juejin.cn/post/7086437261755203591)

最开始遇到的问题是 release 模式下使用非 https 请求失败，修改了`App Transport Security Settings`之后却还是未解决，最后才发现 xcode13 之后的新项目是在项目构建的实际自动生成 info.plist 文件，而在配置中仅配置了 debug 下的 info.plist 文件路径，补充上就好了。

![](/images/notes/2026/01/2026-01-11-05.png)

另外发现 xcode13 之后有 info.plist 文件是否自动合成的开关，默认是 true。如果需要手动管理修改为 false 就好了。

![](/images/notes/2026/01/2026-01-11-06.png)

###  如何根据文本行数固定宽度
使用`.frame(minHeight: UIFont.preferredFont(forTextStyle: UIFont.TextStyle).lineHeight * 行数)`

例如：统一固定为`.footnote`字体大小的的两行高度

```swift
Text(name)
.frame(minHeight: 24)
.font(.footnote)
.foregroundColor(.white)
.multilineTextAlignment(.center)
.frame(minHeight: UIFont.preferredFont(forTextStyle: .footnote).lineHeight * 2)
```

### SF图标分层渲染
+ **统一颜色** → `foregroundColor`
+ **双色/多层颜色** → `.symbolRenderingMode(.palette) + foregroundStyle`
+ **自动层次感** → `.symbolRenderingMode(.hierarchical)`
+ **系统多色** → `.symbolRenderingMode(.multicolor)`
+ **完全自定义** → 用 `ZStack` 或渐变 / 材质

```swift
Image(systemName: "xmark.circle.fill")
.symbolRenderingMode(.palette)
.foregroundStyle(.black, .white) 
```

### 文本内容选择与分享
```swift
.textSelection(.enabled)
```

### 使用.monospacedDigit()固定字符宽度
使用场景：计数器、时间显示、倒计时等。

原理：不同数字所占据的宽度不同，让数字使用等宽字体统一实际宽度。

### 'windows' was deprecated in iOS 15.0: Use UIWindowScene.windows on a relevant window scene instead
+ [参考](https://stackoverflow.com/questions/71538885/why-it-is-throw-an-error-as-windows-was-deprecated-in-ios-15-0-use-uiwindows)

```swift
// old
.padding(.top, UIApplication.shared.windows.first?.safeAreaInsets.top ?? 0)

// new
.padding(.top,UIApplication.shared.connectedScenes.flatMap { ($0 as? UIWindowScene)?.windows ?? [] }.first { $0.isKeyWindow }?.safeAreaInsets.top)
```