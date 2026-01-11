---
title: swiftui-navigation
createTime: 2026/01/11 14:41:03
permalink: /ios/swiftui-navigation/
---

## 一、界面与交互修饰符
### 1. 视图布局与外观
#### 基础布局修饰符
```swift
// 尺寸控制
.frame(width: 100, height: 50)           // 设置视图大小
.padding()                               // 添加默认内边距
.padding(.horizontal, 20)                // 添加特定方向内边距
.offset(x: 10, y: 20)                    // 位置偏移

// 外观控制
.background(.blue)                       // 设置背景色
.foregroundColor(.white)                 // 设置前景色
.cornerRadius(8)                         // 圆角
.border(.gray, width: 1)                 // 边框
.shadow(radius: 3)                       // 阴影

// 材质效果
.background(.ultraThinMaterial)          // 超薄材质背景
.background(.regularMaterial)            // 常规材质背景
.background(.thickMaterial)              // 厚材质背景
```

#### 可见性与透明度
```swift
.opacity(0.5)                            // 透明度
.hidden()                                // 隐藏视图但保留空间
.overlay(RoundedRectangle(cornerRadius: 5).stroke(.blue)) // 叠加层
.clipped()                               // 裁剪超出边界内容
.contentShape(Rectangle())               // 自定义点击区域形状
```

#### 缩放与旋转
```swift
.scaleEffect(1.2)                        // 缩放效果
.rotationEffect(.degrees(45))            // 旋转效果
.aspectRatio(contentMode: .fit)          // 宽高比模式
.scaledToFit()                           // 缩放以适应
.scaledToFill()                          // 缩放以填充
```

### 2. 导航与容器样式
#### 导航栏修饰符
```swift
// 导航标题
.navigationTitle("我的标题")                // 设置导航栏标题
.navigationBarTitleDisplayMode(.large)    // 标题显示模式 (.automatic/.inline/.large)
.navigationBarHidden(true)                // 隐藏导航栏

// 工具栏定制
.toolbar {                                // 定义工具栏内容
    ToolbarItem(placement: .navigationBarTrailing) {
        Button("保存") { /* 动作 */ }
    }
    ToolbarItemGroup(placement: .bottomBar) {
        Button("撤销") {}
        Spacer()
        Button("重做") {}
    }
}

// 常用工具栏位置:
// .navigationBarLeading    // 导航栏左侧
// .navigationBarTrailing   // 导航栏右侧
// .principal              // 导航栏中间
// .bottomBar              // 底部工具栏
// .keyboard               // 键盘区域 (iOS 15+)
```

#### 导航样式控制
```swift
// 导航视图样式
NavigationView { /* 内容 */ }
    .navigationViewStyle(.stack)          // 堆栈样式(默认)
    .navigationViewStyle(.columns)        // 分栏样式(iPad/Mac)

// 分栏导航 (iOS 16+)
NavigationSplitView { /* 侧边栏 */ } content: { /* 内容 */ } detail: { /* 详情 */ }
    .navigationSplitViewStyle(.balanced)  // 平衡样式
    .navigationSplitViewStyle(.prominentDetail) // 突出详情样式
```

#### 标签视图与分组
```swift
// 标签视图
TabView { /* 标签页内容 */ }
    .tabViewStyle(.page)                  // 页面式标签视图
    .tabViewStyle(.page(indexDisplayMode: .always)) // 显示页面指示器
    .indexViewStyle(.page(backgroundDisplayMode: .always)) // 页面索引样式

// 分组容器
GroupBox(label: Text("标题")) { /* 内容 */ }
    .groupBoxStyle(.automatic)            // 自动样式
```

### 3. 用户输入与表单
#### 文本输入控制
```swift
// 文本框样式
TextField("输入", text: $text)
    .textFieldStyle(.roundedBorder)       // 圆角边框样式
    .textInputAutocapitalization(.never)  // 自动大写模式
    .keyboardType(.emailAddress)          // 键盘类型
    .autocorrectionDisabled(true)         // 禁用自动更正
    .submitLabel(.search)                 // 提交按钮标签

// 焦点控制
@FocusState private var focused: Bool
TextField("输入", text: $text)
    .focused($focused)                    // 绑定焦点状态

// 安全文本输入
SecureField("密码", text: $password)       // 密码输入框

// 多行文本
TextEditor(text: $longText)
    .textEditorStyle(.plain)              // 文本编辑器样式(iOS 16+)
```

