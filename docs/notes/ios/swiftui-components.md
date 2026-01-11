---
title: SwiftUI 组件指南
createTime: 2025/03/04 22:59:32
permalink: /ios/swiftui-components/
---

## 核心布局组件 (iOS 13+)
### VStack 垂直堆栈
```swift
// 垂直堆栈 (iOS 13+)
VStack { /* 内容 */ }                   // 默认参数
VStack(alignment: .leading) {           // 可选参数：alignment（对齐方式，默认.center）
    /* 内容 */
}
VStack(alignment: .leading, spacing: 10) { // 可选参数：spacing（元素间距，默认nil）
    /* 内容 */
}

// alignment参数可选值:
// .center         // 居中对齐（默认值）
// .leading        // 左对齐
// .trailing       // 右对齐
// .firstTextBaseline  // 首行文本基线对齐
// .lastTextBaseline   // 末行文本基线对齐
```

### HStack 水平堆栈
```swift
// 水平堆栈 (iOS 13+)
HStack { /* 内容 */ }                   // 默认参数
HStack(alignment: .top) {               // 可选参数：alignment（对齐方式，默认.center）
    /* 内容 */
}
HStack(alignment: .top, spacing: 10) {  // 可选参数：spacing（元素间距，默认nil）
    /* 内容 */
}

// alignment参数可选值:
// .center         // 居中对齐（默认值）
// .top            // 顶部对齐
// .bottom         // 底部对齐
// .firstTextBaseline  // 首行文本基线对齐
// .lastTextBaseline   // 末行文本基线对齐
```

### ZStack 层叠堆栈
```swift
// 层叠堆栈 (iOS 13+)
ZStack { /* 内容 */ }                   // 默认参数
ZStack(alignment: .topLeading) {        // 可选参数：alignment（对齐方式，默认.center）
    /* 内容 */
}

// alignment参数可选值:
// .center         // 居中对齐（默认值）
// .topLeading     // 左上对齐
// .top            // 顶部居中对齐
// .topTrailing    // 右上对齐
// .leading        // 左侧居中对齐
// .trailing       // 右侧居中对齐
// .bottomLeading  // 左下对齐
// .bottom         // 底部居中对齐
// .bottomTrailing // 右下对齐
```

### Spacer 空白占位符
```swift
// 空白占位符 (iOS 13+)
Spacer()                                // 默认参数
Spacer(minLength: 20)                   // 可选参数：minLength（最小长度，默认nil）

// minLength参数:
// nil             // 使用系统默认最小长度（默认值）
// 正数值          // 指定最小长度
```

### Divider 分隔线
```swift
// 分隔线 (iOS 13+)
Divider()                               // 无参数

// 常用修饰:
// .background(Color.red)               // 自定义颜色
// .frame(height: 2)                    // 自定义高度
```

### ScrollView 滚动视图
```swift
// 滚动视图 (iOS 13+)
ScrollView { /* 内容 */ }               // 默认参数（垂直滚动）
ScrollView(.horizontal) { /* 内容 */ }  // 可选参数：axes（滚动方向，默认.vertical）
ScrollView([.horizontal, .vertical], showsIndicators: false) { // 完整参数
    /* 内容 */
}

// axes参数可选值:
// .vertical              // 垂直滚动（默认值）
// .horizontal            // 水平滚动
// [.horizontal, .vertical] // 双向滚动

// showsIndicators参数可选值:
// true                   // 显示滚动指示器（默认值）
// false                  // 隐藏滚动指示器
```

