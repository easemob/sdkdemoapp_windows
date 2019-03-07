# easemob\_sdk\windows集成说明
>windows sdk为用户提供在windows平台上进行开发的js接口及二进制文件，开发语言使用electron。目前支持登录、注册、单聊、群聊、聊天室、文本消息、图片、语音、位置等消息以及透传消息，还可以实现好友管理、群组管理等功能。

## 准备
### 开发环境需求
#### 操作系统

>win7/win8/win10 64位操作系统
#### 开发工具

* nodejs

>版本10.0以上，官网地址[http://nodejs.cn](http://nodejs.cn)

* electron
  
>版本4.0以上，官网地址[https://electronjs.org/](https://electronjs.org/),nodejs安装完成后，可以在命令行使用npm命令安装，安装命令：

    npm install electron -g

## sdk目录结构

Windows sdk目录结构如下。使用时将sdk拷贝到工程目录下。

    |-node
      |-modules
        |-message
      index.js
      load.js
    |-easemob
	  easemobMac.node
      easemobWin.node
      libcurl.dll
      libcurl.lib
## sdk模块介绍
SDK 采用模块化设计，每一模块的功能相对独立和完善，用户可以根据自己的需求选择使用下面的模块：
![](http://docs-im.easemob.com/_media/im/android/sdk/image005.png)
模块化设计

* EMClient
> SDK 的入口，主要完成登录、退出、注册、配置管理等功能，管理连接监听模块EMConnectionListener。也是获取其他模块的入口。

* EMChatManager
> 管理消息的收发，完成会话管理等功能,管理会话监听模块EMChatManagerListener。

* EMContactManager
> 负责好友的添加删除，黑名单的管理等功能，管理好友变更监听模块EMContactListener。

* EMGroupManager
> 负责群组的管理，创建、删除群组，管理群组成员等功能，管理群组监听模块EMGroupManagerListener。

* EMChatroomManager
> 负责聊天室的查询、加入、退出功能管理，管理聊天室监听模块EMChatroomManagerListener。

## sdk对象说明
> sdk中使用到的对象包括系统配置信息EMChatConfigs、群组信息EMGroup、群组配置信息EMMucSetting、群文件信息EMMucSharedFile、聊天室信息EMChatroom、会话信息EMConversation、消息EMMessage、文本消息体EMFileMessageBody、图片消息体EMImageMessageBody、文件消息体EMTextMessageBody、命令消息体EMCmdMessageBody。
> 具体接口详见[./jsdoc/out/index.html](./jsdoc/out/index.html "模块定义")


## 基本功能
### 加载sdk

直接加载index.js模块,代码如下：

    var easemob = require('../../node/index');

### 用户登录

登录前，需要先创建配置对象和client对象，用户可以使用 用户名+密码 和 用户名+token 两种方式登录。

创建配置对象

    /**  
     * 首先构造sdk配置信息
     * param1为资源存储路径，输入参数
     * param2为工作路径，输入参数，日志存储在这里
     * param3为appkey，输入参数，easemob-demo#chatdemoui为DemoAppKey，需填写自己的Appkey
     * param4为设备ID，默认0
     * return 配置模块对象
     */
    var emchatconfigs = new easemob.EMChatConfig(".", ".", "easemob-demo#chatdemoui", 0);
创建client对象

    var emclient = new easemob.EMClient(emchatconfigs);
用户名+密码登录方式代码如下：

    /** 
     *  密码登录api,异步操作
     * param username为用户名，输入,String
     * param password为密码，输入,String
     * return 返回Promise对象，response参数为[登录结果](#Result)
     */
    login(username, password)
调用用方法如下：

    emclient.login("jwfan", "jwfan").then((res) =>{
    if(res.code == 0)
      console.log("login success");
    },(error) => {});

用户名+token登录方式代码如下：

    /** 
     *  token登录api,异步操作
     * param username 用户名，输入,String
     * param token 用户token,输入,String
     * return 返回Promise对象，response参数为[登录结果](#Result)
     */
    loginWithToken(username, token)
调用方法如下：

    emclient.loginWithToken("jwfan", "Mytoken").then((res) =>{
    if(res.code == 0)
      console.log("login success");
    },(error) => {});
登录接口返回值ret为EMError对象，登录成功则ret的errorCode为0，否则可以用description获取错误信息
登录后获取用户信息方法如下：

    // 获取用户信息，包括用户名，密码，token
	var loginInfo = emclient.getLoginInfo();
    console.log("loginInfo.loginUser = " + loginInfo.loginUser);
    console.log("loginInfo.loginPassword = " + loginInfo.loginPassword);
    console.log("loginInfo.loginToken = " + loginInfo.loginToken);
### 用户退出
用户退出代码如下：

    // 返回退出结果EMError对象
	emclient.logout().then((res) => {
    if(res.code == 0)
      console.log("logout success");
    },(error) => {});
### 用户注册
接口API如下：

    /** 
     *  账户注册api，异步操作
     * param username 用户名，输入,String
     * param password 密码，输入,String
     * return Promise对象，该对象的response参数为[Result](#Result)
     */
    createAccount(username, password);
调用方法如下：

    emclient.createAccount("newAccount","password").then((res) => {
      if(res.errorCode == 0)
          console.log("createAccount success");
      else
          console.log("createAccount fail:" + res.description);
      },(error) => {})
### 连接监听管理
通过注册回调函数，可以监听sdk的连接与断开状态，在用户登录成功后调用，代码如下

    // 实例化监听模块
	var listener = new easemob.EMConnectionListener();
    // 添加到client
    emclient.addConnectionListener(listener);

    // 连接成功，什么都不需要做
	listener.onConnect(() => {
    console.log("EMConnectionListener onConnect");
    });

    // 连接断开，可能是断网或异地登录被踢，可通过error.errorCode判断，若为206，即为被踢,需要退出登录
    listener.onDisconnect((res) => {
    console.log(res.errorCode);
    console.log(res.description);
    console.log("EMConnectionListener onDisconnect");
    if(res.errorCode == 206)
        emclient.logout();
        console.log("你的账户已在其他地方登录");
    });

    // 移除监听
	emclient.removeConnectionListener(listener);
### 系统配置
系统配置信息模块为EMChatConfig，可以使用emclient的getChatConfigs()接口获取
   
    let config = emclient.getChatConfigs();
配置信息包括日志路径，资源路径、下载路径、是否自动同意好友申请、是否自动同意组邀请、退出群组时是否删除消息等，详见[./jsdoc/out/EmChatConfigs.html](./jsdoc/out/EmChatConfigs.html)
### 日志输出
sdk提供输出到日志文件的js接口，需要先创建EMLog对象，可以输出String和数字，代码如下：

    // 实例化日志对象，日志按等级可分为error,warn,Debug 3级
    var log = new easemob.EMLog();

    // 设置日志等级，0为debug，1为warn,2为error
    log.setLogLevel(0);

    // 可以控制日志是否输出到控制台,默认不输出
    log.setIsDisplayOnConsole(true);

    //输出日志
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
好友列表可以从本地和服务器获取，各接口说明如下

* 从本地中获取

接口API如下

    /** 
     *  获取当前缓存中的好友列表，若缓存中没有则从数据库中获取
     * return 返回[ContactListResult](#ContactListResult)
     */
    allContacts()
调用方法如下

    let res = contactManager.allContacts();
    console.log()
* 从服务器获取

接口API如下：

    /** 
     *  从服务端拉取好友列表,异步操作
     * return 返回Promise对象，response参数为[ContactListResult](#ContactListResult)
     */
    getContactsFromServer()；
调用方法如下：

    contactManager.getContactsFromServer().then(ContactListResult => {
      },(error) => {});

#### 添加好友
接口API如下：

    /** 
     *  添加好友api，异步操作
     * param String,username为对方用户名，输入参数
     * param String,message为欢迎信息，输入参数，对方收到好友申请时可以看到，
     * return Promise对象,response参数为空
     */
    inviteContact(username, message);
调用方法如下：

	contactManager.inviteContact("jwfan1", "welcome").then((res) => {
      },(error) => {})
#### 删除好友
接口API如下：

	/** 
     *  从好友列表移除好友api，异步操作
     * param username 移除目标好友的用户名，输入参数
     * param keepConversation 移除好友后，是否保留会话，输入参数，布尔型，true为保留，false为不保留
     * return Promise对象，response参数[Result](#Result)
     */
    deleteContact(username,keepConversation);
调用方法如下：

	contactManager.deleteContact("jwfan1", true).then((res) => {
      },(error) => {})
#### 同意好友申请
接口API如下：

    /** 
     *  用户收到好友申请后的操作，同意好友申请,异步操作
     * param username 发起好友申请的用户名，输入参数
     * return Promise对象，response参数为[Result](#Result)
     */
    acceptInvitation(username);
调用方法如下：

	contactManager.acceptInvitation(username).then((res) => {
      },(error) => {})
#### 拒绝好友申请
接口API如下：

    /** 
     * 用户收到好友申请后的操作,拒绝好友申请,异步操作
     * param username 发起好友申请的用户名，输入参数
     * return Promise对象，response参数为[Result](#Result)
     */
    declineInvitation(username)
调用方法如下：

	contactManager.declineInvitation(username).then((res) => {
      },(error) => {})
#### 本地获取黑名单
接口API如下：

    /**  
     * 从本地获取用户的黑名单列表，黑名单的用户无法发送消息
     * return [ContactListResult](#ContactListResult) 黑名单列表，data为String数组
     */
    blacklist();
调用方法如下：

	let res = contactManager.blacklist()
#### 服务器获取黑名单
接口API如下：

    /**  
     * 从服务器获取用户的黑名单列表，黑名单的用户无法发送消息
     * return Promise对象，response参数为[ContactListResult](#ContactListResult) 
     */
    getBlackListFromServer();
调用方法如下：

	contactManager.getBlackListFromServer().then((res) => {},(error) => {})
#### 设置黑名单
接口API如下：

    /** 
     *  设置用户的黑名单列表,异步操作
     * param blacklist 输入参数，黑名单列表，StringArray,["ID1","ID2"]
     * return Promise对象，response参数为[Result](#Result)
     */
    saveBlackList(blacklist);
调用方法如下：

	contactManager.saveBlackList(['jwfan2', 'jwfan3']).then((res)=>{},(error) => {});
#### 移入黑名单
接口API如下：

    /** 
     *  添加用户到黑名单列表,异步操作
     * param username 输入参数，要添加的黑名单用户名，String
     * return Promise对象，response参数为[Result](#Result)
     */
    addToBlackList(username);
调用方法如下：

	contactManager.addToBlackList('jwfan2').then((res)=>{},(error) => {});
#### 从黑名单移除
接口API如下：

    /**  
     * 从黑名单列表移除用户,异步操作
     * param username 输入参数，要从黑名单移除的用户名，String
     * return Promise对象，response参数为[Result](#Result)
     */
    removeFromBlackList(username);
调用方法如下：

	contactManager.removeFromBlackList('jwfan2').then((res)=>{},(error) => {});
#### 监听联系人变更
通过注册回调函数，监听联系人的变动，代码如下

    // 实例化监听对象
	var listener = new easemob.EMContactListener();

    // 有好友添加的回调
	listener.onContactAdded((username) => {
    console.log("onContactAdded username: " + username);
	});

    // 有好友删除的回调
	listener.onContactDeleted((username) => {
    console.log("onContactDeleted username: " + username);
    });

    // 收到好友申请的回调，用户可以在这里同意或拒绝好友申请
    listener.onContactInvited((username, reason) => {
    console.log("onContactInvited username: " + username + " reason: " + reason);
    if (username == "jwfan1") {
      let res = contactManager.acceptInvitation(username);
    } else {
      let res = contactManager.declineInvitation(username);
    }
    });

    // 群组邀请成员同意
    listener.onContactAgreed((username) => {
    console.log("onContactAgreed username: " + username);
    });

    // 群组邀请成员拒绝
    listener.onContactRefused((username) => {
    console.log("onContactRefused username: " + username);
    });

    // 注册回调函数
    contactManager.registerContactListener(listener);
#### 结束联系人监听

    // 移除回调监听
	contactManager.removeContactListener(listener);
### 群组管理
群组操作包括组的创建、销毁，根据ID获取组，组成员的邀请、移除、退出，获取用户所在的所有组、公开组，公开组的加入，成员的禁言、解禁，修改组信息（组名、描述），屏蔽群组消息、取消屏蔽群组消息，接受群邀请，拒绝群邀请，接受加入群邀请，拒绝加入群邀请，群主变更，群管理员的添加与移除，群组文件的上传、下载、列表获取、删除，群组公告的获取、设置，以及组设置变更的监听。

好友管理模块为EMGroupManager，由EMClient模块加载时主动创建，可以使用EMClient模块的getGroupManager方法获取，代码如下

    var groupManager = emclient.getGroupManager();
#### 创建群组
创建群组时，需要先实例化一个群组设置对象，然后创建群组
实例化群组设置接口API如下：

    /**  
     * 实例化区群组设置
     * param style 组类型,Number,0为只有群主可以邀请成员加入，1为群主和管理员都可以邀请成员加入，2为普通用户也可以邀请成员加入，但需要群主同意，3为成员可以随意邀请用户加入
     * param maxUserCount 最大成员数,Number，最大200
     * param inviteNeedConfirm 邀请是否需要确认，Bool
     * param extension 扩展信息，String
     * return 返回组设置对象
     */
    EMMucSetting(style, maxUserCount, inviteNeedConfirm, extension)
调用方法如下：

	var setting = new easemob.EMMucSetting(1, 20, false, "test");
创建群组接口API如下：

    /** 
      * 创建群组api
      * param subject 群组名称，输入参数，String
      * param description 群组描述，输入参数，String
      * param welcomeMessage 欢迎信息，输入参数，String
      * param setting 群组设置，输入参数，Object
      * param members 群组初始成员，输入参数，StringArray
      * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
      */
    createGroup(subject, description, welcomeMessage, setting, members)
调用方法如下:

	groupManager.createGroup("subject","description","welcome message",setting,["jwfan1", "jwfan2"]).then((res) => {},(error) => {})
#### 解散群组
接口API如下：

    /**  
     * 解散群组api
     * param groupId 组ID，输入参数
     * return 返回Promise对象，response参数为[Result](#Result)
     */
    destroyGroup(groupId);
调用方法如下:

	groupManager.destroyGroup("55139673112577").then((res)=>{},(error) => {})
#### 本地获取用户所在的所有组
接口API如下：

    /**  
     * 服务器获取用户所有的组
     * return [GroupListResult](GroupListResult)
     */
    allMyGroups()
调用方法如下:

	let res = groupManager.allMyGroups()
#### 服务器获取用户所在的所有组
接口API如下：

    /**  
     * 服务器获取用户所有的组
     * return 返回Promise对象，response参数为[GroupListResult](GroupListResult)
     */
    fetchAllMyGroups()
调用方法如下:

	groupManager.fetchAllMyGroups().then((res)=>{},(error) => {});
#### 根据ID获取组

    let group = groupManager.groupWithId(groupId);
#### 获取组信息
    // 获取组ID
	console.log("group.groupId" + group.groupId());
    // 获取组名
    console.log("group.groupSubject" + group.groupSubject());
    // 获取组描述
    console.log("group.groupDescription" + group.groupDescription());
    // 获取群主
    console.log("group.groupOwner" + group.groupOwner());
    // 获取成员计数
    console.log("group.groupMembersCount" + group.groupMembersCount());
    // 获取群设置类型
    console.log("group.groupMemberType" + group.groupMemberType());
    // 获取群成员
    console.log("members:"+group.groupMembers().join(' || '));
    // 获取群设置对象
    var set = group.groupSetting();
    console.log("set.style() = " + set.style());
    console.log("set.maxUserCount() = " + set.maxUserCount());
    console.log("set.extension() = " + set.extension());

#### 群组成员的邀请
接口API如下：

    /**  
     * 邀请成员入群，一次可邀请多个成员
     * param groupId 群组ID，输入参数，String
     * param members 邀请的成员，输入参数，StringArray,["ID1","ID2"]
     * param welcomeMessage 欢迎信息，输入参数，String
     * 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    addGroupMembers(groupId, members, welcomeMessage);
调用方法如下:

	groupManager.addGroupMembers(groupId, ["jwfan3", "jwfan4"], "hahaha").then((res)=>{},(error) => {})

#### 群组成员的移除
接口API如下：

    /** 
     *  将成员踢出群，同样可踢出多人
     * param groupId 群组ID，输入参数，String
     * param members 踢出的成员，输入参数，StringArray,["ID1","ID2"]
     * 返回Promise对象，response参数为[Result](#Result)
     */
    removeGroupMembers(groupId, members, error);
调用方法如下:

	groupManager.removeGroupMembers(groupId, ["jwfan3", "jwfan4"]).then((res)=>{},(error) => {})
#### 退出群组
接口API如下：

    /** 
     *  成员主动退出群组
     * param groupId 群组ID，输入参数，String
     * 返回Promise对象，response参数为[Result](#Result)
     */
    leaveGroup(groupId)
调用方法如下:

	groupManager.leaveGroup(groupId).then((res)=>{},(error) => {})
#### 获取公开群组
接口API如下：

    /**  
     * 分页获取公开群组
     * param pageNum 第几页，输入参数，Number，0表示不分页，获取所有公开组，1为分页起始
     * param pageSize 每页计数，输入参数，Number,最大200
     * return 返回Promise对象，response参数为[GroupListResult](GroupListResult)
     */
    fetchPublicGroupsWithPage(pageNum, pageSize);
调用方法如下:

	groupManager.fetchPublicGroupsWithPage(1,20).then((res) => {
      },(error) => {})
#### 查找公开群组
接口API如下：

    /**  
     * 根据群ID查找公开群
     * param1 groupId 群组ID，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    searchPublicGroup(groupId);
调用方法如下:

	groupManager.searchPublicGroup(groupId).then((res) => {
      },(error) => {})
#### 加入公开群组
接口API如下：

    /** 
     *  加入PUBLIC_JOIN_OPEN类型公开群组
     * param groupId 群组ID，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    joinPublicGroup(groupId,error)
调用方法如下:

	groupManager.joinPublicGroup(groupId,error).then((res) =>{},(error) => {});
#### 申请加入公开群组
接口API如下：

    /** 
     *  申请加入applyJoinPublicGroup类型公开群组,需要群主或管理员同意
     * param groupId 群组ID，输入参数，String
     * param nickname 用户在群内的昵称，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    applyJoinPublicGroup(groupId,nickname,message)
调用方法如下:

	groupManager.applyJoinPublicGroup(groupId,nickname,message).then((res) =>{},(error) => {});
#### 接受群邀请
接口API如下：

    /**  
     * 接受群组发来的入群邀请
     * param groupId 群组ID，输入参数，String
     * param inviter 邀请人，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    acceptInvitationFromGroup(groupId,inviter)
调用方法如下:

	groupManager.acceptInvitationFromGroup(groupId,inviter).then((res) =>{},(error) => {});
#### 拒绝群邀请
接口API如下：

    /**  
     * 拒绝群组发来的入群邀请
     * param groupId 群组ID，输入参数，String
     * param inviter 邀请人，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    declineInvitationFromGroup(groupId,inviter)
调用方法如下:

	groupManager.declineInvitationFromGroup(groupId,inviter).then((res) =>{},(error) => {});
#### 接受加入群申请
接口API如下：

    /**  
     * 同意成员的入群邀请，由群主操作
     * param groupId 群组ID，输入参数，String
     * param from 入群申请人，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    acceptJoinGroupApplication(groupId,from)
调用方法如下:

	groupManager.acceptJoinGroupApplication(groupId,from).then((res) =>{},(error) => {});
#### 拒绝加入群申请
接口API如下：

    /**  
     * 拒绝成员的入群邀请，由群主操作
     * param groupId 群组ID，输入参数，String
     * param from 入群申请人，输入参数，String
     * param reason 拒绝原因，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    declineJoinGroupApplication(groupId,from,reason)
调用方法如下:

	groupManager.declineJoinGroupApplication(groupId,from,"decline reason").then((res) =>{},(error) => {});

#### 成员禁言
接口API如下：

    /**  
     * 禁止成员在组内发言
     * param groupId 群组ID，输入参数，String
     * param members 成员列表，输入参数，String数组
     * param reason 禁言原因，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    blockGroupMembers(groupId,members,reason)
调用方法如下:

	groupManager.blockGroupMembers(groupId, members, "reason").then((res) =>{},(error) => {});
#### 获取禁言成员列表
接口API如下：

	/**  
     * 分页获取禁言成员列表
     * param groupId 群组ID，输入参数，String
     * param pageNum 第几页，输入参数，Number，1为起始页
     * param pageSize 每页计数，输入参数，Number，最大200
     * return 返回Promise对象，response参数为[GroupListResult](#GroupListResult)
     */
    fetchGroupBans(groupId,pageNum, pageSize)
调用方法如下:

    groupManager.fetchGroupBans(groupId, 1, 20).then((res) =>{},(error) => {});
#### 取消成员禁言
接口API如下：

    /**  
     * 取消禁言成员
     * param groupId 群组ID，输入参数，String
     * param members 成员列表，输入参数，StringArray
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    unblockGroupMembers(groupId, members)
调用方法如下:

	groupManager.unblockGroupMembers(groupId, members).then((res) =>{},(error) => {});
#### 修改群信息
接口API如下：

    /**  
     * 修改群标题
     * param groupId 群组ID，输入参数，String
     * param newSubject 群组新组名，输入参数，String
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，response参数为EMGroup
     */
	groupManager.changeGroupSubject(groupId, newSubject, error);

    /** 
     *  修改群描述
     * param groupId 群组ID，输入参数，String
     * param newDescription 群组新描述，输入参数，String
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，response参数为EMGroup
     */
	changeGroupDescription(groupId, newDescription, error)
调用方法如下:

	groupManager.changeGroupSubject(groupId, "new Subject", error).then((group) =>{},(error) => {});
    groupManager.changeGroupDescription(groupId, "new Description", error).then((group) =>{},(error) => {});
	
#### 屏蔽群组消息
接口API如下：

    /**  
     * 屏蔽群组消息
     * param groupId 群组ID，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
	blockGroupMessage(groupId)
调用方法如下:

	groupManager.blockGroupMessage(groupId).then((res) =>{},(error) => {});
#### 取消屏蔽群组消息
接口API如下：

    /**  
     * 取消屏蔽群组消息
     * param groupId 群组ID，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
	unblockGroupMessage(groupId)
调用方法如下:

	groupManager.unblockGroupMessage(groupId).then((res) =>{},(error) => {});
#### 群主变更
接口API如下：

    /**  
     * 转移群主，只有群主能操作
     * param groupId 群组ID，输入参数，String
     * param member 新群主用户名，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
	transferGroupOwner(groupId, member)
调用方法如下:

	groupManager.transferGroupOwner(groupId, member).then((res) =>{},(error) => {});
#### 添加管理员
接口API如下：

    /**  
     * 将普通群成员提升为管理员
     * param groupId 群组ID，输入参数，String
     * param member 成员用户名，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
	addGroupAdmin(groupId, member)
调用方法如下:

	groupManager.addGroupAdmin(groupId, member).then((res) =>{},(error) => {});
#### 删除管理员
接口API如下：

    /**  
     * 将管理员降级为普通成员
     * param groupId 群组ID，输入参数，String
     * param member 管理员用户名，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
	removeGroupAdmin(groupId, member)
调用方法如下:

	groupManager.removeGroupAdmin(groupId, member).then((res) =>{},(error) => {});
#### 上传群文件
上传群文件过程中，需要使用回调监控上传进度及结果

	// 设置回调函数显示上传进度和结果
	var emUploadCallback = new easemob.EMCallback();
    console.log("create upload emCallback success");

    // 上传成功
    emUploadCallback.onSuccess(() => {
        console.log("upload emCallback call back success");
        return true;
    });
    // 上传失败
    emUploadCallback.onFail((error) => {
        console.log("upload emCallback call back fail");
        console.log(error.description);
        console.log(error.errorCode);
        return true;
    });
    // 上传进度
    emUploadCallback.onProgress((progress) => {
        if (progress >= 98) {
            console.log("upload call back progress " + progress);
        }
    });

    /**  
     * 上传群文件
     * param groupId 群组ID，输入参数，String
     * param filepath 文件路径，输入参数，String
     * param emUploadCallback 设置回调，输入
     * 返回Promise对象，response参数为[SharedFileResult](#SharedFileResult)
     */
    uploadGroupSharedFile(groupId, filepath, emUploadCallback)
调用方法如下:

	groupManager.uploadGroupSharedFile(groupId, filepath, emUploadCallback).then((res) => {},(error) => {});
#### 获取群文件列表
接口API如下：

    /**  
     * 分页获取群文件列表
     * param groupId 群组ID，输入参数，String
     * param pageNum 当前页数，从1开始
     * param pageSize 每页计数，最大200
     * return 返回Promise对象，response参数为[SharedFileListResult](#SharedFileListResult)
     */
    fetchGroupSharedFiles(groupId, pageNum, pageSize)
调用方法如下:

	groupManager.fetchGroupSharedFiles(groupId, 1, 20).then((res) => {},(error) => {});
#### 下载群文件
下载群文件过程中需要使用回调监控下载进度及结果

	var emDownloadCallback = new easemob.EMCallback();
    console.log("create download emCallback success");

    // 下载成功
    emDownloadCallback.onSuccess(() => {
        console.log("download emCallback call back success");
        return true;
    });
    // 下载失败
    emDownloadCallback.onFail((error) => {
        console.log("download emCallback call back fail");
        console.log(error.description);
        console.log(error.errorCode);
        return true;
    });
    // 下载进度
    emDownloadCallback.onProgress((progress) => {
        if (progress >= 98) {
            console.log("download call back progress " + progress);
        }
    });
接口API如下：

    /**  
     * 下载群文件
     * param groupId 群组ID，输入参数，String
     * param filePath 文件本地存储路径，输入参数，String
     * param fileId 文件ID，输入参数，由文件列表数组获取
     * param callback 设置回调，输入
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    downloadGroupSharedFile(groupId, filePath, fileId, callback)
调用方法如下:

    let fileId = sharedFile.fileId();
    groupManager.downloadGroupSharedFile(groupid, filelocalpath, fileId, emDownloadCallback);
#### 删除群文件
接口API如下：

    /**  
     * 删除群文件
     * param groupId 群组ID，输入参数，String
     * param fileId 文件ID，输入参数，由文件列表获取
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    deleteGroupSharedFile(groupId, fileId)
调用方法如下:

    let fileId = sharedFile.fileId();
	groupManager.deleteGroupSharedFile(groupId, fileId).then((res) =>{},(error) => {});
#### 群组公告的管理
接口API如下：

    /**  
     * 设置群组公告
     * param groupId 群组ID，输入参数，String
     * param announcement 群组公告，输入参数，String
     * return 返回Promise对象，response参数为[GroupResult](#GroupResult)
     */
    updateGroupAnnouncement(groupId, announcement,error)

	/**  
     * 获取群组公告
     * param groupId 群组ID，输入参数，String
     * return 返回Promise对象，response参数为[AnnouncementResult](#AnnouncementResult)
     */
    fetchGroupAnnouncement(groupId)
调用方法如下:
	groupManager.fetchGroupAnnouncement(groupId).then((res) =>{},(error) => {});
	groupManager.updateGroupAnnouncement(groupId, "new announcement").then((res) =>{},(error) => {});

#### 组变更的监听

	groupManager = emclient.getGroupManager();
	groupListener = new easemob.EMGroupManagerListener(groupManager);
	// 添加群管理员时触发(只有是自己时才能收到通知)
	// group : 发生操作的群组
	// admin : 被提升的群管理员
	groupListener.onAddAdminFromGroup((groupId, admin) => {
		console.log("onAddAdminFromGroup:"+groupId+" admin:"+admin);
	});

	// 删除群管理员时触发(只有是自己时才能收到通知)
	// group : 发生操作的群组
	// admin : 被删除的群管理员（群管理员变成普通群成员）
	groupListener.onRemoveAdminFromGroup((groupId, admin) => {
		console.log("onRemoveAdminFromGroup:"+groupId+" admin:"+admin);
	});

	// 转让群主的时候触发
	// group : 发生操作的群组
	// newOwner : 新群主
	// oldOwner : 原群主
	groupListener.onAssignOwnerFromGroup((groupId, newOwner, oldOwner) => {
		console.log("onAssignOwnerFromGroup:"+groupId+" newOwner:"+newOwner + " oldOwner:" + oldOwner);
	});

	// 我接收到自动进群时被触发
	// group : 发生操作的群组
	// inviter : 邀请人
	// inviteMessage : 邀请信息
	groupListener.onAutoAcceptInvitationFromGroup((groupId, inviter, inviteMessage)=>{
		console.log("onAutoAcceptInvitationFromGroup:"+groupId+" inviter:"+inviter + " inviteMessage:" + inviteMessage);
		});

	// 成员加入群组时触发
	// group : 发生操作的群组
	// member : 加入群组的成员名称
	groupListener.onMemberJoinedGroup((groupId, member)=>{
		console.log("onMemberJoinedGroup:"+groupId+" member:"+member);
	});

	// 成员离开群组时触发
	// group : 发生操作的群组
	// member : 离开群组的成员名称
	groupListener.onMemberLeftGroup((groupId, member)=>{
		console.log("onMemberLeftGroup:"+groupId+" member:"+member);
	});

	// 离开群组时触发
	// group : 发生操作的群组
	// reason : 离开群组的原因（0: 被踢出 1:群组解散 2:被服务器下线）
	groupListener.onLeaveGroup((groupId, reason)=>{
		console.log("onLeaveGroup:"+groupId+" reason:"+reason);
	});
	groupManager.addListener(groupListener);
    // 移除监听
    groupManager.removeListener(groupListener);
### 会话管理
会话管理功能包括获取会话、获取会话属性、删除会话、获取会话消息、删除会话消息、获取会话消息计数等功能。

会话管理模块为EMChatManager，由EMClient模块加载时主动创建，可以使用EMClient模块的getChatManager方法获取，代码如下

    var chatManager = emclient.getChatManager();
#### 获取会话列表
接口API如下：

    /** 
     * 获取会话列表
     * return 返回会话列表，EMConversation数组
     */
    getConversations()
调用方法如下:

	var convlist = chatManager.getConversations();
#### 根据会话ID获取会话
接口API如下：

    /** 
     * 获取会话
     * param conversationId 会话ID，输入参数，String
     * param type 会话类型，输入参数，0为单聊，1为群聊
     * return 会话，EMConversation
     */
    conversationWithType(conversationId,type)
调用方法如下:

	let conversationlist = chatManager.conversationWithType(conversationId,type);
#### 获取会话属性

    // 获取会话ID
	console.log("conversationId" + conversation.conversationId());
    // 获取会话类型，0为单聊，1为群聊
	console.log("conversationType" + conversation.conversationType());
#### 删除会话
接口API如下：

    /** 根据ID删除会话
     * param conversationId 会话ID,输入参数
     * param isRemoveMessages 是否删除消息，ture为删除
     */
    removeConversation(conversationId，isRemoveMessages)
调用方法如下:

	chatManager.removeConversation(conversationId，true);
#### 下载图片、附件

    // 下载附件消息，message为EMMessage对象，可在message中设置回调
	chatManager.downloadMessageAttachments(message);
    // 下载图片缩略，message为EMMessage对象，可在message中设置回调
    chatManager.downloadMessageThumbnail(message);
#### 获取历史消息
接口API如下：

    /** 
     * 分页获取历史消息,从服务器获取
     * param conversationId 会话ID,输入参数
     * param type 会话类型，1为群组，0为单聊
     * param pageSize 每页的消息计数
     * param startMsgId 起始消息ID
     * return 返回Promise对象，response参数为[MessageListResult](#MessageListResult)
     */
    chatManager.fetchHistoryMessages(conversationId, type, pageSize, startMsgId)
调用方法如下:

	chatManager.fetchHistoryMessages(conversationId, type, pageSize, startMsgId).then((res) => {},(error) => {});
#### 根据消息ID获取消息
接口API如下：

    /**
      * 根据消息ID获取消息
      * param messageId 要获取的消息Id，String
      * return 返回操作结果，Bool
	getMessage(messageId);
调用方法如下:

    let message = chatManager.getMessage(messageId);
#### 插入消息
接口API如下：

    /**
      * 不发送消息，只是插入到本地，按照时间插入到本地数据库
      * param messagelist 要插入的消息列表，EMMessage数组
      * return 返回操作结果，Bool
	insertMessages(messagelist);
调用方法如下:

    chatManager.insertMessages(messagelist);
#### 添加消息
接口API如下：

    /**
      * 在末尾添加一条消息
      * param message 要插入的消息，EMMessage对象
      * return 返回操作结果，Bool
	appendMessage(message);
调用方法如下:

    chatManager.appendMessage(message);
#### 修改消息
接口API如下：

    /**
      * 修改一条消息，不能改变消息ID
      * param message 要插入的消息，EMMessage对象
      * return 返回操作结果，Bool
	updateMessage(message);
调用方法如下:

    chatManager.updateMessage(message);
#### 加载会话消息
接口API如下：

    /** 
     * 按照ID加载会话消息
     * param refMsgId 起始消息ID,输入参数，空为最新消息,String
     * param count 加载的消息数，输入参数,Number
     * param direction 消息加载方向填0
     * return 返回为EMMessage数组
     */
	loadMoreMessagesByMsgId(refMsgId, count, direction);

	/** 
     * 按照时间加载会话消息
     * param timeStamp 起始消息时间，输入参数
     * param count 加载的消息数，输入参数
     * param direction 消息加载方向，填0
     * return 返回EMMessage数组
     */
	conversation.loadMoreMessagesByTime(timeStamp, count, direction);
调用方法如下:

	conversation.loadMoreMessagesByMsgId("", 20,0);
	conversation.loadMoreMessagesByTime(timeStamp, 20,0);
#### 删除会话消息
接口API如下：

    /** 
     * 按照ID移除会话消息，只操作缓存和本地数据库
     * param messageId 要删除的消息ID
     * return 返回操作结果，bool型
     */
    removeMessage(messageId)
调用方法如下:

	conversation.removeMessage(messageId).then((res)=>{},(error) => {});
#### 清空会话消息
接口API如下：

    /** 
     * 清空会话消息，只操作缓存和本地数据库
     * return 返回操作结果，bool型
     */
    clearAllMessages()
调用方法如下:

	conversation.clearAllMessages();
#### 设置消息已读状态
接口API如下：

    /** 
     * 根据消息ID标记消息已读状态
     * param msgid，消息ID
     * isread bool，已读状态
     * return 返回操作结果，bool型
     */
	markMessageAsRead(msgid,isread);
    /** 
     * 标记会话中所有消息的已读状态
     * isread bool，已读状态
     * return 返回操作结果，bool型
     */
	markAllMessagesAsRead(isread);
调用方法如下:

	conversation.markMessageAsRead(msgid,isread);
	conversation.markAllMessagesAsRead(isread);
#### 获取会话中的消息计数
接口API如下：

    /** 
     * 获取会话中的消息计数
     * return 消息计数,Number
     */
    messagesCount()
调用方法如下：

	var msgCount = conversation.messagesCount();
#### 获取会话中的未读消息计数
接口API如下：

    /** 
     * 获取会话中的未读消息计数
     * return 未读消息计数,Number
     */
    unreadMessagesCount()
调用方法如下：

	var unreaddMsgCount = conversation.unreadMessagesCount();
#### 获取最新一条消息
接口API如下：

    /** 
     * 获取会话中的最新一条消息
     * return EMMessage消息对象
     */
    latestMessage()
调用方法如下：

	var msg = conversation.latestMessage();
#### 根据消息ID获取消息
接口API如下：

    /** 
     * 根据消息ID获取消息
     * param msgid 消息ID
     * return 未读消息计数
     */
    loadMessage(msgid)
调用方法如下：

	var msg = conversation.loadMessage(msgid);

#### 会话扩展属性
接口API如下：

    /** 
     * 设置会话扩展属性
     * param ext 扩展属性，String
     * return 无
     */
    setExtField(strAttr)
    /** 
     * 获取会话扩展属性
     * return 扩展属性，String
     * return 无
     */
    extField()
调用方法如下：

	conversation.setExtField(ext);
	var strAttr = conversation.extField();
### 发送消息

发送文本、文件、图片等消息（单聊/群聊通用）。完整的消息发送过程，包括创建消息体，创建消息，设置属性，设置回调，然后发送消息，不同的消息类型只是在创建消息体过程不同，其他步骤一样。
#### 发送文本消息

    /** 
     * 创建文本消息体
     * param1 文本消息正文，输入参数，String
     * return 消息体EMTextMessageBody
     */
	var textMsgBody = new easemob.EMTextMessageBody("wahhahahaha");
    /** 
     * 创建消息
     * param1 发送者用户名，输入参数
     * param2 目的端，会话ID，输入参数
     * param3 消息体EMTextMessageBody
     * return 消息EMMessage
     */
	var textSendMsg = easemob.createSendMessage("jwfan", "jwfan1", textMsgBody);
	// 消息可以设置扩展属性，用户界面可通过自定义属性，实现自定义等功能
	textSendMsg.setAttribute("data", 120);
    data = textSendMsg.getAttribute("data");
	// 设置消息类型,0为单聊，1为群聊，2为聊天室
	textSendMsg.setChatType(0);
	// 设置回调
	var emCallback = new easemob.EMCallback();
	emCallback.onSuccess(() => {
		console.log("emCallback call back success");
		if(me.cfr){
			console.log(sendMessage);
			console.log(sendMessage.msgId());
			return true;
		});
		emCallback.onFail((error) => {
			console.log("emCallback call back fail");
			console.log(error.description);
			console.log(error.errorCode);
			return true;
		});
		emCallback.onProgress((progress) => {
			console.log(progress);
			console.log("call back progress");
		});
	sendMessage.setCallback(emCallback);
	// 发送消息
	chatManager.sendMessage(textMsg);
#### 发送文件

    /** 
     * 创建文件消息体
     * param1 文件路径，输入参数，String
     * return 消息体EMFileMessageBody
     */
	var fileMsgBody = new easemob.EMFileMessageBody("/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/file.txt");
    // 创建消息
    var fileMsg = easemob.createSendMessage("jwfan", "jwfan1", fileMsgBody);
    //setCallback(callback) 设置消息回调函数，通过回调函数显示消息发送成功失败，以及附件上传百分比
    //callback easemob.EMCallback的实例，设置onSuccess、onFail和onProgress三个回调函数。
    fileMsg.setCallback(emCallback);
    chatManager.sendMessage(fileMsg);
#### 发送图片

    /** 
     * 创建图片消息体
     * param1 图片文件路径，输入参数，String
     * param2 图片缩略图路径，输入参数
     * return 消息体EMFileMessageBody
     */
    var imageMsgBody = new easemob.EMImageMessageBody('/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/image_960x718.jpg', '/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/thumb_image.jpg');
    var imageMsg = easemob.createSendMessage("jwfan", "jwfan1", imageMsgBody);
    imageMsg.setCallback(emCallback);
    chatManager.sendMessage(imageMsg);

#### 发送CMD消息

    var cmdMsgBody = new easemob.EMCmdMessageBody("action");
    console.log("cmdMsgBody.type() = " + cmdMsgBody.type());

    console.log("cmdMsgBody.action() = " + cmdMsgBody.action());
    cmdMsgBody.setAction("displayName");
    console.log("cmdMsgBody.action() = " + cmdMsgBody.action());

    var obj1 = {"key" : "1", "value" : "1"};
    var obj2 = {"key" : "2", "value" : "2"};
    console.log("cmdMsgBody.params() = " + cmdMsgBody.params());
    cmdMsgBody.setParams([obj1, obj2]);
	var cmdMsg = easemob.createSendMessage("jwfan", "jwfan1", cmdMsgBody);
    chatManager.sendMessage(cmdMsg);

#### 位置消息
	
    /** 
     * 创建位置消息体
     * param1 位置经度，输入参数，String
     * param2 位置纬度，输入参数
     * param3 地址，输入参数
     * return 消息体EMFileMessageBody
     */
	var locationMsgBody = new easemob.EMLocationMessageBody(123.45, 35.67, 'USA');
    console.log("locationMsgBody.type() = " + locationMsgBody.type());
    console.log("locationMsgBody.latitude() = " + locationMsgBody.latitude());
    console.log("locationMsgBody.longitude() = " + locationMsgBody.longitude());
    console.log("locationMsgBody.address() = " + locationMsgBody.address());
    locationMsgBody.setLatitude(87.87);
    locationMsgBody.setLongitude(45.45);
    locationMsgBody.setAddress('china');
	var locationMsg = easemob.createSendMessage("jwfan", "jwfan1", locationMsgBody);
    chatManager.sendMessage(locationMsg);
### 接收消息
接收消息在会话管理中通过设置回调函数实现，在回调函数中处理

    // 实例化监听回调，并添加到client
	chatManager = emclient.getChatManager();
	listener = new easemob.EMChatManagerListener();
    chatManager.addListener(listener);

	// 收到会话消息
	listener.onReceiveMessages((messages) => {
		console.log("onReceiveMessages messages.length = " + messages.length);
        for (var index = 0, len = messages.length; index < len; index++) {
        var msg = messages[index];
        var bodies = msg.bodies();
        console.log("bodies.length = " + bodies.length);
        var body = bodies[0];
        var type = body.type();
        console.log("msg.from() = " + msg.from());
        console.log("msg.to() = " + msg.to());
        console.log("body.type() = " + type);
        if (type == 0) {    //text message
          console.log("body.text() = " + body.text());
        } else if (type == 1) {     //image message
          console.log("body.displayName() = " + body.displayName());
          console.log("body.localPath() = " + body.localPath());
          chatManager.downloadMessageAttachments(msg);
          chatManager.downloadMessageThumbnail(msg);
        } else if (type == 5) {     //file message
          console.log("body.displayName() = " + body.displayName());
          console.log("body.localPath() = " + body.localPath());
          chatManager.downloadMessageAttachments(msg);
        }
	});
	// 收到命令消息
	listener.onReceiveCmdMessages ((messages) => {
	  for (var index = 0, len = messages.length; index < len; index++) {
      var msg = messages[index];
      var bodies = msg.bodies();
      console.log("bodies.length = " + bodies.length);
      var body = bodies[0];
      var type = body.type();
      console.log("msg.from() = " + msg.from());
      console.log("msg.to() = " + msg.to());
      console.log("msg.type() = " + type);
      console.log("body.action() = " + body.action());
      var params = cmdMsgBody.params()
      console.log("cmdMsgBody.params().length = " + params.length);
      if (params.length > 0) {
        console.log("cmdMsgBody.params()[0] = " + JSON.stringify(params[0]));
      }
    }
	});

	// 收到消息撤回
	listener.onReceiveRecallMessages ((message) => {
	  console.log("onReceiveRecallMessages messages.length = " + messages.length);
	  for (var index = 0, len = messages.length; index < len; index++) {
      var message = messages[index];
      console.log("message.msgId() = " + message.msgId());
      console.log("message.from() = " + message.from());
      console.log("message.to() = " + message.to());
    } 
	});
	// addListener(listener) 添加消息回调监听，从监听中获取接收消息。
### 聊天室管理
聊天室只能有服务端创建，客户端只可以查询、加入和退出聊天室

#### 查询聊天室信息
	// 获取聊天室控制对象
	var chatroomManager = emclient.getChatroomManager();
	// 获取所有聊天室
	var chatroomlist = chatroomManager.fetchAllChatrooms(error);
	// 获取聊天室属性
	chatroomlist.map((chatroom) => {
	  console.log("chatroom id:"+chatroom.chatroomId());
	  console.log("chatroom chatroomSubject:"+chatroom.chatroomSubject());
	  console.log("chatroom chatroomDescription:"+chatroom.chatroomDescription());
	  console.log("chatroom owner:"+chatroom.owner());
	  console.log("chatroom chatroomMemberCount:"+chatroom.chatroomMemberCount());
	  console.log("chatroom chatroomMemberMaxCount:"+chatroom.chatroomMemberMaxCount());
	  console.log("chatroom chatroomAnnouncement:"+chatroom.chatroomAnnouncement());
	  var adminlist = chatroom.chatroomAdmins();
	  var memberlist = chatroom.chatroomMembers();
	  var banslist = chatroom.chatroomBans();
	});
#### 加入聊天室
接口API说明如下：

    /** 
     *  加入聊天室
     * param chatroomid 聊天室ID
     * param error 操作结果
     * return Promise对象，该对象的response参数EMChatroom对象
     */
	joinChatroom(chatroomid,error);
调用方法如下：

    chatroomManager.joinChatroom(chatroomId, error).then((res)=>{},(error) => {});
#### 退出聊天室
接口API说明如下：

    /** 
     *  离开聊天室
     * param chatroomid 聊天室ID
     * param error 操作结果
     * return Promise对象，该对象的response参数为空
     */
	leaveChatroom(chatroomid,error);
调用方法如下：

	chatroomManager.leaveChatroom(chatroomId, error).then((res)=>{},(error) => {});
#### 回调监听

    // 添加消息回调
    var emchatroomlistener = new easemob.EMChatroomManagerListener();
    console.log(emchatroomlistener);
    
    emchatroomlistener.onMemberJoinedChatroom((chatroom,member) => {
        console.log("onMemberJoinedChatroom" + chatroom.chatroomSubject());
        console.log("onMemberJoinedChatroom" + member);
    });
    emchatroomlistener.onMemberLeftChatroom((chatroom,member) => {
        console.log("onMemberLeftChatroom" + chatroom.chatroomSubject());
        console.log("onMemberLeftChatroom" + member);
    });
    //注册监听
    chatroomManager.addListener(emchatroomlistener);
    // 移除监听
    chatroomManager.removeListener(emchatroomlistener);
### 多设备管理监听
当同一账号同时使用桌面端，移动端登录时，需要使用多设备管理监听事件，使用回调实现
	
    // 实例化监听，并添加到客户端
	var listener = new easemob.EMMultiDevicesListener();
    emclient.addMultiDevicesListener(listener);

    // 设置回调
    // 收到其他设备的会话操作
	listener.onContactMultiDevicesEvent((operation, target, ext) => {
      console.log('operation = ' + operation);
      console.log('target = ' + target);
      console.log('ext = ' + ext);
	});
  
    // 收到其他设备的组操作
	listener.onGroupMultiDevicesEvent((operation, target, usernames) => {
      console.log('operation = ' + operation);
      console.log('target = ' + target);
      console.log('usernames = ' + usernames);
	});
## 附录
### 文档中用到的结构体定义
#### Result

    {
      code, //{Number} 0表示成功,其它值为失败
      description //{String} code为非0值时，表示失败原因
    }
#### ContactListResult

    {
        code:result.errorCode, //{Number} 0表示成功,其它值为失败
        description:result.description, //{String} code为非0值时有效，表示失败原因
        data //{StringArray} 用户ID数组，code为0时有效，["ID1","ID2"]
    }
#### GroupResult

    {
        code:result.errorCode, //{Number} 0表示成功,其它值为失败
        description:result.description, //{String} code为非0值时有效，表示失败原因
        data //{StringArray} EMGroup对象，code为0时有效
    }
#### GroupListResult

    {
        code:result.errorCode, //{Number} 0表示成功,其它值为失败
        description:result.description, //{String} code为非0值时有效，表示失败原因
        data //{Array} EMGroup对象数组，code为0时有效
    }
#### SharedFileResult

    {
        code:result.errorCode, //{Number} 0表示成功,其它值为失败
        description:result.description, //{String} code为非0值时有效，表示失败原因
        data //{Object} EMMucSharedFile，code为0时有效
    }
#### SharedFileListResult

    {
        code:result.errorCode, //{Number} 0表示成功,其它值为失败
        description:result.description, //{String} code为非0值时有效，表示失败原因
        data //{Array} EMMucSharedFile对象数组，code为0时有效
    }

#### AnnouncementResult

    {
        code:result.errorCode, //{Number} 0表示成功,其它值为失败
        description:result.description, //{String} code为非0值时有效，表示失败原因
        data //{String} 群组公告内容，code为0时有效
    }

#### MessageListResult

    {
        code:result.errorCode, //{Number} 0表示成功,其它值为失败
        description:result.description, //{String} code为非0值时有效，表示失败原因
        data //{Array} EMMessage对象数组，code为0时有效
    }