#### 表单与选择器
```swift
// 表单样式
Form { /* 表单内容 */ }
    .formStyle(.grouped)                  // 分组样式

// 日期选择器
DatePicker("选择日期", selection: $date)
    .datePickerStyle(.graphical)          // 图形化日期选择器
    .dateInputStyle(.field)               // 日期输入样式(iOS 17+)

// 选择器
Picker("选择", selection: $selection) { /* 选项 */ }
    .pickerStyle(.wheel)                  // 滚轮样式选择器
    
// 颜色选择器
ColorPicker("选择颜色", selection: $color)
```

#### 按钮与开关
```swift
// 按钮样式
Button("点击") { /* 动作 */ }
    .buttonStyle(.bordered)               // 带边框按钮样式
    .buttonStyle(.borderedProminent)      // 突出带边框样式
    .controlSize(.large)                  // 控件大小

// 开关样式
Toggle("开关", isOn: $isOn)
    .toggleStyle(.switch)                 // 滑动开关样式
    .toggleStyle(.button)                 // 按钮式开关
```

### 4. 手势与交互控制
#### 基础手势
```swift
// 点击手势
.onTapGesture { /* 点击操作 */ }           // 单击手势
.onTapGesture(count: 2) { /* 操作 */ }     // 双击手势
.onLongPressGesture { /* 长按操作 */ }     // 长按手势
.onLongPressGesture(minimumDuration: 1.5) { /* 操作 */ } // 自定义长按时间

// 拖拽手势
.gesture(
    DragGesture()
        .onChanged { value in /* 跟踪位置 */ }
        .onEnded { value in /* 最终位置 */ }
)
```

#### 高级手势
```swift
// 缩放手势
.gesture(
    MagnificationGesture()
        .onChanged { scale in /* 处理缩放 */ }
        .onEnded { scale in /* 缩放结束 */ }
)

// 旋转手势
.gesture(
    RotationGesture()
        .onChanged { angle in /* 处理旋转 */ }
        .onEnded { angle in /* 旋转结束 */ }
)

// 组合手势
.gesture(
    SimultaneousGesture(                  // 同时识别多个手势
        TapGesture(),
        LongPressGesture()
    )
)
.gesture(
    SequenceGesture(                      // 按顺序识别手势
        LongPressGesture(),
        DragGesture()
    )
)
```

#### 交互状态控制
```swift
// 交互状态
.disabled(condition)                      // 禁用交互
.allowsHitTesting(false)                  // 禁止点击测试
.sensoryFeedback(.success, trigger: condition) // 触觉反馈(iOS 17+)

// 拖放功能
.onDrag { NSItemProvider(object: "内容" as NSString) } // 拖拽源
.onDrop(of: [.text], isTargeted: $isTargeted) { providers -> Bool { // 拖拽目标
    /* 处理拖放 */
    return true
}
```

## 二、系统功能与集成
### 1. 系统选择器与弹窗
#### 图片与文件选择
```swift
// 相册选择
.photosPicker(
    isPresented: $showPicker,
    selection: $selectedItems,
    maxSelectionCount: 5
)

// 文件选择
.fileImporter(
    isPresented: $showingImporter,
    allowedContentTypes: [.pdf, .image],
    onCompletion: handleImport
)

// 文件导出
.fileExporter(
    isPresented: $showingExporter,
    document: document,
    contentType: .pdf,
    onCompletion: handleExport
)

// 相机调用 (iOS 17+)
.cameraPicker(
    isPresented: $showCamera,
    handler: handleCapturedPhoto
)
```

