# easemob\_sdk\_win32集成说明
>windows sdk为用户提供在windows平台上进行开发的js接口及二进制文件，开发语言使用electron。目前支持登录、注册、单聊、群聊、聊天室、文本消息、图片、语音、位置等消息以及透传消息，还可以实现好友管理、群组管理等功能。未实现语音通话和视频通话功能。

## sdk目录结构

Windows sdk目录结构如下

    |-node
      |-modules
        |-message
      index.js
      load.js
    |-easemob
      easemobWin.node
      libcurl.dll
      libcurl.lib

### 加载sdk

直接加载index.js模块,代码如下：

    var easemob = require('../../node/index');
## 基本功能

### 用户登录

登录前，需要先创建配置对象和client对象，用户可以使用 用户名+密码 和 用户名+token 两种方式登录。

用户名+密码登录方式代码如下：

    //easemob-demo#chatdemoui为AppKey，填写自己的Appkey
    var emchatconfigs = new easemob.EMChatConfig(".", ".", "easemob-demo#chatdemoui", 0);
    var emclient = new easemob.EMClient(emchatconfigs);
    var ret = emclient.login("jwfan", "jwfan");
    if(ret.errorCode == 0)
      console.log("login success");
用户名+token登录方式代码如下：

    //easemob-demo#chatdemoui为AppKey，填写自己的Appkey
    var emchatconfigs = new easemob.EMChatConfig(".", ".", "easemob-demo#chatdemoui", 0);
    var emclient = new easemob.EMClient(emchatconfigs);
    var ret = emclient.loginWithToken("jwfan", "Mytoken");
    if(ret.errorCode == 0)
      console.log("login success");
      
登录接口返回值ret为EMError对象，登录成功则ret的errorCode为0，否则可以用description获取错误信息
### 用户退出

用户退出代码如下：

	emclient.logout();
### 连接监听管理

通过注册回调函数，可以监听sdk的连接与断开状态，代码如下

	var listener = new easemob.EMConnectionListener();
	listener.onConnect(() => {
    console.log("EMConnectionListener onConnect");
    });
    listener.onDisconnect((error) => {
    console.log(error.errorCode);
    console.log(error.description);
    console.log("EMConnectionListener onDisconnect");
    });
    listener.onPong(() => {
    console.log("EMConnectionListener onPong");
    });
	emclient.addConnectionListener(listener);
### 日志输出

sdk提供输出到日志文件的js接口，需要先创建EMLog对象，可以输出字符串和数字，代码如下：

    var log = new easemob.EMLog();
    log.Log("Log Test");
    log.Log(5);
    log.Debug("Debug Test");
    log.Debug(5);
    log.Warn("Warn Test");
    log.Warn(5);
    log.Error("Error Test");
    log.Error(5);
注：由于EMChatConfig对象创建时会指定日志输出路径，日志对象的创建一般放到EMChatConfig创建之后。
### 好友管理

好友管理功能包括添加好友，删除好友，同意好友申请，拒绝好友申请，获取用户所有好友，获取黑名单列表，好友移入黑名单，从黑名单移除以及好友管理消息监听。

好友管理模块为EMContactManager，由EMClient模块加载时主动创建，可以使用EMClient模块的getContactManager方法获取，代码如下

    var contactManager = emclient.getContactManager();
#### 获取好友列表

获取好友列表可使用allContacts、getContactsFromServer、getContactsFromDB三个接口获取，代码如下

    var error = new easemob.EMError();
    // 获取当前缓存中的好友列表
    var allContacts = contactManager.allContacts(error);
    // 获取数据库中的好友列表
    var serverContacts = contactManager.getContactsFromServer(error);
	// 从服务端拉取好友列表
    var dbContacts = contactManager.getContactsFromDB(error);
#### 添加好友

	var ret = new easemob.EMError();
	// 参数1为对方用户名，参数2为欢迎信息，参数3为返回错误码
	contactManager.inviteContact("jwfan1", "welcome", ret);
#### 删除好友

	// 参数1为好友用户名，参数2为返回错误码，参数3为是否保持会话，若为false则同时移除会话
	contactManager.deleteContact("jwfan1", ret, true);
#### 同意好友申请

	var error = new easemob.EMError();
	contactManager.acceptInvitation(username, error);
#### 拒绝好友申请

	var error = new easemob.EMError();
	contactManager.declineInvitation(username, error);
#### 获取黑名单

	var blacklist = contactManager.blacklist(error);
#### 设置黑名单

	contactManager.saveBlackList(['jwfan2', 'jwfan3'], error);
#### 移入黑名单

	contactManager.addToBlackList('jwfan2', true, error);
#### 从黑名单移除

	contactManager.removeFromBlackList('jwfan2', error);
#### 监听联系人

通过注册回调函数，监听联系人的变动，代码如下

	var listener = new easemob.EMContactListener();
	listener.onContactAdded((username) => {
    console.log("onContactAdded username: " + username);
	});
	listener.onContactDeleted((username) => {
    console.log("onContactDeleted username: " + username);
    });
    listener.onContactInvited((username, reason) => {
    var error = new easemob.EMError();
    console.log("onContactInvited username: " + username + " reason: " + reason);
    if (username == "jwfan1") {
      contactManager.acceptInvitation(username, error);
    } else {
      contactManager.declineInvitation(username, error);
    }
    console.log("error.errorCode = " + error.errorCode);
    console.log("error.description = " + error.description);
    });
    listener.onContactAgreed((username) => {
    console.log("onContactAgreed username: " + username);
    });
    listener.onContactRefused((username) => {
    console.log("onContactRefused username: " + username);
    });
  
    contactManager.registerContactListener(listener);
#### 结束联系人监听

	contactManager.removeContactListener(listener);
### 组管理

### 发送消息

发送文本、文件、语音、图片、位置等消息（单聊/群聊通用）。
####发送文本消息
