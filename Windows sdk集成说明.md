# easemob\_sdk\windows集成说明
>windows sdk为用户提供在windows平台上进行开发的js接口及二进制文件，开发语言使用electron。目前支持登录、注册、单聊、群聊、聊天室、文本消息、图片、语音、位置等消息以及透传消息，还可以实现好友管理、群组管理等功能。

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
     *  登录api
     * param1为用户名，输入
     * param2为密码，输入
     * return 登录结果，EMError对象，若登录成功则errorCode属性为0，登录失败，则description显示失败信息
     */
    var ret = emclient.login("jwfan", "jwfan");
    if(ret.errorCode == 0)
      console.log("login success");
用户名+token登录方式代码如下：

    //easemob-demo#chatdemoui为AppKey，填写自己的Appkey
    var emchatconfigs = new easemob.EMChatConfig(".", ".", "easemob-demo#chatdemoui", 0);
    var emclient = new easemob.EMClient(emchatconfigs);
    // 参数2为token
    var ret = emclient.loginWithToken("jwfan", "Mytoken");
    if(ret.errorCode == 0)
      console.log("login success");
      
登录接口返回值ret为EMError对象，登录成功则ret的errorCode为0，否则可以用description获取错误信息
登录后获取用户信息方法如下：

    // 获取用户信息，包括用户名，密码，token
	var loginInfo = emclient.getLoginInfo();
    console.log("loginInfo.loginUser = " + loginInfo.loginUser());
    console.log("loginInfo.loginPassword = " + loginInfo.loginPassword());
    console.log("loginInfo.loginToken = " + loginInfo.loginToken());
### 用户退出
用户退出代码如下：

    // 返回退出结果EMError对象
	ver error = emclient.logout();
### 用户注册

    /** 
     *  账户注册api，异步操作
     * param username 用户名，输入
     * param password 密码，输入
     * return Promise对象，该对象的resolve参数为注册结果，EMError对象，若登录成功则errorCode属性为0，登录失败，则description显示失败信息
     */
    createAccount(username, password);
调用方法如下：

    emclient.createAccount("newAccount","password").then((error) => {
      if(error.errorCode == 0)
          console.log("createAccount success");
      else
          console.log("createAccount fail:" + error.description);
      })
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
    listener.onDisconnect((error) => {
    console.log(error.errorCode);
    console.log(error.description);
    console.log("EMConnectionListener onDisconnect");
    if(error.errorCode == 206)
        emclient.logout();
        console.log("你的账户已在其他地方登录");
    });

    // 心跳
    listener.onPong(() => {
    console.log("EMConnectionListener onPong");
    });
	emclient.addConnectionListener(listener);
### 日志输出
sdk提供输出到日志文件的js接口，需要先创建EMLog对象，可以输出字符串和数字，代码如下：

    // 实例化日志对象，日志按等级可分为error,warn,Debug 3级
    var log = new easemob.EMLog();

    // 设置日志等级，0为debug，1为warn,2为error
    log.setLogLevel(0);

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
好友列表可以从缓存中，本地数据库中和服务器获取，各接口说明如下

* 从缓存中获取

接口API如下

    /** 
     *  获取当前缓存中的好友列表，若缓存中没有则从数据库中获取,异步操作
     * param1 获取好友列表结果，EMError,输出参数，成功则属性errorCode为0
     * return 返回Promise对象，resolve参数为好友列表，字符串Array
     */
    allContacts(error)
调用方法如下

    var error = new easemob.EMError();
    contactManager.allContacts(error).then(allContacts => {
      });
* 从服务器获取

接口API如下：

    /** 
     *  从服务端拉取好友列表,异步操作
     * param1 获取好友列表结果，EMError,输出参数，成功则属性errorCode为0
     * return 返回Promise对象，resolve参数为好友列表，字符串Array
     */
    getContactsFromServer(error)；
调用方法如下：

    var error = new easemob.EMError();
    contactManager.getContactsFromServer(error).then(allContacts => {
      });
* 从本地数据库获取

接口API如下：

    /** 
     *  从本地数据库获取好友列表,异步操作
     * param1 获取好友列表结果，EMError,输出参数，成功则属性errorCode为0
     * return 返回Promise对象，resolve参数为好友列表，字符串Array
     */
    getContactsFromDB(error);
