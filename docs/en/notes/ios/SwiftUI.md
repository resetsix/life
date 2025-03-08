---
title: SwiftUI
createTime: 2025/03/04 22:59:32
permalink: /article/u10slmi9/
---

<script setup>
import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
</script>

## Text

<!-- <NpmBadgeGroup name="lodash-es" items="version,dm" /> -->
<!-- <NpmBadgeGroup name="lodash" items="version,dm" /> -->

一个显示一行或多行只读文本的视图。

`iOS 13.0+` | `iPadOS 13.0+` | `Mac Catalyst 13.0+` | `macOS 10.15+` | `tvOS 13.0+` | `visionOS 1.0+` | `watchOS 6.0+`

### 概览

文本视图使用适合当前平台的正文字体在你的应用用户界面中绘制字符串。你可以通过使用 `.font(_:)` 视图修饰符来选择不同的标准字体，例如标题或说明。

```swift:no-line-numbers
Text("Hamlet")
    .font(.title)
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/f9d37806f6bf6d321d08de862f794196/SwiftUI-Text-title~dark@2x.png"
  width=175
  center=true
/>

如果你需要对文本样式进行更精细的控制，你可以使用相同的修饰符来配置系统字体或选择自定义字体。你还可以应用像 `bold()` 或 `italic()` 这样的视图修饰符来进一步调整格式。

```swift:no-line-numbers
Text("by William Shakespeare")
    .font(.system(size: 12, weight: .light, design: .serif))
    .italic()
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/b2a9642eab0875be8b646da9b8c91202/SwiftUI-Text-font~dark@2x.png"
  width=175
  center=true
/>

要在文本的特定部分应用样式，你可以从 `AttributedString` 创建文本视图，这反过来允许你使用 Markdown 来为文本段落添加样式。你可以在字符串属性和 SwiftUI 修饰符之间混用，其中字符串属性具有优先权。

```swift:no-line-numbers
let attributedString = try! AttributedString(
    markdown: "_Hamlet_ by William Shakespeare")

var body: some View {
    Text(attributedString)
        .font(.system(size: 12, weight: .light, design: .serif))
}
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/4c6359c018a778a280b918e2b3fc742d/SwiftUI-Text-attributed~dark@2x.png"
  width=200
  center=true
/>

文本视图总是恰好使用其呈现内容所需的空间，但你可以影响视图的布局。例如，你可以使用 `frame(width:height:alignment:)` 修饰符为视图建议特定的尺寸。如果视图接受了该建议，但文本无法适应可用空间，视图会结合使用换行、收紧、缩放和截断等方法使其适应。在宽度为 100 点但没有高度约束的情况下，文本视图可能会对长字符串进行换行处理：

```swift:no-line-numbers
Text("To be, or not to be, that is the question:")
    .frame(width: 100)
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/4b13c7790f715c10035c1a32124e31fc/SwiftUI-Text-split~dark@2x.png"
  width=200
  center=true
/>

使用修饰符如 `lineLimit(_:)`、`allowsTightening(_:)`、`minimumScaleFactor(_:)` 和 `truncationMode(_:)` 来配置视图如何处理空间限制。例如，结合固定宽度和一行限制会导致超出该空间的文本被截断：

```swift:no-line-numbers
Text("Brevity is the soul of wit.")
    .frame(width: 100)
    .lineLimit(1)
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/78a2c9311f6d3937ddf78ecc46366a6e/SwiftUI-Text-truncated~dark@2x.png"
  width=200
  center=true
/>

### 本地化字符串

如果你使用字符串字面量初始化一个文本视图，视图会使用 `init(_:tableName:bundle:comment:)` 初始化方法，该方法将字符串解释为本地化键，并在你指定的表中搜索该键，或者在你没有指定表的情况下，在默认表中搜索该键。

```swift:no-line-numbers
Text("pencil") // Searches the default table in the main bundle.
```

对于一个同时本地化为英语和西班牙语的应用程序，上述视图分别向英语和西班牙语用户显示“pencil”和“lápiz”。如果该视图无法执行本地化，则显示键名。例如，如果同一个应用程序缺少丹麦语本地化，则该视图会向该地区的用户显示“pencil”。同样，一个缺少任何本地化信息的应用程序在任何地区都会显示“pencil”。

要显式绕过字符串字面量的本地化，请使用 `init(verbatim:)` 初始化方法。

```swift:no-line-numbers
Text(verbatim: "pencil") // Displays the string "pencil" in any locale.
```

如果你使用一个变量值来初始化一个文本视图，该视图会使用 `init(_:)` 初始化方法，这个初始化方法不会对字符串进行本地化。然而，你可以通过首先创建一个 `LocalizedStringKey` 实例来请求本地化，这样会触发 `init(_:tableName:bundle:comment:)` 初始化方法：

```swift:no-line-numbers
// Don't localize a string variable...
Text(writingImplement)

