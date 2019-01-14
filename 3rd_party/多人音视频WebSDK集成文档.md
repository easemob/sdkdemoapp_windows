# 集成文档

[简介|功能说明|接入]

**多人音视频Web SDK**是以Websocket为通讯基础，WebRTC为协议，支持多种浏览器 即时多媒体通话功能。通过SDK可快速完成即时视频通话功能。特点概述：

- **浏览器支持** ：Chrome/50, Safari/11, Edge, Firefox；
- **功能** ：视频通话，音频通话，远程抓拍，远程聚焦、镜头缩放；桌面共享（仅支持Chrome浏览器）；
- **实现** ：H5，原生JS, 支持require；
- **限制** ：https
- **线上DEMO** ：__confr_id__随意定制，相同的为同一个会议<https://turn2.easemob.com/rtc-ws/EMedia/?__log_level___=0&__only_enter__=false&__auto_sub__=true&__url__=wss://turn2.easemob.com/ws&__confr_id__=HelloGod001&__member_name__=God001>

-------------------

# 接入

下载**EMedia-3.0.0.x.zip**并解压后。添加script标签引用。

# 集成
```javascript
<script src="./webrtc/dist/EMedia_sdk-dev.js"></script>
```
# 创建
同一个标签页可支持创建多个Service。但几乎没有这种场景。所以不建议在销毁前创建多个service，尽管这是没有问题的。

```javascript
var service = new emedia.Service({
    listeners: { //以下监听，this object == me == service.current
        //退出
        onMeExit: function (reason, failed) {
            reason = (reason || 0);
            switch (reason){
                case 0:
                    reason = "正常挂断";
                    break;
                case 1:
                    reason = "没响应";
                    break;
                case 2:
                    reason = "服务器拒绝";
                    break;
                case 3:
                    reason = "对方忙";
                    break;
                case 4:
                    reason = "失败,可能是网络或服务器拒绝";
                    if(failed === -9527){
                        reason = "失败,网络原因";
                    }
                    if(failed === -500){
                        reason = "Ticket失效";
                    }
                    if(failed === -502){
                        reason = "Ticket过期";
                    }
                    if(failed === -504){
                        reason = "链接已失效";
                    }
                    if(failed === -508){
                        reason = "会议无效";
                    }
                    if(failed === -510){
                        reason = "服务端限制";
                    }
                    break;
                case 5:
                    reason = "不支持";
                    break;
                case 10:
                    reason = "其他设备登录";
                    break;
                case 11:
                    reason = "会议关闭";
                    break;
            }
        },
        //member加入会议
        onAddMember: function (member) {
        },
        //member离开会议
        onRemoveMember: function (member) {
        },
        //收到一个业务流
        onAddStream: function (stream) {
        },
        //移除一个业务流
        onRemoveStream: function (stream) {
        },
        //业务流更新
        onUpdateStream: function (stream, update) {
        },
        //当前通话连接质量不佳
        onNetworkWeak: function () {
        },
        //各类事件
        onNotifyEvent: function (evt) {
            if(evt instanceof emedia.event.ServerRefuseEnter){ //服务端拒绝进入
            } else if(evt instanceof emedia.event.EnterSuccess){ //进入会议成功
            } else if(evt instanceof emedia.event.EnterFail){ //进入会议失败
            } else if(evt instanceof emedia.event.ICERemoteMediaStream) { //成功获取对方媒体数据 如：视频
            } else if(evt instanceof emedia.event.PushSuccess){ //推流成功。本地打开摄像头并将数据成功发送
            } else if(evt instanceof emedia.event.SubSuccess){ //订阅成功，可以看到对方了
            } else if(evt instanceof emedia.event.PushFail){ //推送失败
            } else if(evt instanceof emedia.event.SubFail){ //推送成功
            } else if(evt instanceof emedia.event.ShareDesktopExtensionNotFound){ //共享桌面插件未找到
            } else if(evt instanceof emedia.event.RemoteControlFail){ //远程控制失败，仅能web端控制sdk端
            }
        }
    }
});
```


# 初始化
加入会议的凭证 是 tkt，只要获取到tkt，便能工作
```javascript
service.setup(tkt_string, {role: 'admin'}/*扩展字段*/);
```