### ScrollViewReader 控制滚动位置
```swift
// 控制滚动视图的滚动位置
ScrollViewReader { proxy in                         // 基本用法：提供滚动控制代理
    VStack {
        Button("滚动到项目 10") {
            withAnimation {                         // 可选：添加动画
                proxy.scrollTo(10, anchor: .top)    // 控制滚动到特定 ID 的项目
            }
        }
        
        ScrollView {
            ForEach(1...100, id: \.self) { i in
                Text("项目 \(i)")
                    .id(i)                         // 设置视图 ID 用于滚动定位
                    .frame(height: 50)
            }
        }
    }
}

// content 参数 (@ViewBuilder (ScrollViewProxy) -> Content): (必须)
// 闭包接收一个 ScrollViewProxy 实例，用于控制 ScrollView 的滚动。

// ScrollViewProxy 主要方法:
// scrollTo<ID>(_ id: ID, anchor: UnitPoint? = nil) 
// 滚动到特定 ID 的视图位置，可选参数 anchor 指定对齐位置。

// anchor 参数常用值:
// .top, .bottom, .center   // 顶部、底部、中心对齐

// iOS 版本兼容性: iOS 14+
```

### GeometryReader几何尺寸读取容器
```swift
// 几何尺寸读取容器
GeometryReader { geometry in                       // 基本用法：获取可用空间尺寸
    Circle()
        .frame(width: geometry.size.width * 0.8)  // 使用可用宽度的 80%
        .position(x: geometry.frame(in: .local).midX,
                 y: geometry.frame(in: .local).midY) // 居中定位
}

// content 参数 (@ViewBuilder (GeometryProxy) -> Content): (必须)
// 闭包接收一个 GeometryProxy 实例，提供环境几何信息。

// GeometryProxy 主要属性:
// size: CGSize                      // 可用空间的大小
// safeAreaInsets: EdgeInsets        // 安全区域边距

// GeometryProxy 主要方法:
// frame(in: CoordinateSpace) -> CGRect // 获取在特定坐标空间的框架矩形

// CoordinateSpace 常用值:
// .local                // 本地坐标系（相对于 GeometryReader）
// .global               // 全局坐标系（相对于屏幕）
// .named(String)        // 命名坐标系

// iOS 版本兼容性: iOS 13+
```

### GeometryReader 几何读取器
```swift
// 几何读取器 (iOS 13+)
GeometryReader { geometry in            // 必需参数：geometry（GeometryProxy对象）
    Text("宽度: \(geometry.size.width)")
}

// geometry提供的信息:
// geometry.size          // 容器尺寸 (CGSize)
// geometry.safeAreaInsets // 安全区域边距 (EdgeInsets)
// geometry.frame(in: .global) // 在指定坐标空间中的框架 (CGRect)
```

## 基础文本与显示组件 (iOS 13+)
### Text 文本
```swift
// 文本 (iOS 13+)
Text("Hello World")                     // 基本文本
Text("Hello\nWorld")                    // 多行文本
Text("Price: \(price, specifier: "%.2f")") // 格式化文本
Text(verbatim: "Raw String")            // 不本地化的原始文本
Text(LocalizedStringKey("welcome"))     // 本地化文本

// 文本修饰符:
// .font(.title)           // 设置字体
// .foregroundColor(.blue) // 设置前景色
// .bold()                 // 粗体
// .italic()               // 斜体
// .lineLimit(2)           // 行数限制
// .multilineTextAlignment(.center) // 多行对齐
```

### Label 标签
```swift
// 标签 (iOS 14+)
Label("标题", systemImage: "star")       // 系统图标标签
Label("标题", image: "custom_icon")      // 自定义图片标签
Label {                                 // 自定义内容标签
    Text("自定义标题")
} icon: {
    Image(systemName: "star.fill")
}

// 标签修饰符:
// .labelStyle(.titleOnly)  // 仅显示标题
// .labelStyle(.iconOnly)   // 仅显示图标
// .labelStyle(.titleAndIcon) // 同时显示标题和图标（默认值）
```