// ...unless you explicitly convert it to a localized string key.
Text(LocalizedStringKey(writingImplement))
```

在本地化字符串变量时，你可以通过省略可选的初始化参数来使用默认表——就像上面的例子一样——就像你可能对字符串字面量所做的一样。

## Label

用户界面项的标准标签，由带有标题的图标组成。

`iOS 14.0` | `iPadOS 14.0` | `Mac Catalyst 14.0` | `macOS 11.0` | `tvOS 14.0` | `visionOS 1.0` | `watchOS 7.0`

```swift:no-line-numbers
struct Label<Title, Icon> where Title : View, Icon : View
```

### 概览

最常见且易于识别的用户界面组件之一是图标和标签的组合。这种设计模式广泛应用于各种类型的应用程序中，出现在集合、列表、操作项菜单以及可展开列表等场景中。

要创建一个最简单的标签，你可以提供一个标题和一个图像的名称，例如来自 SF Symbols 集合的图标：

```swift:no-line-numbers
Label("Lightning", systemImage: "bolt.fill")
```

你还可以通过多种方式对标签应用样式。在设备旋转或窗口大小变化后视图发生动态变化的情况下，你可能希望仅显示标签的文本部分，此时可以使用 `titleOnly` 标签样式：

```swift:no-line-numbers
Label("Lightning", systemImage: "bolt.fill")
    .labelStyle(.titleOnly)
```

相反，还有一种仅图标的标签样式：

```swift:no-line-numbers
Label("Lightning", systemImage: "bolt.fill")
    .labelStyle(.iconOnly)
```

某些容器可能会应用不同的默认标签样式，例如在 macOS 和 iOS 的工具栏中仅显示图标。若要选择显示标题和图标两者，你可以应用 **titleAndIcon** 标签样式：

```swift:no-line-numbers
Label("Lightning", systemImage: "bolt.fill")
    .labelStyle(.titleAndIcon)
```

你还可以通过修改现有样式来创建自定义标签样式；以下示例为默认标签样式添加了红色边框：

```swift:no-line-numbers
struct RedBorderedLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        Label(configuration)
            .border(Color.red)
    }
}
```

对于更广泛的定制或创建一个全新的标签样式，你需要采用 LabelStyle 协议并实现一个新的样式对应的 LabelStyleConfiguration。
要将一个通用的标签样式应用到一组标签上，请将该样式应用到包含这些标签的视图层次结构中：

```swift:no-line-numbers
VStack {
    Label("Rain", systemImage: "cloud.rain")
    Label("Snow", systemImage: "snow")
    Label("Sun", systemImage: "sun.max")
}
.labelStyle(.iconOnly)
```

也可以通过使用视图以编程方式组合标签的图标，而不是使用预制的图像来创建标签。在这个示例中，标签的图标部分使用了填充的圆形，上面覆盖着用户的姓名首字母：

```swift:no-line-numbers
Label {
    Text(person.fullName)
        .font(.body)
        .foregroundColor(.primary)
    Text(person.title)
        .font(.subheadline)
        .foregroundColor(.secondary)
} icon: {
    Circle()
        .fill(person.profileColor)
        .frame(width: 44, height: 44, alignment: .center)
        .overlay(Text(person.initials))
}
```

## TextField

显示可编辑文本界面的控件。

`iOS 13.0+` | `iPadOS 13.0+` | `Mac Catalyst 13.0+` | `macOS 10.15+` | `tvOS 13.0+` | `visionOS 1.0+` | `watchOS 6.0+`

```swift:no-line-numbers
struct TextField<Label> where Label : View
```

### 概览

你创建了一个带有标签和绑定到某个值的文本字段。如果该值是字符串类型，文本字段会在用户输入或以其他方式编辑文本时，持续更新这个值。对于非字符串类型，它会在用户提交编辑时更新值，例如通过按下回车键。

以下示例展示了一个用于接受用户名的文本字段，以及其下方的一个 `Text` 视图，该视图实时反映用户名的更新值。随着用户开始和结束编辑，`Text` 视图的颜色会发生变化。当用户向文本字段提交完整的输入时，`onSubmit(of:_:)` 修饰符会调用内部方法 `validate(name:)`。

```swift:no-line-numbers
@State private var username: String = ""
@FocusState private var emailFieldIsFocused: Bool = false