调用方法如下:

    var error = new easemob.EMError();
    contactManager.getContactsFromDB(error);
#### 添加好友
接口API如下：

	/** 
     *  添加好友api，异步操作
     * param username为对方用户名，输入参数
     * param message为欢迎信息，输入参数，对方收到好友申请时可以看到，
     * param error为返回错误码，输出参数，EMError,errorCode为0表示申请发送成功
     * return Promise对象,resolve参数为空
     */
    inviteContact(username, message, error);
调用方法如下：

    var error = new easemob.EMError();
	contactManager.inviteContact("jwfan1", "welcome", error).then(() => {
      })
#### 删除好友
接口API如下：

	/** 
     *  从好友列表移除好友api，异步操作
     * param username 移除目标好友的用户名，输入参数
     * param error 移除结果，输出参数，EMError,错误ID为0表示删除好友成功
     * param keepConversation 移除好友后，是否保留会话，输入参数，布尔型，true为保留，false为不保留
     * return Promise对象，resolve参数为空
     */
    deleteContact(username, error,keepConversation);
调用方法如下：

    var error = new easemob.EMError();
	contactManager.deleteContact("jwfan1", error, true).then(() => {
      })
#### 同意好友申请
接口API如下：

    /** 
     *  用户收到好友申请后的操作，同意好友申请,异步操作
     * param username 发起好友申请的用户名，输入参数
     * param error 操作结果，输出参数
     * return Promise对象，resolve参数为空
     */
    acceptInvitation(username, error);
调用方法如下：

	var error = new easemob.EMError();
	contactManager.acceptInvitation(username, error).then(() => {
      })
#### 拒绝好友申请
接口API如下：

    /** 
     * 用户收到好友申请后的操作,拒绝好友申请,异步操作
     * param username 发起好友申请的用户名，输入参数
     * param error 操作结果，输出参数
     * return Promise对象，resolve参数为空
     */
    declineInvitation(username, error)
调用方法如下：

	var error = new easemob.EMError();
	contactManager.declineInvitation(username, error).then(() => {
      })
#### 获取黑名单
接口API如下：

    /**  
     * 获取用户的黑名单列表，黑名单的用户无法发送消息,异步操作
     * param error 操作结果，输出参数，EMError,错误ID为0表示成功
     * return Promise对象，resolve参数为黑名单列表，字符串数组
     */
    blacklist(error);
调用方法如下：

    var error = new easemob.EMError();
	contactManager.blacklist(error).then((blacklist) => {
      })
#### 设置黑名单
接口API如下：

    /** 
     *  设置用户的黑名单列表,异步操作
     * param blacklist 输入参数，黑名单列表，字符串数组
     * param error 操作结果，输出参数，EMError,错误ID为0表示成功
     * return Promise对象，resolve参数为空
     */
    saveBlackList(blacklist, error);
调用方法如下：

    var error = new easemob.EMError();
	contactManager.saveBlackList(['jwfan2', 'jwfan3'], error).then(()=>{});
#### 移入黑名单
接口API如下：

    /** 
     *  添加用户到黑名单列表,异步操作
     * param username 输入参数，要添加的黑名单用户名，字符串
     * param both 输入参数，设置为true
     * param error 操作结果，输出参数，EMError,错误ID为0表示成功
     * return Promise对象，resolve参数为空
     */
    addToBlackList(username, both, error);
调用方法如下：

    var error = new easemob.EMError();
	contactManager.addToBlackList('jwfan2', true, error).then(()=>{});
#### 从黑名单移除
接口API如下：

    /**  
     * 从黑名单列表移除用户,异步操作
     * param username 输入参数，要添加的黑名单用户名，字符串
     * param error 操作结果，输出参数，EMError,错误ID为0表示成功
     * return Promise对象，resolve参数为空
     */
    removeFromBlackList(username, error);
