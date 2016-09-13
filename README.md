# sdkdemoapp_windows
## Windows demo 构建及打包说明
---
### 依赖工具
- VS2013
- CMake

### 流程
1. 解压缩Debug\libcef.zip到Debug下，生成libcef.dll文件。
2. 编译CEF cefsimple项目

# 详细步骤

## 编译CEF cefsimple
### 生成VS项目
- 在https://cmake.org上下载cmake的windows安装版本，比如这个https://cmake.org/files/v3.5/cmake3.5.0rc3win32x86.msi 。
- 安装CMake。
- 运行CMake。
- 如果之前用cmake生成过其它项目，需要先清除缓存：主菜单File->Delete Cache。
- 输入框<where is the source code>内输入项目路径，比如：E:/work/cef。
- 输入框<where to build the binaries>内输入待生成的VS项目路径，比如：E:/work/cef/build。
- 设置CMAKE_INSTALL_PREFIX的值为CMake安装路径，比如：C:\Program Files\CMake\bin。
- 设置USE_SANDBOX为未选中。
- 点击Confiure按钮。
- Confiure完成后点击Generate按钮。
- Generate完成后关闭CMake。

### 编译CEF
用VS2013运行cef\build\cef.sln，编译cefsimple Debug和Release两个版本。