var body: some View {
    TextField(
        "User name (email address)",
        text: $username
    )
    .focused($emailFieldIsFocused)
    .onSubmit {
        validate(name: username)
    }
    .textInputAutocapitalization(.never)
    .disableAutocorrection(true)
    .border(.secondary)


    Text(username)
        .foregroundColor(emailFieldIsFocused ? .red : .blue)
}
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/3ef097d57ca34d12d0e9c80c632daea8/SwiftUI-TextField-echoText~dark@2x.png"
  width=375
  center=true
/>

绑定值不必是字符串。通过使用 `FormatStyle`，你可以将文本字段绑定到非字符串类型，利用格式风格将输入的文本转换为绑定类型的实例。以下示例使用 `PersonNameComponents.FormatStyle`，将文本字段中输入的姓名转换为 `PersonNameComponents` 实例。文本字段下方的一个 `Text` 视图显示此实例的调试描述字符串。

```swift:no-line-numbers
@State private var nameComponents = PersonNameComponents()

var body: some View {
    TextField(
        "Proper name",
        value: $nameComponents,
        format: .name(style: .medium)
    )
    .onSubmit {
        validate(components: nameComponents)
    }
    .disableAutocorrection(true)
    .border(.secondary)
    Text(nameComponents.debugDescription)
}
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/ff93cf8d8cbccf20552e5a78fe07d3b5/SwiftUI-TextField-nameComponents~dark@2x.png"
  width=375
  center=true
/>

### 文本框提示

你可以为文本字段设置一个明确的提示，以指导用户应该提供什么内容。每种文本字段样式决定了何时以及在哪里使用提示和标签。例如，在 macOS 上的表单中，标签始终放置在字段的前端，并且在可用时，提示将作为字段内部的占位符文本使用。在 iOS 的相同情况下，文本字段根据初始化器是否提供了提示，使用提示或标签作为占位符文本。

以下示例展示了一个包含两个文本字段的表单，每个字段都提供了提示，表明该字段是必填项，并且使用视图构建器来提供标签：

<ImageCard
  image="https://docs-assets.developer.apple.com/published/2d80d74324d1de5138743719760f07e8/TextField-prompt-1~dark@2x.png"
  width=375
  center=true
/>
<ImageCard
  image="https://docs-assets.developer.apple.com/published/7a15bd8a2163b2388a3176b6de1043bf/TextField-prompt-2~dark@2x.png"
  width=375
  center=true
/>

### 文本字段样式设置

SwiftUI 提供了一种默认的文本字段样式，该样式反映了适合平台的外观和行为。默认样式还会考虑当前上下文，例如文本字段是否位于以特殊样式呈现文本字段的容器中。除此之外，你可以使用 `textFieldStyle(_:)` 修饰符来自定义文本字段的外观和交互，传入 `TextFieldStyle` 的一个实例。

以下示例将 `roundedBorder` 样式应用于 `VStack` 中的两个文本字段。

```swift:no-line-numbers
@State private var givenName: String = ""
@State private var familyName: String = ""

var body: some View {
    VStack {
        TextField(
            "Given Name",
            text: $givenName
        )
        .disableAutocorrection(true)
        TextField(
            "Family Name",
            text: $familyName
        )
        .disableAutocorrection(true)
    }
    .textFieldStyle(.roundedBorder)
}
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/4f81755557dc7db8ab42f7801e6b8103/SwiftUI-TextField-roundedBorderStyle~dark@2x.png"
  width=375
  center=true
/>

## TextEditor

一个可以显示和编辑长文本的视图。

`iOS 14.0+` | `iPadOS 14.0+` | `Mac Catalyst 14.0+` | `macOS 11.0+` | `visionOS 1.0+`

```swift:no-line-numbers
struct TextEditor
```

### 概览

文本编辑器视图允许你在应用的用户界面中显示和编辑多行、可滚动的文本。默认情况下，文本编辑器视图会使用从环境继承的特性来设置文本的样式，例如字体`(font(_:))`、前景色`(foregroundColor(_:))`以及多行文本对齐方式`(multilineTextAlignment(_:))`。

