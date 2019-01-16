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
	  easemobMac.node
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
登录后获取用户信息方法如下：

	var loginInfo = emclient.getLoginInfo();
    console.log("loginInfo.loginUser = " + loginInfo.loginUser());
    console.log("loginInfo.loginPassword = " + loginInfo.loginPassword());
    console.log("loginInfo.loginToken = " + loginInfo.loginToken());
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
#### 监听联系人变更
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
### 群组管理
群组操作包括组的创建、销毁，根据ID获取组，组成员的邀请、移除、退出，获取用户所在的所有组、公开组，公开组的加入，成员的禁言、解禁，修改组信息（组名、描述），屏蔽群组消息、取消屏蔽群组消息，接受群邀请，拒绝群邀请，接受加入群邀请，拒绝加入群邀请，群主变更，群管理员的添加与移除，群组文件的上传、下载、列表获取、删除，群组公告的获取、设置，以及组设置变更的监听。
#### 创建群组

	var groupManager = emclient.getGroupManager();
	// 组设置，4个参数分别为组类型（0,1,2,3），最大成员数，邀请是否需要确认，扩展信息
	var setting = new easemob.EMMucSetting(1, 20, false, "test");
	var group = groupManager.createGroup("subject","description","welcome message",setting,["jwfan1", "jwfan2"], error);
#### 解散群组

	// 参数1为组ID
	groupManager.destroyGroup("55139673112577", error);
#### 根据ID获取组

	console.log("group.groupId" + group.groupId());
    console.log("group.groupSubject" + group.groupSubject());
    console.log("group.groupDescription" + group.groupDescription());
    console.log("group.groupOwner" + group.groupOwner());
    console.log("group.groupMembersCount" + group.groupMembersCount());
    console.log("group.groupMemberType" + group.groupMemberType());
    console.log("members:"+group.groupMembers().join(' || '));
    var set = group.groupSetting();
    console.log("set.style() = " + set.style());
    console.log("set.maxUserCount() = " + set.maxUserCount());
    console.log("set.extension() = " + set.extension());
#### 获取群组信息

	var groupId = group.groupId();
#### 群组成员的邀请、移除

	// 邀请成员入群，一次可邀请多个成员
	var groupId = group.groupId();
	groupManager.addGroupMembers(groupId, ["jwfan3", "jwfan4"], "hahaha", error);
	// 将成员踢出群，同样可踢出多人
	groupManager.removeGroupMembers(groupId, ["jwfan3", "jwfan4"], error);
#### 退出群组

	groupManager.leaveGroup(groupId,error);
#### 获取用户所在的所有组

	var groupList = groupManager.fetchAllMyGroups(error);
#### 获取公开群组
	
	var publicGroupList = groupManager.fetchPublicGroupsWithPage(1,20,error).result();
    console("publicgroup lenth:"+ publicGroupList.length + " publicgroup:" + publicGroupList);
#### 加入公开群组

	groupManager.joinPublicGroup(groupId,error);
#### 获取群组中的成员列表

	// 使用 || 间隔输出成员列表
	var members = group.groupMembers();
    console.log(members.join(' || '));
#### 接受群邀请

	groupManager.acceptInvitationFromGroup(groupId,inviter,error);
#### 拒绝群邀请

	groupManager.declineInvitationFromGroup(groupId,inviter,error);
#### 接受加入群邀请

	groupManager.acceptJoinGroupApplication(groupId,from,error);
#### 拒绝加入群邀请

	groupManager.declineJoinGroupApplication(groupId,from,"decline reason",error);

#### 成员禁言

	groupManager.blockGroupMembers(groupId, members, error, "reason");
#### 获取禁言成员列表

	// 分页获取
	groupManager.fetchGroupBans(groupId, 1, 20, error);
#### 取消成员禁言

	groupManager.unblockGroupMembers(groupId, members, error);
#### 修改群信息

	// 修改群标题
	groupManager.changeGroupSubject(groupId, "new Subject", error);
	// 修改群描述
	emGroup = groupManager.changeGroupDescription(groupId, "new Description", error);
	
#### 屏蔽群组消息

	groupManager.blockGroupMessage(groupId, error);