调用方法如下：

	contactManager.removeFromBlackList('jwfan2', error).then(()=>{});
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
创建群组时，需要先实例化一个群组设置对象，然后创建群组,接口API如下：

	/**  
     * 实例化区群组设置
     * param1 组类型,int,0为只有群主可以邀请成员加入，1为群主和管理员都可以邀请成员加入，2为普通用户也可以邀请成员加入，但需要群主同意，3为成员可以随意邀请用户加入
     * param2 最大成员数
     * param3 邀请是否需要确认
     * param4 扩展信息
     * return 返回组设置对象
     */
	var setting = new easemob.EMMucSetting(1, 20, false, "test");
    /** 
      * 创建群组api
      * param subject 群组名称，输入参数，字符串
      * param description 群组描述，输入参数，字符串
      * param welcomeMessage 欢迎信息，输入参数，字符串
      * param setting 群组设置，输入参数
      * param members 群组初始成员，输入参数，字符串数组
      * param error 群组创建结果，输出参数，EMError
      * return 返回Promise对象，resolve参数为创建的组EMGroup
      */
    createGroup = function (subject, description, welcomeMessage, setting, members, error)
调用方法如下:

	groupManager.createGroup("subject","description","welcome message",setting,["jwfan1", "jwfan2"], error).then((group) => {})
#### 解散群组
接口API如下：

	/**  
     * 解散群组api
     * param groupId 组ID，输入参数
     * param error 解散群组结果，输出参数，errorCode为0表示成功
     * return 返回Promise对象，resolve参数为空
     */
    destroyGroup(groupId, error);
调用方法如下:

	groupManager.destroyGroup("55139673112577", error).then(()=>{})
#### 根据ID获取组

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
     * param groupId 群组ID，输入参数，字符串
     * param members 邀请的成员，输入参数，字符串数组
     * param welcomeMessage 欢迎信息，输入参数，字符串
     * param error 操作结果，输出参数,EMError
     * 返回Promise对象，resolve参数为空
     */
    addGroupMembers(groupId, members, welcomeMessage, error);
调用方法如下:

	groupManager.addGroupMembers(groupId, ["jwfan3", "jwfan4"], "hahaha", error).then(()=>{})

#### 群组成员的移除
接口API如下：

    /** 
     *  将成员踢出群，同样可踢出多人
     * param groupId 群组ID，输入参数，字符串
     * param members 踢出的成员，输入参数，字符串数组
     * param error 操作结果，输出参数
     * 返回Promise对象，resolve参数为空
     */
    removeGroupMembers(groupId, members, error);
调用方法如下:

	groupManager.removeGroupMembers(groupId, ["jwfan3", "jwfan4"], error).then(()=>{})
#### 退出群组
接口API如下：

    /** 
     *  成员主动退出群组
     * param groupId 群组ID，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * 返回Promise对象，resolve参数为空
     */
    leaveGroup(groupId,error)
调用方法如下:

	groupManager.leaveGroup(groupId,error).then(()=>{})
#### 获取用户所在的所有组
接口API如下：

    /**  
     * 获取用户所有的组
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为groupId数组
     */
    fetchAllMyGroups(error)
调用方法如下:

	groupManager.fetchAllMyGroups(error).then((groupIdlist)=>{});
#### 获取公开群组
接口API如下：

    /**  
     * 分页获取公开群组
     * param1 第几页，输入参数，整型
     * param2 每页计数，输入参数，整型
     * param3 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMCursorResult对象，可使用result()方法获取groupId数组
     */
    fetchPublicGroupsWithPage(pageNum, pageSize, error);
调用方法如下:

	groupManager.fetchPublicGroupsWithPage(1,20,error).then((cursorResult) => {
      var publicGroupList = cursorResult.result();
      })
#### 加入公开群组
接口API如下：

    /** 
     *  加入公开群组
     * param groupId 群组ID，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为group
     */
    joinPublicGroup(groupId,error)
调用方法如下:

	groupManager.joinPublicGroup(groupId,error).then((group) =>{});
#### 接受群邀请
接口API如下：

    /**  
     * 接受群组发来的入群邀请
     * param groupId 群组ID，输入参数，字符串
     * param inviter 邀请人，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为group
     */
    acceptInvitationFromGroup(groupId,inviter,error)
调用方法如下:

	groupManager.acceptInvitationFromGroup(groupId,inviter,error).then((group) =>{});
#### 拒绝群邀请
接口API如下：

    /**  
     * 拒绝群组发来的入群邀请
     * param groupId 群组ID，输入参数，字符串
     * param inviter 邀请人，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为空
     */
    declineInvitationFromGroup(groupId,inviter,error)