### Image 图片
```swift
// 图片 (iOS 13+)
Image("imageName")                      // 应用资源图片
Image(systemName: "star")               // 系统SF Symbols图标
Image(uiImage: uiImage)                 // UIKit图片
Image(decorative: "imageName")          // 装饰性图片（辅助功能会忽略）

// 图片修饰符:
// .resizable()            // 允许调整大小
// .aspectRatio(contentMode: .fit) // 内容模式（.fit 或 .fill）
// .frame(width: 100, height: 100) // 指定尺寸
// .clipShape(Circle())    // 裁剪形状
```

### AsyncImage 异步图片
```swift
// 异步图片 (iOS 15+)
AsyncImage(url: URL(string: "https://example.com/image.jpg")) // 基本用法
AsyncImage(url: url, scale: 2.0)        // 设置图片缩放比例
AsyncImage(url: url) { phase in         // 完整阶段处理
    switch phase {
    case .empty: ProgressView()
    case .success(let image): image.resizable()
    case .failure: Image(systemName: "exclamationmark.triangle")
    @unknown default: EmptyView()
    }
}

// scale参数:
// 1.0                    // 标准比例（默认值）
// 2.0                    // Retina显示
// 3.0                    // Super Retina显示
```

## 输入与交互组件 (iOS 13+)
### Button 按钮
```swift
// 按钮 (iOS 13+)
Button("点击") { /* 动作 */ }            // 基本按钮
Button(action: { /* 动作 */ }) {         // 自定义内容按钮
    HStack {
        Image(systemName: "plus")
        Text("添加")
    }
}
Button(role: .destructive) {             // 带角色的按钮 (iOS 15+)
    /* 动作 */
} label: {
    Text("删除")
}

// role参数可选值 (iOS 15+):
// nil                    // 普通按钮（默认值）
// .destructive           // 破坏性操作（通常显示为红色）
// .cancel                // 取消操作

// 按钮样式:
// .buttonStyle(.automatic) // 自动样式（默认值）
// .buttonStyle(.plain)     // 朴素样式
// .buttonStyle(.bordered)  // 带边框样式 (iOS 15+)
// .buttonStyle(.borderedProminent) // 突出带边框样式 (iOS 15+)
```

### TextField 文本输入框
```swift
// 文本输入框 (iOS 13+)
TextField("用户名", text: $username)     // 基本输入框
TextField("用户名", text: $username, prompt: Text("请输入")) // 带提示文本 (iOS 15+)
TextField("数值", value: $number, format: .number) // 数值输入框 (iOS 15+)

// 文本输入框修饰符:
// .textFieldStyle(.roundedBorder) // 圆角边框样式
// .keyboardType(.emailAddress)    // 键盘类型
// .textContentType(.username)     // 内容类型（用于自动填充）
// .disableAutocorrection(true)    // 禁用自动更正
// .focused($focusField)           // 焦点状态 (iOS 15+)
```

### SecureField 安全输入框
```swift
// 安全输入框 (iOS 13+)
SecureField("密码", text: $password)     // 基本安全输入框
SecureField("密码", text: $password, prompt: Text("请输入密码")) // 带提示 (iOS 15+)

// 安全输入框修饰符与TextField相同
```

### Toggle 开关
```swift
// 开关 (iOS 13+)
Toggle("启用通知", isOn: $isNotificationEnabled) // 基本开关
Toggle(isOn: $isEnabled) {               // 自定义标签开关
    HStack {
        Image(systemName: "bell")
        Text("通知")
    }
}

// 开关样式:
// .toggleStyle(.automatic) // 自动样式（默认值）
// .toggleStyle(.switch)    // 滑动开关样式
// .toggleStyle(.button)    // 按钮样式
// .toggleStyle(.checkbox)  // 复选框样式（macOS）
```

### 弹出框和模态视图
```swift
// Popover 弹出框
.popover(isPresented: $isShowingPopover) {
    VStack {
        Text("弹出框内容")
        Button("关闭") { isShowingPopover = false }
    }
    .padding()
}

// 全屏覆盖 (iOS 14+)
.fullScreenCover(isPresented: $isShowingFullScreen) {
    FullScreenView()
        .edgesIgnoringSafeArea(.all)
}
```