#### 模态弹窗与对话框
```swift
// 模态视图
.sheet(isPresented: $showingSheet) {
    SheetView()
}
.sheet(item: $selectedItem) { item in
    DetailView(item: item)
}

// 全屏覆盖
.fullScreenCover(isPresented: $showingFullScreen) {
    FullScreenView()
}

// 弹窗设置
.presentationDetents([.medium, .large])   // 弹窗高度设置(iOS 16+)
.presentationDragIndicator(.visible)      // 显示拖动指示器

// 警告框
.alert("警告标题", isPresented: $showingAlert) {
    Button("确定", role: .destructive) { /* 操作 */ }
    Button("取消", role: .cancel) { /* 操作 */ }
} message: {
    Text("详细信息")
}

// 操作表
.confirmationDialog("请选择操作", isPresented: $showingDialog) {
    Button("删除", role: .destructive) { /* 操作 */ }
    Button("编辑") { /* 操作 */ }
    Button("取消", role: .cancel) { /* 操作 */ }
}
```

#### 预览与分享
```swift
// 文件预览
.quickLookPreview($previewURL)            // 系统文件预览

// 分享功能
ShareLink(item: URL(string: "https://apple.com")!) // 分享链接
.sheet(isPresented: $showingActivity) {
    ActivityView(activityItems: [URL(string: "https://apple.com")!])
}

// Safari视图
.sheet(isPresented: $showingSafari) {
    SafariView(url: URL(string: "https://apple.com")!)
}
```

### 2. 系统权限与功能访问
#### 系统权限请求
```swift
// 位置权限
LocationButton(.currentLocation) {        // 位置权限按钮(iOS 15+)
    /* 获取位置 */
}

// 相机权限
.onAppear {
    AVCaptureDevice.requestAccess(for: .video) { granted in
        /* 处理权限结果 */
    }
}

// 麦克风权限
.onAppear {
    AVCaptureDevice.requestAccess(for: .audio) { granted in
        /* 处理权限结果 */
    }
}
```

#### 生物识别与安全
```swift
// Face ID/Touch ID
.onAppear {
    let context = LAContext()
    var error: NSError?
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "验证身份") { success, error in
            /* 处理结果 */
        }
    }
}
```

#### 系统功能访问
```swift
// 剪贴板访问
.onAppear {
    UIPasteboard.general.string = "复制到剪贴板"
}

// 语音识别
.speechRecognizer(speechRecognizer)       // 语音识别器绑定

// 文档扫描
.sheet(isPresented: $showingScanner) {
    ScannerView { result in /* 处理扫描结果 */ }
}
```

### 3. 系统通知与生命周期
#### 应用生命周期
```swift
// 场景阶段监听
@Environment(\.scenePhase) private var scenePhase
// 使用方式
.onChange(of: scenePhase) { newPhase in
    switch newPhase {
    case .active: /* 应用激活 */
    case .inactive: /* 应用不活跃 */
    case .background: /* 应用后台 */
    @unknown default: break
    }
}

// 通知监听
.onReceive(NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)) { _ in
    /* 处理应用激活通知 */
}
```

#### 搜索与刷新
```swift
// 搜索功能
.searchable(text: $searchText, prompt: "搜索...") {
    ForEach(suggestions) { suggestion in
        Text(suggestion.text).searchCompletion(suggestion.text)
    }
}

// 标记搜索 (iOS 16+)
.searchable(text: $searchText, tokens: $selectedTokens) { token in
    Label(token.name, systemImage: token.icon)
}

// 下拉刷新
.refreshable {
    await loadData()
}
```

#### 键盘与快捷键
```swift
// 键盘快捷键
.keyboardShortcut(.defaultAction)         // 默认操作快捷键(回车)
.keyboardShortcut("s", modifiers: [.command]) // 自定义快捷键(Command+S)

// 键盘工具栏
.toolbar {
    ToolbarItemGroup(placement: .keyboard) {
        Button("完成") { /* 关闭键盘 */ }
    }
}
```

### 4. 设备特性与服务集成
#### 设备特性适配
```swift
// 设备方向变化
.onReceive(NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)) { _ in
    /* 处理方向变化 */
}

// 动态字体适配
.dynamicTypeSize(.medium...(.accessibility5)) // 字体大小范围
.font(.headline)                           // 系统动态字体

// 暗黑模式适配
.preferredColorScheme(.dark)               // 强制暗黑模式
.environment(\.colorScheme, .dark)         // 环境设置暗黑模式
```

