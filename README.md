# sdkdemoapp_windows
## Windows demo 构建及运行说明
本程序主要基于环信IM SDK和CEF(Chromium Embedded Framework)实现。界面层是CEF的WEB UI，前端主要框架是ReactJS。程序是在CEF官方代码Demo cefsimple的基础上，增加了右键菜单和开发者工具，增加了基于环信IM SDK的即时通讯功能。

主要源文件介绍：
cefsimple_win.cc	程序入口，包括了CEF程序的初始化，消息循环和终止。
simple_app.cc	CefApp、CefBrowserProcessHandler、CefRenderProcessHandler三个类的实现，主要用在OnContextInitialized中创建浏览器实例。
simple_handler.cc	CefClient和CefContextMenuHandler的实现。主要功能：OnBeforePopup中处理自定义协议浏览请求；OnBeforeContextMenu中实现右键菜单。
EasemobCefMessageRouterBrowserSideDelegate.cpp	浏览器事件代理。处理浏览器事件。在本程序主要用来注册网页调用处理器EasemobCefQueryHandler。
EasemobCefQueryHandler.cpp	网页调用处理器。处理从网页中JS代码发起的调用请求。
ChatListener.cpp	消息监听器。接收聊天消息（单聊、群聊、聊天室三种类型）。
ConnectionListener.cpp	网络连接监听器。接收网络连接变化通知。
ContactListener.cpp	好友消息监听器。接收添加或删除好友请求的发送和接收消息、接收好友列表变化消息。
GroupManagerListener.cpp	群组消息监听器。接收群组配置消息（非群聊消息），包括群成员变化、加入群请求收发、邀请加入群请求收发等。

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
- 用VS2013运行cef\build\cef.sln
- 修改cefsimple Debug版和Release版项目属性-配置属性中以下三项:常规-平台工具集：v120_xp,链接器-系统-子系统:/subsystem:windows,链接器-系统-所需的最低版本:5.01。
- 编译cefsimple Debug和Release两个版本（CMake生成的VS2013项目文件已经修改Release版为可调试模式，建议使用Release版进行开发和调试，Debug版尚有未知的异常）。

### 运行
编译完成后运行post-build.bat。运行build\cefsimple\Debug\cefsimple.exe或者build\cefsimple\Release\cefsimple.exe
注：在无VS2013开发环境的系统下运行时，需要下载并安装Visual C++ Redistributable Packages for Visual Studio 2013。下载地址：https://www.microsoft.com/en-gb/download/details.aspx?id=40784 ，选择x86平台版本的，文件名为：rtools_setup_x86.exe。