### 值选择器
```swift
// Slider 滑块 (iOS 13+)
Slider(value: $volume)                   // 基本滑块（范围0-1）
Slider(value: $volume, in: 0...100)      // 自定义范围滑块
Slider(value: $volume, in: 0...100, step: 5) // 带步长的滑块
Slider(value: $volume, in: 0...100) {    // 带标签的滑块
    Text("音量")
} minimumValueLabel: {
    Text("0")
} maximumValueLabel: {
    Text("100")
}

// 滑块修饰符:
// .accentColor(.red)      // 滑块颜色
// .disabled(true)         // 禁用状态

// Stepper 步进器 (iOS 13+)
Stepper("数量: \(quantity)", value: $quantity) // 基本步进器
Stepper("数量: \(quantity)", value: $quantity, in: 1...10) // 带范围的步进器
Stepper("数量: \(quantity)", value: $quantity, in: 1...10, step: 2) // 带步长的步进器
Stepper {                               // 自定义动作步进器
    quantity += 1
} onDecrement: {
    quantity -= 1
} label: {
    Text("数量: \(quantity)")
}

// 日期选择器 (iOS 13+)
DatePicker("日期", selection: $date)      // 基本日期选择器
DatePicker("日期", selection: $date, displayedComponents: .date) // 仅日期
DatePicker("时间", selection: $date, displayedComponents: .hourAndMinute) // 仅时间
DatePicker("日期范围", selection: $date, in: ...Date()) // 带日期范围（过去日期）

// displayedComponents参数可选值:
// [.date, .hourAndMinute] // 日期和时间（默认值）
// .date                   // 仅日期
// .hourAndMinute          // 仅时间

// 日期选择器样式:
// .datePickerStyle(.automatic) // 自动样式（默认值）
// .datePickerStyle(.graphical) // 图形化样式 (iOS 14+)
// .datePickerStyle(.wheel)     // 滚轮样式
// .datePickerStyle(.compact)   // 紧凑样式 (iOS 14+)
```

### Picker 选择器与颜色选择器
```swift
// 选择器 (iOS 13+)
Picker("选择颜色", selection: $selectedColor) { // 基本选择器
    Text("红色").tag(Color.red)
    Text("蓝色").tag(Color.blue)
    Text("绿色").tag(Color.green)
}
Picker(selection: $selectedOption, label: Text("选项")) { // 带动态选项的选择器
    ForEach(options, id: \.self) { option in
        Text(option).tag(option)
    }
}

// 选择器样式:
// .pickerStyle(.automatic)     // 自动样式（默认值）
// .pickerStyle(.menu)          // 菜单样式 (iOS 14+)
// .pickerStyle(.segmented)     // 分段控制样式
// .pickerStyle(.wheel)         // 滚轮样式
// .pickerStyle(.inline)        // 内联样式 (iOS 14+)
// .pickerStyle(.navigationLink) // 导航链接样式

// 颜色选择器 (iOS 14+)
ColorPicker("选择颜色", selection: $selectedColor) // 基本颜色选择器
ColorPicker("选择颜色", selection: $selectedColor, supportsOpacity: false) // 不支持透明度

// supportsOpacity参数可选值:
// true                   // 支持透明度（默认值）
// false                  // 不支持透明度
```