#### 系统服务集成
```swift
// App Store评分
.onAppear {
    if shouldRequestReview {
        requestReview()
    }
}

// App Store展示
.appStoreOverlay(isPresented: $showAppStore) {
    SKOverlay.AppConfiguration(appIdentifier: "123456789", position: .bottom)
}

// 音频播放控制
.onAppear {
    let audioSession = AVAudioSession.sharedInstance()
    try? audioSession.setCategory(.playback)
}
```

## 三、控件与容器样式
### 1. 基础控件样式
#### 按钮样式
```swift
Button("点击") { /* 动作 */ }
    .buttonStyle(.automatic)              // 自动样式(默认)
    .buttonStyle(.plain)                  // 朴素样式
    .buttonStyle(.borderless)             // 无边框样式
    .buttonStyle(.bordered)               // 带边框样式（浅）
    .buttonStyle(.borderedProminent)      // 带边框样式（深）
```

#### 选择器样式
```swift
Picker("选择", selection: $selection) { /* 选项 */ }
    .pickerStyle(.automatic)              // 自动样式(默认)
    .pickerStyle(.menu)                   // 菜单样式
    .pickerStyle(.segmented)              // 分段控制样式
    .pickerStyle(.wheel)                  // 滚轮样式
    .pickerStyle(.inline)                 // 内联样式
    .pickerStyle(.navigationLink)         // 导航链接样式

DatePicker("日期", selection: $date)
    .datePickerStyle(.automatic)          // 自动样式(默认)
    .datePickerStyle(.compact)            // 紧凑样式
    .datePickerStyle(.graphical)          // 图形化样式
    .datePickerStyle(.wheel)              // 滚轮样式
```

#### 开关与输入样式
```swift
Toggle("开关", isOn: $isOn)
    .toggleStyle(.automatic)              // 自动样式(默认)
    .toggleStyle(.switch)                 // 滑动开关
    .toggleStyle(.button)                 // 按钮样式开关
    .toggleStyle(.checkbox)               // 复选框样式(macOS)

TextField("输入", text: $text)
    .textFieldStyle(.automatic)           // 自动样式(默认)
    .textFieldStyle(.plain)               // 朴素样式
    .textFieldStyle(.roundedBorder)       // 圆角边框样式
```

#### 控件大小与分组
```swift
// 控件大小
Button("按钮") { /* 动作 */ }
    .controlSize(.regular)                // 常规尺寸(默认)
    .controlSize(.mini)                   // 迷你尺寸
    .controlSize(.small)                  // 小尺寸
    .controlSize(.large)                  // 大尺寸

// 控件组样式 (iOS 16+)
ControlGroup {
    Button("保存") { /* 动作 */ }
    Button("取消") { /* 动作 */ }
}
.controlGroupStyle(.automatic)            // 自动样式(默认)
.controlGroupStyle(.navigation)           // 导航样式
.controlGroupStyle(.menu)                 // 菜单样式
```

### 2. 容器与列表样式
#### 列表样式
```swift
List { /* 内容 */ }
    .listStyle(.automatic)                // 自动样式(默认)
    .listStyle(.plain)                    // 朴素样式
    .listStyle(.grouped)                  // 分组样式
    .listStyle(.inset)                    // 嵌入样式
    .listStyle(.insetGrouped)             // 嵌入分组样式
    .listStyle(.sidebar)                  // 侧边栏样式

// 列表行为
List { /* 内容 */ }
    .listRowBackground(Color.gray.opacity(0.2)) // 列表行背景
    .listRowSeparator(.hidden)            // 隐藏分隔线
    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16)) // 行内边距
```

#### 表单与表格样式
```swift
Form { /* 内容 */ }
    .formStyle(.automatic)                // 自动样式(默认)
    .formStyle(.grouped)                  // 分组样式
    .formStyle(.columns)                  // 列样式

// 表格样式 (iOS 16+)
Table(selection: $selection) { /* 列 */ } rows: { /* 行 */ }
    .tableStyle(.automatic)               // 自动样式(默认)
    .tableStyle(.inset)                   // 嵌入样式
```