调用方法如下:

	groupManager.declineInvitationFromGroup(groupId,inviter,error).then(() =>{});
#### 接受加入群邀请
接口API如下：

    /**  
     * 同意成员的入群邀请，由群主操作
     * param groupId 群组ID，输入参数，字符串
     * param from 入群申请人，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
    acceptJoinGroupApplication(groupId,from,error)
调用方法如下:

	groupManager.acceptJoinGroupApplication(groupId,from,error).then((group) =>{});
#### 拒绝加入群邀请
接口API如下：

    /**  
     * 拒绝成员的入群邀请，由群主操作
     * param groupId 群组ID，输入参数，字符串
     * param from 入群申请人，输入参数，字符串
     * param reason 拒绝原因，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
    declineJoinGroupApplication(groupId,from,reason,error)
调用方法如下:

	groupManager.declineJoinGroupApplication(groupId,from,"decline reason",error).then((group) =>{});

#### 成员禁言
接口API如下：

    /**  
     * 禁止成员在组内发言
     * param groupId 群组ID，输入参数，字符串
     * param members 成员列表，输入参数，字符串数组
     * param error 操作结果，输出参数，EMError
     * param reason 拒绝原因，输入参数，字符串
     * return 返回Promise对象，resolve参数为EMGroup
     */
    blockGroupMembers(groupId,members,error,reason)
调用方法如下:

	groupManager.blockGroupMembers(groupId, members, error, "reason").then((group) =>{});
#### 获取禁言成员列表
接口API如下：

	/**  
     * 分页获取禁言成员列表
     * param groupId 群组ID，输入参数，字符串
     * param pageNum 第几页，输入参数，整型
     * param pageSize 每页计数，输入参数，整型
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为成员ID数组
     */
    fetchGroupBans(groupId,pageNum, pageSize,error)
调用方法如下:

    groupManager.fetchGroupBans(groupId, 1, 20, error).then((groupIdArray) =>{});
#### 取消成员禁言
接口API如下：

    /**  
     * 取消禁言成员
     * param groupId 群组ID，输入参数，字符串
     * param members 成员列表，输入参数，字符串数组
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
    unblockGroupMembers(groupId, members, error)
调用方法如下:

	groupManager.unblockGroupMembers(groupId, members, error).then((group) =>{});
#### 修改群信息
接口API如下：

    /**  
     * 修改群标题
     * param groupId 群组ID，输入参数，字符串
     * param newSubject 群组新组名，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
	groupManager.changeGroupSubject(groupId, newSubject, error);

    /** 
     *  修改群描述
     * param groupId 群组ID，输入参数，字符串
     * param newDescription 群组新描述，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
	changeGroupDescription(groupId, newDescription, error)
调用方法如下:

	groupManager.changeGroupSubject(groupId, "new Subject", error).then((group) =>{});
    groupManager.changeGroupDescription(groupId, "new Description", error).then((group) =>{});
	
#### 屏蔽群组消息
接口API如下：

    /**  
     * 屏蔽群组消息
     * param groupId 群组ID，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
	blockGroupMessage(groupId, error)
调用方法如下:

	groupManager.blockGroupMessage(groupId, error).then((group) =>{});
#### 取消屏蔽群组消息
接口API如下：

    /**  
     * 取消屏蔽群组消息
     * param groupId 群组ID，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
	unblockGroupMessage(groupId, error)
调用方法如下:

	groupManager.unblockGroupMessage(groupId, error).then((group) =>{});
#### 群主变更
接口API如下：

    /**  
     * 转移群主，只有群主能操作
     * param groupId 群组ID，输入参数，字符串
     * param member 新群主用户名，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
	transferGroupOwner(groupId, member, error)
调用方法如下:

	groupManager.transferGroupOwner(groupId, member, error).then((group) =>{});
#### 添加管理员
接口API如下：

    /**  
     * 将普通群成员提升为管理员
     * param groupId 群组ID，输入参数，字符串
     * param member 成员用户名，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
	addGroupAdmin(groupId, member, error)
调用方法如下:

	groupManager.addGroupAdmin(groupId, member, error).then((group) =>{});
#### 删除管理员
接口API如下：

    /**  
     * 将管理员降级为普通成员
     * param groupId 群组ID，输入参数，字符串
     * param member 管理员用户名，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMGroup
     */
	removeGroupAdmin(groupId, member, error)
