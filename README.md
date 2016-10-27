# sdkdemoapp_windows
## Windows demo 构建及运行说明
---
### 依赖工具
- VS2013
- CMake

### 流程
1. 解压缩Debug\libcef.zip到Debug下，生成libcef.dll文件。
2. 引用Windows SDK。
3. 编译CEF cefsimple项目。

# 详细步骤
## 引用Windows SDK
- 从http://www.easemob.com/download/im 下载Windows SDK。
- 解压缩Windows SDK。
- 复制bin\easemob_d.dll到sdkdemoapp_windows\Debug\，复制bin\easemob.dll到sdkdemoapp_windows\Release\。
- 复制lib\easemob_d.lib到sdkdemoapp_windows\Debug\，复制bin\easemob.lib到sdkdemoapp_windows\Release\。
- 复制include目录到sdkdemoapp_windows\easemobsdk_include\。

## 编译CEF cefsimple
### 生成VS项目
- 在https://cmake.org 上下载cmake的windows安装版本，比如这个https://cmake.org/files/v3.5/cmake3.5.0rc3win32x86.msi 。
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

### 运行
编译完成后运行post-build.bat。运行build\cefsimple\Debug\cefsimple.exe或者build\cefsimple\Release\cefsimple.exe
注：在无VS2013开发环境的系统下运行时，需要下载并安装Visual C++ Redistributable Packages for Visual Studio 2013。下载地址：https://www.microsoft.com/en-gb/download/details.aspx?id=40784 ，选择x86平台版本的，文件名为：rtools_setup_x86.exe。