#### 滑动操作与菜单
```swift
// 滑动操作样式
List {
    ForEach(items) { item in
        Text(item.title)
            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                Button("删除", role: .destructive) { /* 删除操作 */ }
            }
            .swipeActions(edge: .leading) {
                Button("收藏") { /* 收藏操作 */ }
            }
    }
}

// 菜单样式
Menu("选项") { /* 菜单项 */ }
    .menuStyle(.automatic)                // 自动样式(默认)
    .menuStyle(.button)                   // 按钮样式

// macOS菜单栏样式
MenuBarExtra("标题") { /* 内容 */ }        // macOS
    .menuBarExtraStyle(.menu)             // 菜单样式(默认)
    .menuBarExtraStyle(.window)           // 窗口样式
```

### 3. 滚动视图与布局样式
#### 滚动视图控制
```swift
ScrollView { /* 内容 */ }
    .scrollIndicators(.automatic)         // 自动显示指示器(默认)
    .scrollIndicators(.visible)           // 始终显示指示器
    .scrollIndicators(.hidden)            // 隐藏指示器

    .scrollContentBackground(.visible)    // 可见背景(默认)
    .scrollContentBackground(.hidden)     // 隐藏背景

    // iOS 17+新增
    .scrollBounceBehavior(.basedOnSize)   // 基于尺寸的弹性行为
    .scrollClipDisabled()                 // 禁用滚动裁剪
```

#### 容器背景与边距
```swift
// 容器背景 (iOS 17+)
List { /* 内容 */ }
    .containerBackground(.background.opacity(0.8), for: .automatic)

// 内容边距
VStack { /* 内容 */ }
    .contentMargins(16)                   // 所有方向边距
    .contentMargins(.horizontal, 20)      // 水平方向边距
    .contentMargins([.top, .horizontal], 16, for: .automatic) // 多方向边距
```

#### 布局与进度控制
```swift
// 进度视图样式
ProgressView(value: progress)
    .progressViewStyle(.automatic)        // 自动样式(默认)
    .progressViewStyle(.linear)           // 线性进度条
    .progressViewStyle(.circular)         // 圆形加载指示器

// 标签样式
Label("文本", systemImage: "star")
    .labelStyle(.automatic)               // 自动样式(默认)
    .labelStyle(.titleOnly)               // 仅显示标题
    .labelStyle(.iconOnly)                // 仅显示图标
    .labelStyle(.titleAndIcon)            // 显示标题和图标

// 仪表盘样式 (iOS 16+)
Gauge(value: 0.7, in: 0...1) { Text("70%") }
    .gaugeStyle(.automatic)               // 自动样式(默认)
    .gaugeStyle(.accessoryCircular)       // 圆形配件样式
    .gaugeStyle(.accessoryCircularCapacity) // 圆形容量样式
    .gaugeStyle(.accessoryLinear)         // 线性配件样式
    .gaugeStyle(.accessoryLinearCapacity) // 线性容量样式
```

### 4. 文本与媒体样式
#### 文本样式控制
```swift
Text("文本")
    // 基础控制
    .font(.title)                         // 系统字体样式
    .bold()                               // 粗体
    .italic()                             // 斜体
    .fontWeight(.semibold)                // 字重
    
    // 布局控制
    .lineLimit(2)                         // 行数限制
    .lineSpacing(4)                       // 行间距
    .multilineTextAlignment(.center)      // 多行对齐
    .truncationMode(.tail)                // 截断模式(.tail/.head/.middle)
    
    // 样式控制
    .underline(true, color: .blue)        // 下划线
    .strikethrough(true, color: .red)     // 删除线
    .textCase(.uppercase)                 // 大小写转换
    
    // iOS 16+新增
    .fontWidth(.expanded)                 // 字体宽度
    .fontDesign(.rounded)                 // 字体设计
```