# member
```javascript
...
onAddMember: function (member) {
},
onRemoveMember: function (member) {
},
...
```

```json
{
    "ext":{ //service.setup(tkt_string, {role: 'admin'}/*扩展字段*/);
        "identity":"visitor",
        "nickname":"webim-visitor-9F72MEK793H97XQGFBKM",
        "avatarUrl":""
    },
    "nickName":"webim-visitor-9F72MEK793H97XQGFBKM",
    "id":"MS_X197721744293023744C19M197756407719972865VISITOR",
    "name":"a63ceeb6-64c2-426d-9803-a40dd5557d7c",
    "vcodes":[
        "VP8",
        "H264"
    ]
}
```
# stream
```javascript
...
//收到一个业务流
onAddStream: function (stream) {
},
//移除一个业务流
onRemoveStream: function (stream) {
},
//业务流更新
onUpdateStream: function (stream, update) {
    update.ifMediaStream(function (mediaStream) { //媒体数据发生变化
        video.srcObject = null;
        video.srcObject = mediaStream;
    });
    update.ifVoff(function (voff) { //对方 开启/关闭 视频
    });
    update.ifAoff(function (aoff) { //对方 开启/关闭 音频
    });
},
...
```
```json
{
    "memId":"MS_X197721744293023744C19M197756407719972865VISITOR",
    "id":"RTC2__Of_C19M197756407719972865VISITOR",
    "voff":0, //1 视频关闭 
    "aoff":0, //1 音频关闭 
    "vcodes":[
        "VP8",
        "H264"
    ],
    "owner": member ,//member对象
    "rtcId":"RTC1",
    "subArgs":{
        "subSVideo":true,
        "subSAudio":true
    }
}
```

# 打开媒体设备：麦克风、摄像头
```javascript
 //创建一个音视频流
var pubS = new service.AVPubstream({
    constaints: { //可缺省，麦克风 摄像头均打开；若设置，audio video 至少有一个为true
        audio: true|false, //默认true, 打开 麦克风
        video: true|false, //默认true, 打开 摄像头
    },
    aoff: 0, // 指定给对方 是否 关闭了音频, 默认0
    voff: 0, // 指定给对方 是否 关闭了视频, 默认0
    name: "video", // 视频名称（根据业务情况设定），可缺省
    ext: { //支持 媒体流 扩展描述，根据业务情况设定。此参数广播到其他人
        browser: app.appname
    }
});

//Chrome 浏览器
//桌面共享流，选装插件
//插件地址 https://turn2.easemob.com/simonweb/confr-http/rtc-share-desktop.crx
var pubS = new service.ShareDesktopPubstream({name: "共享桌面"}); 

//混音通话
var pubS = new service.AudioMixerPubstream({
    constaints: {
        video : "false" !== __video__,
    },
    aoff: 0
});

service.openUserMedia(pubS).then(function () {
    //打开媒体流成功
}, function fail(evt) { //打开媒体流失败
    //共享桌面抄件未找到
    if(evt instanceof emedia.event.ShareDesktopExtensionNotFound){ 
    }
    //设备可能不支持，比如 没有摄像头，或 被禁止访问摄像头
    if(evt instanceof emedia.event.OpenMediaError){ 
    }
});
```

# 加入会议
```javascript
//在此之前 应该 service.setup(tkt_string, {role: 'admin'}/*扩展字段*/);
service.join(function onSuccess() {
});
```

# 加入会议，并推送媒体流
```javascript
service.withpublish(pubS).join();
//在此之前应该openUserMedia。例如：
service.openUserMedia(pubS).then(
    function success(_user, stream) { //成功 video.srcObject = stream
        service.withpublish(pubS).join();
    },
    function fail(evt) {
        
    }
);
```

# 手动推送媒体流
```javascript
service.push(pubS);

//在此之前应该openUserMedia 并且 join 成功。例如：
service.join(function onSuccess() {
});

service.openUserMedia(pubS).then(
    function success(_user, stream) { //成功 video.srcObject = stream
        service.push(pubS);
    },
    function fail(evt) {
        
    }
);
```

# 手动订阅对方媒体流
如果配置为自动订阅，可忽略，sdk会自动订阅 stream
```javascript
onAddStream: function (stream) {
    service.subscribe(stream.id, function (_evt) {
        //订阅失败
    }, {subSVideo: true|false}); //true:订阅视频，false:订阅音频
},
```