## 容器与导航组件 (iOS 13+)
### List 列表
```swift
// 列表 (iOS 13+)
List {                                   // 静态列表
    Text("项目1")
    Text("项目2")
    Text("项目3")
}
List(items) { item in                    // 动态列表
    Text(item.name)
}
List {                                   // 分组列表
    Section(header: Text("A组")) {
        Text("A1")
        Text("A2")
    }
    Section(header: Text("B组")) {
        Text("B1")
        Text("B2")
    }
}
List(items, selection: $selection) { item in // 支持选择的列表
    Text(item.name)
}

// 列表样式:
// .listStyle(.automatic)      // 自动样式（默认值）
// .listStyle(.plain)          // 朴素样式
// .listStyle(.grouped)        // 分组样式
// .listStyle(.inset)          // 嵌入样式 (iOS 14+)
// .listStyle(.insetGrouped)   // 嵌入分组样式
// .listStyle(.sidebar)        // 侧边栏样式 (iOS 14+)
```

### ForEach 循环
```swift
// 循环 (iOS 13+)
ForEach(items) { item in                // 对符合Identifiable的集合进行循环
    Text(item.name)
}
ForEach(items, id: \.id) { item in      // 指定id的循环
    Text(item.name)
}
ForEach(0..<5) { index in               // 范围循环
    Text("项目 \(index)")
}
```

### Form 表单
```swift
// 表单 (iOS 13+)
Form {                                   // 基本表单
    TextField("用户名", text: $username)
    SecureField("密码", text: $password)
    Toggle("记住我", isOn: $rememberMe)
}
Form {                                   // 分组表单
    Section(header: Text("账户信息")) {
        TextField("用户名", text: $username)
        SecureField("密码", text: $password)
    }
    Section(header: Text("设置")) {
        Toggle("记住我", isOn: $rememberMe)
        Toggle("通知", isOn: $notificationEnabled)
    }
}

// 表单样式:
// .formStyle(.automatic)      // 自动样式（默认值）
// .formStyle(.grouped)        // 分组样式
// .formStyle(.columns)        // 多列样式 (iOS 16+)
```

### 导航组件
```swift
// NavigationLink (iOS 13+)
NavigationLink("标签文本", destination: DetailView()) // 基本用法
NavigationLink(destination: DetailView()) {          // 自定义标签视图
    Label("详情", systemImage: "info.circle")
}
NavigationLink("标签", isActive: $isLinkActive) {     // 可编程激活
    DetailView()
}

// 新版导航链接 (iOS 16+)
NavigationLink("用户 A", value: User(id: "A"))     // 基于值的链接
NavigationLink(value: SettingsScreenData()) {      // 自定义标签视图
    Label("设置", systemImage: "gear")
}

// NavigationView (iOS 13+)
NavigationView {
    List {
        NavigationLink("详情1") {
            Text("详情内容1")
        }
    }
    .navigationTitle("列表")
    .toolbar {
        ToolbarItem(placement: .navigationBarTrailing) {
            Button(action: { /* 动作 */ }) {
                Image(systemName: "plus")
            }
        }
    }
}

// NavigationStack (iOS 16+)
NavigationStack {
    List {
        NavigationLink("用户 A", value: User(id: "A"))
        NavigationLink("设置项 1", value: 1)
    }
    .navigationTitle("主页")
    .navigationDestination(for: User.self) { user in 
        UserDetailView(user: user)
    }
    .navigationDestination(for: Int.self) { settingId in 
        SettingDetailView(id: settingId)
    }
}
```

### TabView 标签视图
```swift
// 标签视图 (iOS 13+)
TabView {                                // 基本标签视图
    Text("首页")
        .tabItem {
            Image(systemName: "house")
            Text("首页")
        }
    Text("设置")
        .tabItem {
            Image(systemName: "gear")
            Text("设置")
        }
}
TabView(selection: $selectedTab) {       // 带选择的标签视图
    Text("首页")
        .tabItem {
            Image(systemName: "house")
            Text("首页")
        }
        .tag(0)
    Text("设置")
        .tabItem {
            Image(systemName: "gear")
            Text("设置")
        }
        .tag(1)
}

// 标签视图样式:
// .tabViewStyle(.automatic)   // 自动样式（默认值）
// .tabViewStyle(.page)        // 页面样式
// .tabViewStyle(.page(indexDisplayMode: .always)) // 始终显示索引
```

