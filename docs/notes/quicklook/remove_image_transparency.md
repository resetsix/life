---
title: 移除图片透明度
createTime: 2026/01/11 14:45:57
permalink: /quicklook/v8c4l10g/
---

## 命令行

查找所有隐藏文件
```bash
find . -maxdepth 1 -name ".*"
```

直接删除所有隐藏文件（不提示）
```bash
find . -maxdepth 1 -name ".*" -exec rm -rf {} +
```

删除 git 和缓存目录
```bash
rm -rf .DS_Store .gitignore .git
```

## 移除图片透明度
Figma 导出 png 图片默认携带透明度，并且无相关关闭选项。

```bash
brew install imagemagick

# 移除 Alpha 通道并用白色背景填充：
mogrify -background white -alpha remove -alpha off *.png

# 直接禁用 Alpha 通道（可能会保留原始背景色）：
mogrify -alpha off *.png
```

检测透明度（使用系统内置sips）
```bash
find . -maxdepth 1 -type f -name "*.png" -print0 | while IFS= read -r -d '' file; do hasAlpha=$(sips -g hasAlpha "$file" 2>/dev/null | awk '/hasAlpha:/ {print $2}'); if [[ "$hasAlpha" == "yes" ]]; then echo -e "\033[31m[含Alpha]\033[0m $file"; elif [[ "$hasAlpha" == "no" ]]; then echo -e "\033[32m[无Alpha]\033[0m $file"; else echo -e "\033[33m[未知或读取失败]\033[0m $file"; fi; done
```

移除透明度操作（使用imagemagick）
```bash
total=0; withAlpha=0; mkdir -p output_noalpha; while IFS= read -r -d '' file; do ((total++)); hasAlpha=$(sips -g hasAlpha "$file" 2>/dev/null | awk '/hasAlpha:/ {print $2}'); if [[ "$hasAlpha" == "yes" ]]; then ((withAlpha++)); echo -e "\033[31m[含Alpha→已处理]\033[0m $file"; base=$(basename "$file"); magick "$file" -background white -alpha remove -alpha off "output_noalpha/$base"; elif [[ "$hasAlpha" == "no" ]]; then echo -e "\033[32m[无Alpha→已复制]\033[0m $file"; base=$(basename "$file"); cp "$file" "output_noalpha/$base"; else echo -e "\033[33m[未知或读取失败]\033[0m $file"; fi; done < <(find . -maxdepth 1 -type f -iname "*.png" -print0); echo -e "\n\033[1;32m处理完成！\033[0m\n总计: $total 张图片，其中含Alpha的有 \033[31m$withAlpha\033[0m 张。\n所有文件已输出到文件夹：\033[36moutput_noalpha/\033[0m"
```

分组操作
```bash
find . -maxdepth 1 -type f -name "截图*.png" -print0 | while IFS= read -r -d '' file; do base_name="${file##*/}"; core_name="${base_name#'截图'}"; core_name="${core_name%.png}"; if [[ "$core_name" == *-* ]]; then dest_dir="分组-${core_name##*-}"; else dest_dir="主图"; fi; mkdir -p "$dest_dir"; mv "$file" "$dest_dir/"; echo "已移动: $base_name -> $dest_dir/"; done; echo "✅ 图片归类完成！"
```

