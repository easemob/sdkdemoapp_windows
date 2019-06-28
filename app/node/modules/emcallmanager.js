'use strict';

const EMError = require('./emerror');
const EMCallConfigs = require('./emcallconfigs');
const EMCallSession = require('./emcallsession');
const EMCallRtcProxy = require('./emcallrtcproxy');
const EMCallRtcListener = require('./emcallrtclistener');
const EventEmitter = require('events').EventEmitter;
var rtcListerner;
var pc;
var answersdp;
var answertype;
var callIsCaller;
var remoteObj;
var remoteCandidate =[];
var localStream;
var remoteStream;
/**
 * Easemob EMCallManager implementation.
 */
/**
 * EMCallManager constructor.
 * @constructor
 * @param {Object} callManager
 */
function EMCallManager(callManager) {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(1);
  self._manager = callManager;
  self.callrtcProxy = new EMCallRtcProxy();
  let _manager = self._manager;
  function makeRtcProxy(rtcProxy)
  {
    rtcProxy.sendPushMessage((from,to,type) => {
        console.log("sendPushMessage");
        console.log("from:" + from);
        console.log("to:" + to);
        console.log("type:" + type);
        self._eventEmitter.emit("sendPushMessage",from,to,type);
    });
    rtcProxy.createRtc((callrtclistener,callId,remoteId,type,localConfig) => {
      rtcListerner = new EMCallRtcListener(callrtclistener);
        console.log(callrtclistener);
        console.log("createRtc");
        console.log("callId:" + callId);
        console.log("remoteId:" + remoteId);
        console.log("type:" + type);
        console.log("localConfig:" + localConfig);
        let jsonConfig = JSON.parse(localConfig);
        let configuration = {iceServers:jsonConfig.iceServers};
        console.log("configuration：" + JSON.stringify(configuration));
        pc = new RTCPeerConnection(jsonConfig);
        if(!pc)
          return false;
        pc.onicecandidate = (e) => {
          console.log("oncandidate:" +JSON.stringify( e.candidate));
          
          if(JSON.stringify( e.candidate) == "null")
          {
            
          }else{
            let candidate = {};
            candidate["type"] = "candidate";
            candidate["candidate"] = e.candidate["candidate"];
            candidate["mid"] = e.candidate["sdpMid"];
            candidate["mlineindex"] = e.candidate["sdpMLineIndex"];
            rtcListerner.onReceiveLocalCandidate(JSON.stringify(candidate));
          }
        }
        pc.onnegotiationneeded = (e) => {
             console.log("onnegotiationneeded:" + e);
         };
         // once media for a remote track arrives, show it in the remote video element
         pc.ontrack = (event) => {
           // don't set srcObject again if it is already set.
           if(remoteStream) return;
           console.log("ontrack");
           remoteStream = event.streams[0];
           self._eventEmitter.emit("getRemoteStream",remoteStream,type);
         };
         pc.onconnectionstatechange = (e) => {
           console.log("onconnectionstatechange:" + (pc && pc.connectionState));
         }
         pc.onicecandidateerror = (e) => {
          console.log("onicecandidateerror:" + e.errorText);
         }
         pc.oniceconnectionstatechange = (e) => {
          console.log("oniceconnectionstatechange: " + (pc && pc.iceConnectionState));
          if(pc && pc.iceConnectionState === "disconnected")
          {
            rtcListerner.onReceiveNetworkDisconnected();
          }
          if(pc && pc.iceConnectionState === "connected")
          {
            rtcListerner.onReceiveNetworkConnected();
          }
         }
         pc.onicegatheringstatechange = (e) => {
          console.log("onicegatheringstatechange:" + (pc && pc.iceGatheringState));
          if(pc && (pc.iceGatheringState == "complete")) {
            rtcListerner.onReceiveSetup("");
            if(!callIsCaller)
            {
              let error = new EMError();  
              _manager.asyncAnswerCall(callId,error._error);
              let sdp = {};
              sdp["type"] = "answer";
              sdp["sdp"] = answersdp;
              console.log("localDescription:" + JSON.stringify(sdp));
              rtcListerner.onReceiveLocalSdp(JSON.stringify(sdp));
            }
          }
         }
         pc.onsignalingstatechange = (e) => {
          console.log("onsignalingstatechange:" + (pc && pc.signalingState));
         }
         pc.onstatsended = (e) => {
          console.log("onstatsended");
         }
         pc.ondatachannel = (e) => {
          console.log("ondatachannel");
         }
        return true;
    });
    rtcProxy.setRtcConfigure((callId,type,isCaller,localConfig) => {
        console.log("setRtcConfigure");
        console.log("callId:" + callId);
        console.log("isCaller:" + isCaller);
        console.log("type:" + type);
        console.log("localConfig:" + localConfig);
        callIsCaller = isCaller;
        if(!isCaller)
        {
          answertype = type;
        }
        pc && pc.setConfiguration(JSON.parse(localConfig));
        let videowidth = self.getCallConfigs().getVideoResolutionWidth();
        let videoheight = self.getCallConfigs().getVideoResolutionHeight();
        if(isCaller)
        {
          //访问用户媒体设备
          function getUserMedia(constraints, success, error) {
          //最新的标准API
          navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
          }
          function success(stream) {
            console.log("getUserMedia success");
            stream.getTracks().forEach( (track) => {
              console.log("addtrack");
              pc && pc.addTrack(track,stream);
            });
            var offerOptions = {
              offerToReceiveAudio: true,
              offerToReceiveVideo: true
            };
            pc && pc.createOffer(offerOptions).then((sdpinit) => {
              pc && pc.setLocalDescription(sdpinit).then(() => {
                let sdp = {};
                sdp["type"] = "offer";
                sdp["sdp"] = sdpinit.sdp;
                rtcListerner.onReceiveLocalSdp(JSON.stringify(sdp));
                console.log("setLocalDescription success");
              }).catch((reason) => {
                console.log("setLocalDescription fail:" + reason);
              })
             });
             localStream = stream;
             self._eventEmitter.emit("getLocalStream",localStream,type);
          }
      
          function error(error) {
            console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
            _manager.asyncEndCall(callId,4);
            //_manager.updateCall(callId,0);
          }
      
          if (navigator.mediaDevices.getUserMedia) {
            //调用用户媒体设备, 访问摄像头
            getUserMedia(type == 0?{audio:true}:{ video: { width: videowidth>0?videowidth:640, height: videoheight>0?videoheight:480 },audio:true }, success, error);
          } else {
            alert('不支持访问用户媒体');
            _manager.asyncEndCall(callId,4);
          }
        }

        pc.onaddstream = function(e){
          console.log("onaddstream");
          remoteStream = e.stream;
          self._eventEmitter.emit("getRemoteStream",remoteStream,type);
        }
    });
    rtcProxy.setRtcRemoteJson((callId,json) => {
        console.log("setRtcRemoteJson");
        console.log("callId:" + callId);
        console.log("json:" + json);
        let obj = JSON.parse(json);
        obj.type = obj.type.toLowerCase();
        if(obj.type == "candidate")
        {
          let candidate = {};
            candidate.candidate = obj["candidate"];
            candidate.sdpMLineIndex = obj["mlineindex"];
            candidate.sdpMid = obj["mid"];
            pc && pc.addIceCandidate(candidate).then(() => {
              console.log("AddIceCandidate success");
            }).catch((reason) => {
              console.log("AddIceCandidate fail:" + reason);
            })
          if(!callIsCaller)
          {
            remoteCandidate.push(obj);
          }
          
        }else{
          if(obj.type == "offer")
            {
              remoteObj = obj;
              pc && pc.setRemoteDescription(remoteObj);
              return;
            }
            pc && pc.setRemoteDescription(obj).then(() => {
            console.log("setRemoteDescription success");
            rtcListerner.onReceiveSetup("");
          }).catch((reason) => {
            console.log("setRemoteDescription fail:"+reason);
          });
        }
        
      
    });
    rtcProxy.createRtcAnswer((callId) => {
        console.log("createRtcAnswer");
        console.log("callId:" + callId);
        console.log("anwser");
    });
    rtcProxy.updateRtc((callId,controlType) => {
        console.log("updateRtc");
        console.log("callId:" + callId);
        console.log("controlType:" + controlType);
        localStream.getTracks().forEach(t => t.enabled = (controlType%2 == 0)?false:true);
    });
    rtcProxy.endRtc((callId) => {
        console.log("endRtc");
        console.log("callId:" + callId);
        pc && pc.close();
        rtcListerner && rtcListerner.onReceiveClose("hangup");
        //pc = null;
    });
    rtcProxy.getRtcReport(async (callId) => {
        console.log("getRtcReport");
        console.log("callId:" + callId);
        let statsOutput = "";
        // await remoteStream && pc&& pc.getStats(remoteStream.getTracks()[0]).then(stats => {
        //   console.log("stats");
        //   stats.forEach(report => {
        //     statsOutput += JSON.stringify(report);
        //   });
        //   console.log(statsOutput);
        // });
        
        return statsOutput;
    });
    rtcProxy.switchCamera((callId) => {
        console.log("switchCamera");
        console.log("callId:" + callId);
    });
  };
  makeRtcProxy(this.callrtcProxy);
  this._manager.setRtcProxy(this.callrtcProxy._rtcProxy);
}