你可以通过在视图的主体中添加一个 `TextEditor` 实例来创建文本编辑器，并通过传入应用中某个字符串变量的 `Binding` 来进行初始化：

```swift:no-line-numbers
struct TextEditingView: View {
    @State private var fullText: String = "This is some editable text..."

    var body: some View {
        TextEditor(text: $fullText)
    }
}
```

要设置文本样式，请使用标准的视图修饰符来配置系统字体、设置自定义字体或更改视图中文本的颜色。

在这个示例中，视图将编辑器的文本以灰色呈现，并使用自定义字体：

```swift:no-line-numbers
struct TextEditingView: View {
    @State private var fullText: String = "This is some editable text..."

    var body: some View {
        TextEditor(text: $fullText)
            .foregroundColor(Color.gray)
            .font(.custom("HelveticaNeue", size: 13))
    }
}
```

如果你想要更改文本的间距或字体缩放方面的内容，可以使用诸如 `lineLimit(_:)`、`lineSpacing(_:)` 和 `minimumScaleFactor(_:)` 等修饰符，来根据空间约束配置视图如何显示文本。例如，下面的 `lineSpacing(_:)` 修饰符将行间距设置为 5 点：

```swift:no-line-numbers
struct TextEditingView: View {
    @State private var fullText: String = "This is some editable text..."

    var body: some View {
        TextEditor(text: $fullText)
            .foregroundColor(Color.gray)
            .font(.custom("HelveticaNeue", size: 13))
            .lineSpacing(5)
    }
}
```

## SecureField

一个可以显示和编辑密码的文本字段。

`iOS 13.0+` | `iPadOS 13.0+` | `Mac Catalyst 13.0+` | `macOS 10.15+` | `tvOS 13.0+` | `visionOS 1.0+` | `watchOS 6.0+`

```swift:no-line-numbers
struct SecureField<Label> where Label : View
```

### 概览

当你希望使用 `TextField` 的行为，但又希望隐藏字段中的文本时，请使用一个安全的字段。通常情况下，你会在输入密码或其他敏感信息时使用此功能。如下面的截图中的第二个字段所示：

::: tabs
@tab macOS

<ImageCard
  image="https://docs-assets.developer.apple.com/published/ba17d69b3011f4bb911e2f9c3f620780/SecureField-1-macOS~dark@2x.png"
  width=393
  center=true
/>

@tab iOS

<ImageCard
  image="https://docs-assets.developer.apple.com/published/b5120bedb765849c836b7e0dc44e5202/SecureField-1-iOS~dark@2x.png"
  width=393
  center=true
/>

:::

安全字段：  
    • 显示一个点来表示用户输入的每个字符。  
    • 在 iOS 中，当用户截屏时隐藏点。  
    • 防止任何人剪切或复制字段的文本。  
    • 当 Caps Lock 启用时显示指示器。

### 绑定到一个字符串

一个安全字段绑定到一个字符串值，并在每次按键或其他编辑操作时更新该字符串，因此你可以随时从代码的其他部分读取其值。以下代码展示了如何创建上述界面，并将安全字段绑定到密码字符串：

```swift:no-line-numbers
@State private var username: String = ""
@State private var password: String = ""

var body: some View {
    VStack {
        TextField("Username", text: $username)
            .autocorrectionDisabled(true)
            #if !os(macOS)
            .textInputAutocapitalization(.never)
            #endif

        SecureField("Password", text: $password)
            .onSubmit {
                handleLogin(username: username, password: password)
            }
    }
    .textFieldStyle(.roundedBorder)
}
```

在上面的示例中，字段有一个`onSubmit(of:_:)`修饰符，如果有人在安全字段获得焦点时按下 Return 键，它会将用户名和密码字符串发送到自定义的 handleLogin(username:password:) 方法。你也可以选择提供另一种机制 —— 比如按钮 —— 来实现相同的功能。

### 用提示引导用户

除了你提供的作为标签的字符串或视图外，你还可以提供一个 `Text` 视图提示，以帮助指导使用该字段的人，如下面的 `Form` 所示：

```swift:no-line-numbers
Form {
    TextField(text: $username, prompt: Text("Required")) {
        Text("Username")
    }
    .autocorrectionDisabled(true)
    #if !os(macOS)
    .textInputAutocapitalization(.never)
    #endif

    SecureField(text: $password, prompt: Text("Required")) {
        Text("Password")
    }
}
```