调用方法如下:

	groupManager.removeGroupAdmin(groupId, member, error).then((group) =>{});
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
     * param groupId 群组ID，输入参数，字符串
     * param filepath 文件路径，输入参数，字符串
     * param emUploadCallback 设置回调，输入
     * param error 操作结果，输出参数，EMError
     * 返回Promise对象，resolve参数为EMMucSharedFile
     */
    uploadGroupSharedFile(groupId, filepath, emUploadCallback, error)
调用方法如下:

	groupManager.uploadGroupSharedFile(groupId, filepath, emUploadCallback, error).then((file) => {});
#### 获取群文件列表
接口API如下：

    /**  
     * 分页获取群文件列表
     * param groupId 群组ID，输入参数，字符串
     * param pageNum 当前页数
     * param pageSize 每页计数
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为EMMucSharedFile数组
     */
    fetchGroupSharedFiles(groupId, pageNum, pageSize, error)
调用方法如下:

	groupManager.fetchGroupSharedFiles(groupId, 1, 20, error).then((filelist) => {});
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
     * param groupId 群组ID，输入参数，字符串
     * param filePath 文件本地存储路径，输入参数，字符串
     * param fileId 文件ID，输入参数，由文件列表数组获取
     * param callback 设置回调，输入
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为group
     */
    downloadGroupSharedFile(groupId, filePath, fileId, callback, error)
调用方法如下:

    groupManager.downloadGroupSharedFile(groupid, filelocalpath, sharedFile.fileId(), emDownloadCallback, error).then((group) =>{});
#### 删除群文件
接口API如下：

    /**  
     * 删除群文件
     * param groupId 群组ID，输入参数，字符串
     * param fileId 文件ID，输入参数，由文件列表获取
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为group
     */
    deleteGroupSharedFile(groupId, fileId, error)
调用方法如下:

	groupManager.deleteGroupSharedFile(groupId, sharedFile.fileId(), error).then((group) =>{});
#### 群组公告的管理
接口API如下：

	/**  
     * 设置群组公告
     * param groupId 群组ID，输入参数，字符串
     * param announcement 群组公告，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为group
     */
    updateGroupAnnouncement(groupId, announcement,error)

	/**  
     * 获取群组公告
     * param groupId 群组ID，输入参数，字符串
     * param error 操作结果，输出参数，EMError
     * return 返回Promise对象，resolve参数为群组公告，字符串
     */
    fetchGroupAnnouncement(groupId, error)
调用方法如下:
	groupManager.fetchGroupAnnouncement(groupId, error).then((announcement) =>{});
	groupManager.updateGroupAnnouncement(groupId, "new announcement",error).then((group) =>{});

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
### 会话管理
会话管理功能包括获取会话、获取会话属性、删除会话、获取会话消息、删除会话消息、获取会话消息计数等功能。

会话管理模块为EMChatManager，由EMClient模块加载时主动创建，可以使用EMClient模块的getChatManager方法获取，代码如下

    var chatManager = emclient.getChatManager();
#### 获取会话列表
接口API如下：

	/** 
     * 获取会话列表
     * return 返回Promise对象，resolve参数为会话列表，EMConversation数组
     */
    getConversations()
调用方法如下:

	chatManager.getConversations().then((conversationlist) => {});
#### 根据会话ID获取会话
接口API如下：

	/** 
     * 获取会话
     * param conversationId 会话ID，输入参数，字符串
     * param type 会话类型，输入参数，0为单聊，1为群聊
     * return 会话，EMConversation
     */
    getConversationWithType(conversationId,type)
调用方法如下:

	let conversationlist = chatManager.getConversationWithType(conversationId,type);
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
     * 分页获取历史消息
     * param conversationId 会话ID,输入参数
     * param type 会话类型，1为群组，0为单聊
     * param error 获取结果，输出
     * param pageSize 每页的消息计数
     * param startMsgId 起始消息ID
     * return 返回Promise对象，resolve参数为EMCursorResult，可以用result()获取消息列表
     */
    chatManager.fetchHistoryMessages(conversationId, type, error, pageSize, startMsgId)