#### 图像与符号样式
```swift
Image(systemName: "star")
    // 符号变体
    .symbolVariant(.fill)                 // 填充变体
    .symbolVariant(.circle)               // 圆形变体
    .symbolVariant(.square)               // 方形变体
    .symbolVariant(.slash)                // 斜线变体
    
    // 渲染模式
    .symbolRenderingMode(.monochrome)     // 单色(默认)
    .symbolRenderingMode(.multicolor)     // 多色
    .symbolRenderingMode(.hierarchical)   // 层次色
    .symbolRenderingMode(.palette)        // 调色板
    .foregroundStyle(.blue, .green)       // 调色板颜色
    
    // 图像处理
    .resizable()                          // 允许调整大小
    .scaledToFit()                        // 适应容器
    .scaledToFill()                       // 填充容器
    .imageScale(.large)                   // 图像缩放
    
    // iOS 17+新增
    .symbolEffect(.pulse)                 // 脉冲动画效果
    .symbolEffect(.bounce)                // 弹跳动画效果
    .symbolEffect(.variableColor)         // 变色效果
```

#### 媒体与混合样式
```swift
Image("photo")
    .blendMode(.normal)                   // 正常模式(默认)
    .blendMode(.multiply)                 // 正片叠底
    .blendMode(.screen)                   // 滤色
    .blendMode(.overlay)                  // 叠加
    
    .saturation(1.2)                      // 饱和度调整
    .contrast(1.1)                        // 对比度调整
    .brightness(0.1)                      // 亮度调整
    .blur(radius: 3)                      // 模糊效果
```

## 四、iOS 版本特性
### 1. iOS 15+ 主要特性
```swift
// 搜索功能
.searchable(text: $searchText, prompt: "搜索...")

// 下拉刷新
.refreshable {
    await loadData()
}
```

```swift
// 异步图像
AsyncImage(url: URL(string: "https://example.com/image.jpg"))
AsyncImage(url: URL(string: "https://example.com/image.jpg")) { phase in
    switch phase {
    case .empty: ProgressView()
    case .success(let image): image.resizable()
    case .failure: Image(systemName: "exclamationmark.triangle")
    @unknown default: EmptyView()
    }
}

// 位置按钮
LocationButton(.currentLocation) {
    /* 位置权限授予后的处理 */
}

// 材质背景
.background(.ultraThinMaterial)
.background(.regularMaterial)
.background(.thickMaterial)

// 键盘工具栏
.toolbar {
    ToolbarItemGroup(placement: .keyboard) {
        Button("完成") { /* 关闭键盘 */ }
    }
}

// 焦点管理
@FocusState private var focusedField: Field?
TextField("用户名", text: $username)
    .focused($focusedField, equals: .username)
```

### 2. iOS 16+ 主要特性
```swift
// 导航API升级
NavigationStack {
    List(items) { item in
        NavigationLink(value: item) {
            Text(item.title)
        }
    }
    .navigationDestination(for: Item.self) { item in
        ItemDetailView(item: item)
    }
}

// 多列导航
NavigationSplitView {
    SidebarView()
} content: {
    ContentView()
} detail: {
    DetailView()
}

// 可调整尺寸的模态视图
.sheet(isPresented: $showingSheet) {
    SheetView()
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
}

// 表格视图
Table(items) {
    TableColumn("标题", value: \.title)
    TableColumn("日期") { item in
        Text(item.date, format: .dateTime)
    }
}

// 高级搜索
.searchable(text: $searchText, tokens: $selectedTokens) { token in
    Label(token.name, systemImage: token.icon)
}

// 图表支持
Chart(data) { item in
    LineMark(x: .value("日期", item.date), y: .value("值", item.value))
}

// 网格布局
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

// 可变字体配置
.bold(.semibold)
.fontWidth(.expanded)
.fontDesign(.serif)
```