/**
 * Add call manager listener
 * @param {EMCallManagerListener} listener 添加视频通话的回调监听对象
 * @return {void}
 */
EMCallManager.prototype.addListener = function (listener) {
  this._manager.addListener(listener._listener);
};

/**
 * Remove call manager listener
 * @param {EMCallManagerListener} listener 移除视频通话的回调监听对象
 * @return {void}
 */
EMCallManager.prototype.removeListener = function (listener) {
  this._manager.removeListener(listener._listener);
};

/**
 * Remove all the call manager listeners
 * @return {void}
 */
EMCallManager.prototype.clearListeners = function () {
  this._manager.clearListeners();
};

/**
 * set call configs
 * @param {EMCallConfigs} callConfigs 会话配置信息
 * @return {void}
 */
EMCallManager.prototype.setCallConfigs = function (callConfigs) {
  this._manager.setCallConfigs(callConfigs);
};

/**
 * get call configs
 * @return {EMCallConfigs} callConfigs 会话配置信息
 */
EMCallManager.prototype.getCallConfigs = function () {
  return new EMCallConfigs(this._manager.getCallConfigs());
};

/**
 * 发起视频呼叫
 * @param {String} remoteName 被呼叫方名称
 * @param {Number} type 呼叫类型,0音频，1视频
 * @param {String} ext 扩展信息
 * @return {EMCallSessionResult} 建立的会话
 */