# 开启/关闭自己摄像头
```javascript
service.voff(stream, true|false, function fail(evt) {
});
```

# 开启/关闭自己麦克风
```javascript
service.aoff(stream, true|false, function fail(evt) {
});
```

# 控制手机SDK摄像头，放大缩小
```javascript
service.zoomRemote(stream.id, 2|0.5, function fail(evt){// 放大2倍，缩小0.5
});
```

# 抓拍手机SDK摄像头
```javascript
service.capturePictureRemote(stream.id, false, 
    function success(base64Pic) {
    }, 
    function fail(evt) {
    }
);
```

# 控制手机SDK摄像头 聚焦；在video标签上添加点击事件
```javascript
video.onclick = function (event) {
    if (document.all) { // for IE
        window.event.returnValue = false;
    } else {
        event.preventDefault();
    }

    if(stream.located()){
        displayEvent("Web本地摄像头不支持聚焦");
        return;
    }
    service.focusExpoRemote(stream.id, video, event, function fail(evt) {
        _logger.error("Oh,no.", evt.message())
    });
}
```

# 控制手机SDK摄像头 图像定格/恢复。
```javascript
//freezeFramed true：图像定格
service.freezeFrameRemote(stream.id, function success(freezeFramed) {
}, function fail(evt, freezeFramed) {
});
```

# SDK增强，开启支持远程控制
```javascript
emedia.ctrl.support(service,
    function onHasRemoteControl(stream, controler, controlRequest){
        var rtn = confirm("同意 来自<" + controler.memName + ">对流:" + stream.id + "控制申请吗？")
        if(rtn){ //同意被控制
            var htmlId = stream.getHtmlDOMID();
            var $div = $('#' + htmlId);

            var $video = $div.find("#videoTag");
            var $videoTrack = $div.find("#video_box #track");
            var $canvas = $div.find("#video_box canvas");

            $videoTrack.show();
            $canvas.show();

            controlRequest.accept($video[0], new MouseTrack({
                _target: $videoTrack[0],
                _canvas: $canvas[0],
                _video: $video[0]
            }), new KeyboardTrack());
        }else{ //拒绝
            controlRequest.reject();
        }
    },

    function onRemoteFreeControl(stream, controler, cId) {
    	...    
    }
);
```
# SDK增强，发起控制
```javascript
function onReject(stream) { //被控端拒绝
}

function onBusy(stream) { //被控端忙
}

function onNotAllowRemoteControl(stream){ //被控端忙
}

function onRemoteControlTimeout(stream){ //被控端超时
}

function onAccept(stream){ //被控端接受
}

function onDisControlled(stream){ //断开控制链接
}
    
if($(videoObj).hasClass('mirror')){
    emedia.ctrl.mirrorControlled(service, stream.id, videoObj, targetDiv,
        onDisControlled, onAccept, onNotAllowRemoteControl, onRemoteControlTimeout, onReject, onBusy);
}else{
    emedia.ctrl.controlled(service, stream.id, videoObj, targetDiv,
        onDisControlled, onAccept, onNotAllowRemoteControl, onRemoteControlTimeout, onReject, onBusy);
}

```



# 退出会议
```javascript
//退出会议，会回调onMeExit
//退出会议后，可再次setup ticket.
//setup生命周期 起， exit生命周期止
service.exit();
```

# 配置emedia

```javascript
emedia.config({
    logLevel: 0, //日志级别，>5 关闭SDK，日志。默认级别 0       
        // TRACE: 0,
        // DEBUG: 1,
        // INFO: 2,
        // WARN: 3,
        // ERROR: 4,
        // FATAL: 5
    autoSub: true, //当收到对方媒体流时，自动订阅, 默认值：true
    enterTimeout: 20000, //单位ms，join 20秒内未返回 join失败，默认值20000
});

//重要常量
emedia.config.version //sdk版本
emedia.LOG_LEVEL //sdk日志级别，可在运行时通过控制台命令行 手动设置，可实时打开日志
emedia.isFirefox //true 火狐
emedia.isChrome  //true Chrome
emedia.isSafari  //true Safari
emedia.isWebRTC //true支持webrtc false不支持webrtc
```