#### 取消屏蔽群组消息

	groupManager.unblockGroupMessage(groupId, error);
#### 群主变更

	groupManager.transferGroupOwner(groupId, member, error);
#### 添加管理员

	groupManager.addGroupAdmin(groupId, member, error);
#### 删除管理员

	groupManager.removeGroupAdmin(groupId, member, error);
#### 上传群文件

	// 设置回调函数显示上传进度和结果
	var emUploadCallback = new easemob.EMCallback();
    console.log("create upload emCallback success");

    emUploadCallback.onSuccess(() => {
        console.log("upload emCallback call back success");
        return true;
    });
    emUploadCallback.onFail((error) => {
        console.log("upload emCallback call back fail");
        console.log(error.description);
        console.log(error.errorCode);
        return true;
    });
    emUploadCallback.onProgress((progress) => {
        if (progress >= 98) {
            console.log("upload call back progress " + progress);
        }
    });
	groupManager.uploadGroupSharedFile(groupId, filepath, emUploadCallback, error);
#### 获取群文件列表
	
	// 分页获取
	var filelist = groupManager.fetchGroupSharedFiles(groupId, 1, 20, error);
#### 下载群文件

	var emDownloadCallback = new easemob.EMCallback();
    console.log("create download emCallback success");

    emDownloadCallback.onSuccess(() => {
        console.log("download emCallback call back success");
        return true;
    });
    emDownloadCallback.onFail((error) => {
        console.log("download emCallback call back fail");
        console.log(error.description);
        console.log(error.errorCode);
        return true;
    });
    emDownloadCallback.onProgress((progress) => {
        if (progress >= 98) {
            console.log("download call back progress " + progress);
        }
    });

    var group = groupManager.downloadGroupSharedFile(groupid, filelocalpath, sharedFile.fileId(), emDownloadCallback, error);
#### 删除群文件

	groupManager.deleteGroupSharedFile(groupId, sharedFile.fileId(), error);
#### 群组公告的管理

	// 设置群组公告
	groupManager.updateGroupAnnouncement(groupId, "new announcement",error);
	// 获取群公告
	var announcement = groupManager.fetchGroupAnnouncement(groupId, error);
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
### 发送消息

发送文本、文件、图片等消息（单聊/群聊通用）。
#### 发送文本消息

    //创建消息体
	var textMsgBody = new easemob.EMTextMessageBody("wahhahahaha");
	var textSendMsg = easemob.createSendMessage("jwfan", "jwfan1", textMsgBody);
	// 消息可以设置扩展属性，用户界面可通过自定义属性，实现“@”等功能
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

	//创建消息体
	var fileMsgBody = new easemob.EMFileMessageBody("/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/file.txt", 5);
    var fileMsg = easemob.createSendMessage("jwfan", "jwfan1", fileMsgBody);
    //setCallback(callback) 设置消息回调函数，通过回调函数显示消息发送成功失败，以及附件上传百分比
    //callback easemob.EMCallback的实例，设置onSuccess、onFail和onProgress三个回调函数。
    fileMsg.setCallback(emCallback);
    chatManager.sendMessage(fileMsg);
#### 发送图片

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

	chatManager = emclient.getChatManager();
	// chatManager.loadAllConversationsFromDB(); // 每一条会话加载 20 条消息到缓存中
	listener = new easemob.EMChatManagerListener();
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
	chatManager.addListener(listener);
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
	
	var listener = new easemob.EMMultiDevicesListener();
	listener.onContactMultiDevicesEvent((operation, target, ext) => {
      console.log('operation = ' + operation);
      console.log('target = ' + target);
      console.log('ext = ' + ext);
	});
  
	listener.onGroupMultiDevicesEvent((operation, target, usernames) => {
      console.log('operation = ' + operation);
      console.log('target = ' + target);
      console.log('usernames = ' + usernames);
	});

	var ret = emclient.login("jwfan", "jwfan");
	console.log(ret.errorCode);
	console.log(ret.description);

	emclient.addMultiDevicesListener(listener);

	setTimeout(function() {
      emclient.removeMultiDevicesListener(listener);
      emclient.clearAllMultiDevicesListeners();
      emclient.logout();
      console.log("logout");
	}, 1000 * 60 * 2);