系统根据上下文以不同方式使用标签和提示。例如，macOS 中的表单将标签放置在字段的起始边缘，并将提示用作字段内的占位符文本。而 iOS 中的同一表单同样将提示用作占位符文本，但不显示标签：

::: tabs
@tab macOS

<ImageCard
  image="https://docs-assets.developer.apple.com/published/8b7f647cc0fd2b818e35c8bf47f6d1e0/SecureField-2-macOS~dark@2x.png"
  width=393
  center=true
/>

@tab iOS

<ImageCard
  image="https://docs-assets.developer.apple.com/published/bccd30630489e0849de519353121d10a/SecureField-2-iOS~dark@2x.png"
  width=393
  center=true
/>

:::

如果从上一个示例中移除提示内容，该字段在 macOS 上会保留标签并省略占位符文本，而在 iOS 上则会将标签显示为占位符：

::: tabs
@tab macOS

<ImageCard
  image="https://docs-assets.developer.apple.com/published/2aaa9dfb56d14c3fbda03c9c73252a6f/SecureField-3-macOS~dark@2x.png"
  width=393
  center=true
/>

@tab iOS

<ImageCard
  image="https://docs-assets.developer.apple.com/published/04035350f39ce719f73325f29da2f2e6/SecureField-3-iOS~dark@2x.png"
  width=393
  center=true
/>

:::

## Image

显示图像的视图。

`iOS 13.0+` | `iPadOS 13.0+` | `Mac Catalyst 13.0+` | `macOS 10.15+` | `tvOS 13.0+` | `visionOS 1.0+` | `watchOS 6.0+`

```swift:no-line-numbers
@frozen
struct Image
```

### 概览

使用 `Image` 实例来向你的 SwiftUI 应用添加图像。你可以从许多来源创建图像：  
    • 应用的资产库或捆绑包中的图像文件。支持的类型包括 PNG、JPEG、HEIC 等。  
    • 平台特定的图像类型实例，如 `VI Image` 和 `NSImage`。  
    • 存储在 Core Graphics `CGImage` 实例中的位图。  
    • 来自 SF Symbols 集的系统图形。

以下示例展示了如何从应用的资产库或捆绑包中加载图像并将其缩放到适合其容器的大小：

```swift:no-line-numbers
Image("Landscape_4")
    .resizable()
    .aspectRatio(contentMode: .fit)
Text("Water wheel")
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/9c4143a9a48a080f153278c9732c03e7/Image-1~dark@2x.png"
  width=375
  center=true
/>

你可以使用 `Image` 类型上的方法以及标准视图修饰符来调整图像的大小以适应你的应用界面。这里，`Image` 类型的 `resizable(capInsets:resizingMode:)` 方法将图像缩放到当前视图的大小。然后，`aspectRatio(_:contentMode:)` 视图修饰符调整此缩放行为，以保持图像的原始宽高比，而不是独立缩放 x 轴和 y 轴以填充视图的四个侧面。文章 [Fitting images into available space](https://developer.apple.com/documentation/swiftui/fitting-images-into-available-space) 展示了如何对不同大小的 `Image` 实例应用缩放、裁剪和平铺。

`Image` 是一个延迟绑定令牌；系统仅在即将使用图像时解析其实际值。

### 使图像易于访问

要将图像用作控件，请使用其中一个带有 `label` 参数的初始化方法。这使得系统的可访问性框架能够将该标签用作使用诸如 `VoiceOver` 等功能的用户的控件名称。对于仅出于美观原因而存在的图像，请使用带有 `decorative` 参数的初始化方法；可访问性系统会忽略这些图像。

## Button

一个可以触发操作的控件。

`iOS 13.0+` | `iPadOS 13.0+` | `Mac Catalyst 13.0+` | `macOS 10.15+` | `tvOS 13.0+` | `visionOS 1.0+` | `watchOS 6.0+`

```swift:no-line-numbers
struct Button<Label> where Label : View
```

### 概览

通过提供一个动作和一个标签来创建一个按钮。

动作是一个方法或闭包属性，当用户点击或触摸按钮时执行。  
标签是一个描述按钮动作的视图，例如通过显示文本、图标或两者。

按钮的标签可以是任何类型的视图，例如用于文本标签的 `Text` 视图：

```swift:no-line-numbers
Button(action: signIn) {
    Text("Sign In")
}
```

或者一个 `Label` 视图，用于具有标题和图标的按钮：

```swift:no-line-numbers
Button(action: signIn) {
    Label("Sign In", systemImage: "arrow.up")
}
```

对于这些常见情况，你还可以使用接受标题字符串或 `LocalizedStringKey` 作为第一个参数，并可选地接受系统图像名称或 `ImageResource` 作为第二个参数的便捷初始化方法，而不是尾随闭包：

```swift:no-line-numbers
Button("Sign In", systemImage: "arrow.up", action: signIn)
```

建议在提供标题和图标时使用这些便捷初始化方法或 `Label` 视图。这使得按钮可以动态适应其外观，以正确呈现标题和图标，例如在工具栏和菜单等容器中。例如，在 iOS 中，按钮默认仅在工具栏中显示图标，但在菜单中显示标题和图标。通过这种方式定义标签也有助于可访问性 — 例如，将 `labelStyle(_:)` 修饰符与 `iconOnly` 样式应用于按钮，将导致它仅视觉显示图标，但仍使用标题描述按钮，例如在 VoiceOver 等可访问性模式下：

```swift:no-line-numbers
Button("Sign In", systemImage: "arrow.up", action: signIn)
    .labelStyle(.iconOnly)