### Group 与 GroupBox
```swift
// Group 逻辑分组 (iOS 13+)
Group {
    Text("项目1")
    Text("项目2")
    // 最多可添加10个项目，Group可以打破这个限制
}

// GroupBox 分组框 (iOS 14+)
GroupBox {
    Text("内容")
}
GroupBox(label: Label("标题", systemImage: "star")) {
    VStack(alignment: .leading) {
        Text("内容行1")
        Text("内容行2")
    }
}
```

## iOS 14+ 组件
### LazyVStack 与 LazyHStack
```swift
// 懒加载垂直堆栈 (iOS 14+)
LazyVStack { /* 内容 */ }                // 基本用法
LazyVStack(alignment: .leading, spacing: 10) { // 带参数
    /* 内容 */
}
LazyVStack(alignment: .leading, spacing: 10, pinnedViews: [.sectionHeaders]) { // 带固定视图
    Section(header: Text("标题")) {
        /* 内容 */
    }
}

// 懒加载水平堆栈 (iOS 14+)
LazyHStack { /* 内容 */ }                // 基本用法
LazyHStack(alignment: .top, spacing: 10) { // 带参数
    /* 内容 */
}
LazyHStack(alignment: .top, spacing: 10, pinnedViews: [.sectionHeaders]) { // 带固定视图
    Section(header: Text("标题")) {
        /* 内容 */
    }
}

// pinnedViews参数可选值:
// []                     // 不固定任何视图（默认值）
// [.sectionHeaders]      // 固定区块头部
// [.sectionFooters]      // 固定区块底部
// [.sectionHeaders, .sectionFooters] // 同时固定头部和底部
```

### LazyVGrid 与 LazyHGrid
```swift
// 懒加载垂直网格 (iOS 14+)
let columns = [
    GridItem(.flexible()),
    GridItem(.flexible())
]
LazyVGrid(columns: columns) {            // 基本用法
    ForEach(1...10, id: \.self) { item in
        Text("\(item)")
    }
}
LazyVGrid(columns: columns, spacing: 20) { // 带间距
    /* 内容 */
}
LazyVGrid(columns: columns, alignment: .leading, spacing: 20) { // 完整参数
    /* 内容 */
}

// 懒加载水平网格 (iOS 14+)
let rows = [
    GridItem(.fixed(50)),
    GridItem(.fixed(50))
]
LazyHGrid(rows: rows) {                  // 基本用法
    ForEach(1...10, id: \.self) { item in
        Text("\(item)")
    }
}
LazyHGrid(rows: rows, spacing: 20) {     // 带间距
    /* 内容 */
}
LazyHGrid(rows: rows, alignment: .top, spacing: 20) { // 完整参数
    /* 内容 */
}

// GridItem参数可选值:
// .fixed(100)            // 固定宽度
// .flexible(minimum: 100, maximum: 200) // 灵活宽度带最小/最大值
// .adaptive(minimum: 100, maximum: .infinity) // 自适应宽度
```

### ProgressView 进度视图
```swift
// 进度视图 (iOS 14+)
ProgressView()                           // 不确定进度的活动指示器
ProgressView("加载中...")                // 带标题的活动指示器
ProgressView(value: progress)            // 确定进度的进度条
ProgressView(value: progress, total: 100) // 指定总量
ProgressView(value: progress) {          // 带标签的进度条
    Text("下载中")
} currentValueLabel: {
    Text("\(Int(progress))%")
}

// 进度视图样式:
// .progressViewStyle(.automatic) // 自动样式（默认值）
// .progressViewStyle(.linear)    // 线性进度条
// .progressViewStyle(.circular)  // 圆形活动指示器
```