### 3. iOS 17+ 主要特性
```swift
// 滚动视图增强
ScrollView {
    /* 内容 */
}
.scrollBounceBehavior(.basedOnSize)
.scrollClipDisabled()
.scrollIndicatorVisibility(.automatic)

// 容器背景
.containerBackground(.thinMaterial, for: .navigation)

// 符号动画效果
Image(systemName: "heart")
    .symbolEffect(.bounce)
    .symbolEffect(.pulse)
    .symbolEffect(.variableColor)
    .symbolEffect(.appear)
    .contentTransition(.symbolEffect(.replace))

// 触觉反馈
.sensoryFeedback(.success, trigger: successCondition)
.sensoryFeedback(.impact(weight: .medium), trigger: impactCondition)

// 相机调用
.cameraPicker(isPresented: $showCamera, handler: handleCapturedPhoto)

// 内容过渡动画
.contentTransition(.opacity)
.contentTransition(.interpolate)

// 观察状态
@Observation class UserModel { /* 属性和方法 */ }
// 替代 @ObservableObject 和 @Published

// 视图状态配置
@State(initialValue: 0)
// 替代 @State private var count = 0

// 日期输入样式
.dateInputStyle(.field)
.dateInputStyle(.picker)
```

## 五、最佳实践与注意事项
### 1. 性能与优化
#### 视图性能优化
```swift
// 使用懒加载视图减少初始化开销
LazyVStack { /* 大量内容 */ }
LazyHStack { /* 大量内容 */ }

// 避免重复计算
@State private var expensiveComputation: ExpensiveResult?
.task {
    // 仅在视图首次出现时计算一次
    if expensiveComputation == nil {
        expensiveComputation = await computeExpensiveResult()
    }
}

// 条件渲染减少视图层级
if condition {
    DetailView()
} else {
    SummaryView()
}
// 优于: condition ? DetailView() : SummaryView() 
// 后者会创建两个视图实例但只显示一个

// 避免嵌套环境修饰符
// 错误示例:
VStack {
    ForEach(items) { item in
        Text(item.title)
            .foregroundColor(.blue) // 在循环中重复应用
    }
}

// 正确示例:
VStack {
    ForEach(items) { item in
        Text(item.title)
    }
}
.foregroundColor(.blue) // 在容器上一次性应用
```

#### 内存管理
```swift
// 避免大图片直接加载
// 不推荐:
Image("largeImage").resizable()

// 推荐:
AsyncImage(url: URL(string: "https://example.com/largeImage.jpg")) { image in
    image.resizable()
} placeholder: {
    ProgressView()
}

// 使用ID优化列表
List {
    ForEach(items) { item in // 使用Identifiable协议
        ItemRow(item: item)
    }
}

// 或手动指定ID
List {
    ForEach(items, id: \.uniqueID) { item in
        ItemRow(item: item)
    }
}
```

### 2. 平台差异考量
#### iOS与iPadOS区别
```swift
// 响应式布局
@Environment(\.horizontalSizeClass) private var horizontalSizeClass

var body: some View {
    if horizontalSizeClass == .compact {
        // iPhone或竖屏iPad布局
        PhoneLayout()
    } else {
        // 横屏iPad布局
        TabletLayout()
    }
}

// 导航样式适配
NavigationSplitView {
    List(items) { item in
        NavigationLink(value: item) {
            Text(item.title)
        }
    }
} detail: {
    Text("选择一个项目")
        .navigationDestination(for: Item.self) { item in
            ItemDetailView(item: item)
        }
}
// 在iPhone上自动显示为单列导航，在iPad上自动显示为双列

// iPad特定功能
.toolbar {
    ToolbarItemGroup(placement: .primaryAction) { // iPad优先操作区域
        Button("添加") { /* 操作 */ }
    }
}
```

#### macOS特定修饰符
```swift
// macOS窗口控制
.frame(minWidth: 800, minHeight: 600)
.windowStyle(.hiddenTitleBar)
.windowToolbarStyle(.unified)

// macOS侧边栏样式
.listStyle(.sidebar)
.navigationSplitViewStyle(.balanced)

// macOS菜单栏
.commands {
    CommandMenu("自定义") {
        Button("选项1") { /* 操作 */ }
        Button("选项2") { /* 操作 */ }
    }
}
```

### 3. 版本兼容性提示
#### 版本检查与回退
```swift
// API可用性检查
if #available(iOS 16, *) {
    // iOS 16及更高版本特性
    NavigationStack { /* 新导航API */ }
} else {
    // iOS 15及更低版本回退
    NavigationView { /* 旧导航API */ }
}

// 条件编译
#if os(iOS)
// iOS特定代码
#elseif os(macOS)
// macOS特定代码
#endif

// 混合使用
@ViewBuilder
func createNavigationView() -> some View {
    if #available(iOS 16, *) {
        NavigationStack { /* 内容 */ }
    } else {
        NavigationView { /* 内容 */ }
            .navigationViewStyle(.stack)
    }
}
```