```

避免仅使用图像或仅包含视觉组件且没有可访问性标签的标签。

用户激活按钮的方式因平台而异：
• 在 iOS 和 watchOS 中，用户点击按钮。
• 在 macOS 中，用户点击按钮。
• 在 tvOS 中，用户在外部远程（如 Siri 遥控器）上按下“选择”按钮，同时将焦点放在按钮上。

按钮的外观取决于放置位置、是否分配角色以及如何设置样式。

### 将按钮添加到容器中

使用按钮来创建任何触发操作的用户界面元素。按钮会自动适应其外观以匹配这些不同容器和上下文中的预期样式。例如，要创建一个在用户选择时触发操作的列表单元格，请在列表的内容中添加一个按钮：

```swift:no-line-numbers
List {
    // Cells that show all the current folders.
    ForEach(folders) { folder in
        Text(folder.title)
    }

    // A cell that, when selected, adds a new folder.
    Button(action: addItem) {
        Label("Add Folder", systemImage: "folder.badge.plus")
    }
}
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/2e12c7d7fbb038ed1f0b771ba84656df/Button-1~dark@2x.png"
  width=375
  center=true
/>

同样，要创建一个触发操作的上下文菜单项，请在 `contextMenu(_:)` 修饰符的内容闭包中添加一个按钮：

```swift:no-line-numbers
.contextMenu {
    Button("Cut", action: cut)
    Button("Copy", action: copy)
    Button("Paste", action: paste)
}
```

<ImageCard
  image="https://docs-assets.developer.apple.com/published/85cb69f9b7d6585f4a85198b33c74236/Button-2~dark@2x.png"
  width=275
  center=true
/>

这种模式也适用于大多数其他具有可自定义、交互内容的 SwiftUI 容器视图，例如 `Form` 实例。

### 分配角色

你可以选择性地使用 `ButtonRole` 初始化一个按钮，以描述按钮的目的。例如，你可以创建一个用于删除操作的破坏性按钮：

```swift:no-line-numbers
Button("Delete", role: .destructive, action: delete)
```

系统使用按钮的角色来适当样式化按钮，在每个上下文中。例如，一个破坏性按钮在上下文菜单中显示为红色前景色：

<ImageCard
  image="https://docs-assets.developer.apple.com/published/300a7cd2261a139802c80d35ad04aed9/Button-3~dark@2x.png"
  width=275
  center=true
/>

如果你不指定按钮的角色，系统会应用适当的默认外观。

### 按钮样式

你可以使用其中一个标准按钮样式来定制按钮的外观，例如 `bordered`，并使用 `buttonStyle(_:)` 修饰符应用样式：

```swift:no-line-numbers
HStack {
    Button("Sign In", action: signIn)
    Button("Register", action: register)
}
.buttonStyle(.bordered)
```

如果你将样式应用于一个容器视图，如上面的示例所示，容器中的所有按钮都会使用该样式：

<ImageCard
  image="https://docs-assets.developer.apple.com/published/69c2dece71cc68cbb9297d7f5f6ca2e2/Button-4~dark@2x.png"
  width=375
  center=true
/>

你还可以创建自定义样式。要添加具有标准交互行为的自定义外观，请创建一个符合 `ButtonStyle` 协议的样式。要同时自定义外观和交互行为，请创建一个符合 `PrimitiveButtonStyle` 协议的样式。自定义样式还可以读取按钮的角色，并使用它来调整按钮的外观。