调用方法如下:

	chatManager.fetchHistoryMessages(conversationId, type, error, pageSize, startMsgId).then((cursorresult) => {
      let result = cursorresult.result();
      });
#### 插入消息
接口API如下：

	/**
      * 不发送消息，只是插入到本地
      * param messagelist 要插入的消息列表，EMMessage数组
      * return 返回Promise对象，resolve参数为空
	insertMessages(messagelist);
调用方法如下:

    chatManager.insertMessages(messagelist);
#### 加载会话消息
接口API如下：

	/** 
     * 按照ID加载会话消息
     * param refMsgId 起始消息ID,输入参数，空为最新消息
     * param count 加载的消息数，输入参数
     * param direction 消息加载方向，填0
     * return 返回Promise对象，resolve参数为EMMessage数组
     */
	loadMoreMessagesByMsgId(refMsgId, count, direction);

	/** 
     * 按照时间加载会话消息
     * param timeStamp 起始消息时间，输入参数
     * param count 加载的消息数，输入参数
     * param direction 消息加载方向，填0
     * return 返回Promise对象，resolve参数为EMMessage数组
     */
	conversation.loadMoreMessagesByTime(timeStamp, count, direction);
调用方法如下:

	conversation.loadMoreMessagesByMsgId("", 20,0).then((msglist) => {});
	conversation.loadMoreMessagesByTime(timeStamp, 20,0).then((msglist) => {});
#### 删除会话消息
接口API如下：

    /** 
     * 按照ID移除会话消息，只操作缓存和本地数据库
     * param messageId 要删除的消息ID
     * return 返回Promise对象，resolve参数为空
     */
    removeMessage(messageId)
调用方法如下:

	conversation.removeMessage(messageId).then(()=>{});
#### 清空会话消息
接口API如下：

    /** 
     * 清空会话消息，只操作缓存和本地数据库
     * return 返回Promise对象，resolve参数为空
     */
    clearAllMessages()
调用方法如下:

	conversation.clearAllMessages().then(() =>{});
#### 设置消息已读状态
接口API如下：

    /** 
     * 根据消息ID标记消息已读状态
     * param msgid，消息ID
     * isread bool，已读状态
     * return 返回Promise对象，resolve参数为空
     */
	markMessageAsRead(msgid,isread);
    /** 
     * 标记会话中所有消息的已读状态
     * isread bool，已读状态
     * return 返回Promise对象，resolve参数为空
     */
	markAllMessagesAsRead(isread);
调用方法如下:

	conversation.markMessageAsRead(msgid,isread);
	conversation.markAllMessagesAsRead(isread);
#### 获取会话中的消息计数
接口API如下：

    /** 
     * 获取会话中的消息计数
     * return 消息计数
     */
    messagesCount()
调用方法如下：

	var msgCount = conversation.messagesCount();
#### 获取会话中的未读消息计数
接口API如下：

    /** 
     * 获取会话中的未读消息计数
     * return 未读消息计数
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
     * param ext 扩展属性，字符串
     * return 无
     */
    setExtField(strAttr)
    /** 
     * 获取会话扩展属性
     * return 扩展属性，字符串
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
     * param1 文本消息正文，输入参数，字符串
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
     * param1 文件路径，输入参数，字符串
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
     * param1 图片文件路径，输入参数，字符串
     * param2 图片缩略图路径，输入参数
     * return 消息体EMFileMessageBody
     */
    var imageMsgBody = new easemob.EMImageMessageBody('/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/image_960x718.jpg', '/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/thumb_image.jpg');
    var imageMsg = easemob.createSendMessage("jwfan", "jwfan1", imageMsgBody);
    imageMsg.setCallback(emCallback);
    chatManager.sendMessage(imageMsg);

#### 发送CMD消息

    /** 
     * 创建图片消息体
     * param1 图片文件路径，输入参数，字符串
     * param2 图片缩略图路径，输入参数
     * return 消息体EMFileMessageBody
     */
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
     * param1 位置经度，输入参数，字符串
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

	chatroomManager.joinChatroom(chatroomid,error);
#### 退出聊天室
	
	chatroomManager.leaveChatroom(chatroomId, error);
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