#### 常见兼容性问题
```swift
// iOS 15前后文本颜色用法区别
// iOS 14及之前:
Text("文本")
    .foregroundColor(.blue)

// iOS 15及之后推荐:
Text("文本")
    .foregroundStyle(.blue)

// 按钮样式变化
// iOS 14及之前:
Button("按钮") { /* 动作 */ }
    .buttonStyle(BorderedButtonStyle())

// iOS 15及之后:
Button("按钮") { /* 动作 */ }
    .buttonStyle(.bordered)

// 列表分割线处理
// iOS 14及之前:
List { /* 内容 */ }
    .environment(\.defaultMinListRowHeight, 0)

// iOS 15及之后:
List { /* 内容 */ }
    .listRowSeparator(.hidden)
```

## 六、总结与速查
### 1. 修饰符应用顺序重要性
```swift
// 修饰符顺序影响结果
// 示例1 - 不同结果:
Text("文本")
    .padding()
    .background(.blue)  // 背景包含内边距

Text("文本")
    .background(.blue)
    .padding()  // 内边距在背景外部

// 示例2 - 不同结果:
Button("按钮") { /* 动作 */ }
    .padding()
    .buttonStyle(.borderedProminent)  // 按钮样式包含内边距

Button("按钮") { /* 动作 */ }
    .buttonStyle(.borderedProminent)
    .padding()  // 内边距在按钮外部
```

### 2. 常用修饰符组合
```swift
// 卡片效果
.padding()
.background(.ultraThinMaterial)
.cornerRadius(12)
.shadow(radius: 3)

// 按钮样式
.buttonStyle(.borderedProminent)
.controlSize(.large)
.tint(.blue)

// 列表行定制
.listRowBackground(Color.secondary.opacity(0.1))
.listRowSeparator(.hidden)
.listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))

// 导航栏定制
.navigationTitle("标题")
.navigationBarTitleDisplayMode(.large)
.toolbar {
    ToolbarItem(placement: .navigationBarTrailing) {
        Button("添加") { /* 动作 */ }
    }
}

// 表单字段组合
.textFieldStyle(.roundedBorder)
.keyboardType(.emailAddress)
.autocorrectionDisabled(true)
.textInputAutocapitalization(.never)
.submitLabel(.next)
```

### 3. 修饰符速查表
| 修饰符类型 | 常用修饰符 | 适用场景 |
| --- | --- | --- |
| 布局修饰符 | `.frame()`, `.padding()`, `.offset()` | 控制视图大小和位置 |
| 外观修饰符 | `.background()`, `.foregroundStyle()`, `.cornerRadius()` | 自定义视图外观 |
| 交互修饰符 | `.onTapGesture()`, `.gesture()`, `.disabled()` | 处理用户输入和交互 |
| 系统修饰符 | `.sheet()`, `.alert()`, `.toolbar()` | 调用系统UI和功能 |
| 动画修饰符 | `.animation()`, `.transition()`, `.contentTransition()` | 控制视图动画效果 |
| 环境修饰符 | `.environment()`, `.preferredColorScheme()`, `.dynamicTypeSize()` | 设置环境值 |
| 样式修饰符 | `.buttonStyle()`, `.listStyle()`, `.textFieldStyle()` | 应用预定义样式 |


## 注意事项
1. **Info.plist 权限配置**：使用相机、相册、位置等功能前，需在Info.plist中添加对应权限描述。
2. **最小部署目标**：使用较新API时，确保应用的最小部署目标与API要求一致。
3. **设备兼容性**：某些修饰符仅适用于特定设备类型(如iPad或Mac)。
4. **修饰符副作用**：部分修饰符可能影响性能或内存使用，特别是大数据集或复杂视图层次结构。
5. **组合使用**：合理组合修饰符可以减少代码重复，提高可维护性。