EMCallManager.prototype.asyncMakeCall = function(remoteName,type,ext)
{
  let error = new EMError();
  answertype = type;
  let retsession = new EMCallSession(this._manager.asyncMakeCall(remoteName,type,ext,error._error));
  return {
    code:error.errorCode,
    description:error.description,
    data:retsession
  }
}

/**
 * @typedef {Object} EMCallSessionResult
 * @property {Number} code 结果ID，0为成功，其他为错误ID
 * @property {String} description 错误描述，code不为0时使用
 * @property {EMCallSession} data 音视频会话控制
 */

/**
 * 接受视频呼叫
 * @param {String} callId 呼叫方名称
 */
EMCallManager.prototype.asyncAnswerCall = function(callId)
{
  let _manager = this._manager;
  let _eventEmitter = this._eventEmitter;
  let videowidth = this.getCallConfigs().getVideoResolutionWidth();
  let videoheight = this.getCallConfigs().getVideoResolutionHeight();
  pc && pc.setRemoteDescription(remoteObj).then(() => {
    console.log("setRemoteDescription success");
      //访问用户媒体设备
      function getUserMedia(constraints, success, fail) {
      //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(fail);
      }
      function success(stream) {
        console.log("getUserMedia success");
        stream.getTracks().forEach( (track) => {
          console.log("addtrack");
          pc && pc.addTrack(track,stream);
        });
        pc && pc.createAnswer().then((sdpinit) => {
          pc && pc.setLocalDescription(sdpinit).then((val) => {
            answersdp = sdpinit.sdp;
            let sdp = {};
            sdp["type"] = "pranswer";
            sdp["sdp"] = sdpinit.sdp;
            console.log("localDescription:" + JSON.stringify(sdp));
           rtcListerner.onReceiveLocalSdp(JSON.stringify(sdp));
         }).catch((e) => {
           console.log("setLocalDescription fail:" + e);
         })
       })
        localStream = stream;
        _eventEmitter.emit("getLocalStream",localStream,answertype);
        remoteCandidate.forEach((obj) => {
          let candidate = {};
          candidate.candidate = obj["candidate"];
          candidate.sdpMLineIndex = obj["mlineindex"];
          candidate.sdpMid = obj["mid"];
          pc && pc.addIceCandidate(candidate).then(() => {
            console.log("AddIceCandidate success");
          }).catch((reason) => {
            console.log("AddIceCandidate fail:" + reason);
          })
        })
        remoteCandidate = [];
        let error = new EMError();  
        rtcListerner.onReceiveSetup("");
        _manager.asyncAnswerCall(callId,error._error);
      }
  
      function fail(e) {
        console.log(`访问用户媒体设备失败${e.name}, ${e.message}`);
        _manager.asyncEndCall(callId,4);
      }
  
      if (navigator.mediaDevices.getUserMedia) {
        //调用用户媒体设备, 访问摄像头
        getUserMedia(answertype == 0?{audio:true}:{ video: {width: videowidth>0?videowidth:640, height: videoheight>0?videoheight:480},audio:true }, success, fail);
      } else {
        alert('不支持访问用户媒体');
        _manager.asyncEndCall(callId,4);
      }
  }).catch((reason) => {
    console.log("setRemoteDescription fail:"+reason);
  });
}