### Link 链接与菜单
```swift
// 链接 (iOS 14+)
Link("Apple官网", destination: URL(string: "https://apple.com")!) // 基本链接
Link(destination: URL(string: "https://apple.com")!) { // 自定义内容链接
    HStack {
        Image(systemName: "link")
        Text("访问网站")
    }
}

// 菜单 (iOS 14+)
Menu("选项") {                           // 基本菜单
    Button("选项1") { /* 动作 */ }
    Button("选项2") { /* 动作 */ }
    Menu("子菜单") {                      // 嵌套菜单
        Button("子选项1") { /* 动作 */ }
        Button("子选项2") { /* 动作 */ }
    }
}
Menu {                                   // 自定义标签菜单
    Button("选项1") { /* 动作 */ }
    Button("选项2") { /* 动作 */ }
} label: {
    Label("更多", systemImage: "ellipsis.circle")
}
```

### VideoPlayer 视频播放器
```swift
// 视频播放器 (iOS 14+)
VideoPlayer(player: AVPlayer(url: videoURL))
VideoPlayer(player: player, videoOverlay: {
    VStack {
        Spacer()
        Text("自定义控制").padding()
    }
})
```

## iOS 15+ 组件
### Canvas 绘图画布
```swift
// 绘图画布 (iOS 15+)
Canvas { context, size in                // 基本绘图画布
    context.stroke(
        Path(ellipseIn: CGRect(origin: .zero, size: size)),
        with: .color(.blue),
        lineWidth: 2
    )
}
Canvas { context, size in                // 完整绘图示例
    let rect = CGRect(origin: .zero, size: size)
    context.fill(Path(rect), with: .color(.white))
    context.draw(Text("Hello"), at: CGPoint(x: size.width/2, y: size.height/2))
    context.stroke(
        Path(roundedRect: rect.insetBy(dx: 5, dy: 5), cornerRadius: 10),
        with: .color(.blue),
        lineWidth: 3
    )
}
.frame(width: 200, height: 100)
```

### TimelineView 时间线视图
```swift
// 时间线视图 (iOS 15+)
TimelineView(.animation) { timeline in   // 基本时间线视图
    Text("\(timeline.date)")
}
TimelineView(.periodic(from: Date(), by: 1.0)) { timeline in // 定期更新的时间线
    Text("\(timeline.date.formatted(date: .omitted, time: .standard))")
}
TimelineView(.everyMinute) { timeline in // 每分钟更新
    Text("\(timeline.date, format: .dateTime)")
}

// schedule参数可选值:
// .animation              // 随动画更新（默认值）
// .everyMinute            // 每分钟更新
// .periodic(from:by:)     // 指定间隔更新
// .explicit([Date])       // 在指定时间点更新
```

### 确认对话框 (替代ActionSheet)
```swift
// 确认对话框 (iOS 15+)
.confirmationDialog("操作标题", isPresented: $isShowingDialog, titleVisibility: .visible) {
    Button("选项一") { /* action */ }
    Button("选项二") { /* action */ }
    Button("删除", role: .destructive) { /* action */ }
    Button("取消", role: .cancel) { /* 可选，默认提供 */ }
} message: {
    Text("请选择一个操作。")
}

// titleVisibility参数可选值:
// .automatic           // 系统决定是否显示标题 (默认)
// .visible             // 始终显示标题
// .hidden              // 始终隐藏标题
```

### Alert 新语法
```swift
// 新版 Alert (iOS 15+)
.alert("标题", isPresented: $isShowing) {
    Button("确认") { /* action */ }
    Button("取消", role: .cancel) {}
} message: {
    Text("这是详细消息内容。")
}
.alert("标题", isPresented: $isShowing, presenting: dataOptional) { data in
    Button("处理 \(data.name)") {}
    Button("忽略", role: .cancel) {}
} message: { data in
    Text("关于 \(data.name) 的信息。")
}
```