/**
 * 结束视频会话
 * @param {String} callId 呼叫方名称
 * @param {Number} reason 结束原因，0挂掉，1无响应，2拒绝，3忙碌，4失败，5不支持，6离线
 */
EMCallManager.prototype.asyncEndCall = function(callId,reason)
{
  this._manager.asyncEndCall(callId,reason);
}

/**
 * 修改会话状态
 * @param {String} callId 呼叫方名称
 * @param {Number} controlType 修改后的状态，0语音暂停，1为语音继续，2为视频暂停，3为视频继续
 * @return {Result}
 */
EMCallManager.prototype.updateCall = function(callId,controlType)
{
  let error = new EMError();
  this._manager.updateCall(callId,controlType,error._error);
  return {
    code:error.errorCode,
    description:error.description
  }
}
/**
  * @typedef {Object} Result
  * @property {Number} code 返回码.0为正常，其他错误
  * @property {String} description 错误描述信息
  */

/**
 * 强制结束会话
 * @return {void}
 */
EMCallManager.prototype.forceEndAllCall = function()
{
  this._manager.forceEndAllCall();
}

/**
 * 设置语音视频请求时，对方不在线的消息推送回调
 * @param {EMCallManager~sendPushMessage} callback 回调函数
 */
EMCallManager.prototype.setSendPushMessage = function(callback){
  this._eventEmitter.on('sendPushMessage', callback);
}
/**
 * @function EMCallManager~sendPushMessage
 * @param {String} from 语音/视频发送者
 * @param {String} to 语音/视频接收者
 * @param {Number} type 类型，0语音，1视频
 */

/**
 * 设置收到远程媒体流后的回调
 * @param {EMCallManager~getRemoteStream}
 */
EMCallManager.prototype.getRemoteStream = function(callback){
  this._eventEmitter.on('getRemoteStream',callback);
}

/**
 * 设置收到本地媒体流后的回调
 * @param {EMCallManager~getLocalStream}
 */
EMCallManager.prototype.getLocalStream = function(callback){
  this._eventEmitter.on('getLocalStream',callback);
}

/**
 * @function EMCallManager~getLocalStream
 * @param {MediaStream} stream 收到的远程媒体流
 * @param {Number} type 音视频类型，0音频，1视频
 */

 /**
 * @function EMCallManager~getRemoteStream
 * @param {MediaStream} stream 收到的本地媒体流
 * @param {Number} type 音视频类型，0音频，1视频
 */
module.exports = EMCallManager;