### ControlGroup 控件组
```swift
// 控件分组 (iOS 15+)
ControlGroup {
    Button("保存") { /* 动作 */ }
    Button("取消") { /* 动作 */ }
}
ControlGroup("操作") {
    Button("编辑") { /* 动作 */ }
    Button("分享") { /* 动作 */ }
}
.controlGroupStyle(.navigation) // 导航样式
```

## iOS 16+ 组件
### ShareLink 分享链接
```swift
// 分享链接 (iOS 16+)
ShareLink(item: URL(string: "https://apple.com")!)   // 基本用法
ShareLink("分享图片", item: imageToShare)              // 自定义文本标签
ShareLink(item: textToShare, subject: Text("重要信息"), message: Text("请查看这条消息")) // 添加主题和消息
ShareLink {
    Label("分享", systemImage: "square.and.arrow.up")
} item: {
    // 支持动态生成要分享的内容
    return URLShareItem(url: generatedURL())
}
```

### NavigationStack 新导航堆栈
```swift
// 导航堆栈容器 (iOS 16+)
NavigationStack {
    List {
        NavigationLink("用户 A", value: User(id: "A"))
        NavigationLink("设置项 1", value: 1)
    }
    .navigationTitle("主页")
    .navigationDestination(for: User.self) { user in 
        UserDetailView(user: user)
    }
    .navigationDestination(for: Int.self) { settingId in 
        SettingDetailView(id: settingId)
    }
}

// 带路径绑定的导航堆栈
NavigationStack(path: $navigationPath) {
    // ... 同上 ...
}
```

### Table 表格
```swift
// 表格视图 (iOS 16+)
Table(items) {
    TableColumn("标题", value: \.title)
    TableColumn("日期") { item in
        Text(item.date, format: .dateTime)
    }
}
Table(selection: $selection) {
    TableColumn("名称", value: \.name)
    TableColumn("值", value: \.value)
} rows: {
    ForEach(items) { item in
        TableRow(item)
    }
}
```

### Grid 网格布局
```swift
// 网格布局 (iOS 16+)
Grid {
    GridRow {
        Text("标题1")
        Text("标题2")
    }
    Divider()
    GridRow {
        Text("内容1")
        Text("内容2")
    }
}
Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 10) {
    // ... 网格内容 ...
}
```

## 常见UI模式与弹出组件
### Sheet 模态工作表
```swift
// 模态工作表 (iOS 13+)
.sheet(isPresented: $isShowingSheet, onDismiss: { /* dismiss action */ }) {
    MySheetView()
}
.sheet(item: $sheetItem, onDismiss: { /* dismiss action */ }) { itemData in
    SheetViewForItem(item: itemData)
}
```

### ContextMenu 上下文菜单
```swift
// 上下文菜单 (iOS 13+)
.contextMenu {
    Button("复制") { /* action */ }
    Button("分享") { /* action */ }
    Button("删除", role: .destructive) {}
}
.contextMenu { /* ... */ } preview: {
    MyPreviewView()
        .frame(width: 200, height: 100)
}
```

### 可调整尺寸的模态视图
```swift
// 可调整尺寸的模态视图 (iOS 16+)
.sheet(isPresented: $showingSheet) {
    SheetView()
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
}
```

## 注意事项与最佳实践
使用SwiftUI组件时，请注意以下几点：

1. 版本兼容性 - 始终检查组件的iOS支持版本，特别是iOS 14+、15+和16+引入的新组件。
2. 性能考量 - 对于长列表或复杂内容，使用Lazy组件(LazyVStack, LazyHGrid等)避免出现性能问题。
3. 状态管理 - 合理使用@State、@Binding、@ObservedObject等状态管理方式。
4. 布局层次 - 避免过深的视图层次，这可能导致性能问题。
5. 导航变化 - 注意iOS 16引入的新导航API (NavigationStack)与旧版(NavigationView)的区别。
6. 适当的视图复用 - 将常用视图组件提取为独立函数或结构体。
7. 响应式设计 - 使用GeometryReader和环境值创建适应不同设备的界面。
