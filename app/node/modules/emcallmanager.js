'use strict';

const EMError = require('./emerror');
const EMCallConfigs = require('./emcallconfigs');
const EMCallSession = require('./emcallsession');
const EMCallRtcProxy = require('./emcallrtcproxy');
const EMCallRtcListener = require('./emcallrtclistener');
const EventEmitter = require('events').EventEmitter;
require('./EWebrtc');
var rtcListerner;
var webrtc;
var answertype;
var callIsCaller;
var remoteCandidate =[];
var localStream;
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
        var offerOptions = {
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
      };
        webrtc = new emedia.EWebrtc({
          //iceServerConfig: jsonConfig,
          onIceStateChange: function(iceState){
              var state = iceState;
              console.log("onIceStateChange:" + iceState);
              try{
                  if(state == 'failed'){
                      //self.onEvent(new __event.ICEConnectFail({webrtc: webrtc}));
                      //webrtc.onEvent && webrtc.onEvent(new __event.ICEConnectFail({webrtc: webrtc}));
                      _manager.asyncEndCall(callId,0);
                      return;
                  }
                  if(state == 'connected'){
                      //self.onEvent(new __event.ICEConnected({webrtc: webrtc}));
                      webrtc.onEvent = null;
                      rtcListerner.onReceiveSetup("");
                      return;
                  }
                  if(state == 'closed'){
                      //self.onEvent(new __event.ICEClosed({webrtc: webrtc}));
                      //webrtc.onEvent && webrtc.onEvent(new __event.ICEClosed({webrtc: webrtc}));

                      return;
                  }
                  if(state == 'disconnected'){
                      //self.onEvent(new __event.ICEDisconnected({webrtc: webrtc}));
                      //webrtc.onEvent && webrtc.onEvent(new __event.ICEDisconnected({webrtc: webrtc}));

                      return;
                  }
              }finally {
                  self._onIceStateChange && self._onIceStateChange(webrtc, iceState);
              }
          },

          onIceCandidate: function (candidate) { //event.candidate
              //self._onIceCandidate && candidate && self._onIceCandidate(webrtc, candidate);
              console.log("onIceCandidate:" + candidate);
              rtcListerner.onReceiveLocalCandidate(JSON.stringify(candidate));
          },

          onGotRemoteStream: function (remoteStream1) {

              //webrtc.onGotMediaStream && webrtc.onGotMediaStream(remoteStream1);

              //self.onEvent(new __event.ICERemoteMediaStream({webrtc: webrtc}));
              self._eventEmitter.emit("getRemoteStream",remoteStream1,type);
          },
          onAddIceCandidateError: function (err) {
              //self.onEvent(new __event.AddIceCandError({webrtc: webrtc, event: err}))
          },
          onSetSessionDescriptionError: function (error) {
              console.log('onSetSessionDescriptionError : Failed to set session description: ' + error.toString());
              //self.onEvent && self.onEvent(new __event.ICEConnectFail({webrtc: webrtc, event: error}));
          },
          onCreateSessionDescriptionError: function (error) {
              console.log('Failed to create session description: ' + error.toString());
              //self.onEvent && self.onEvent(new __event.ICEConnectFail({webrtc: webrtc, event: error}));
          },
          onSetRemoteSuccess: function(){
            rtcListerner.onReceiveSetup("");
          }
          // onSetLocalSessionDescriptionSuccess: function (error) {
          //     _logger.debug('onSetLocalSessionDescriptionSuccess : setLocalDescription complete: ' + error.toString());
          //     self.onEvent && self.onEvent(new __event.ICEConnectFail({webrtc: webrtc, event: error}));
          // },
      }, {iceServerConfig: jsonConfig,offerOptions});
      webrtc.__setRemoteSDP = true;
      console.log(webrtc);
      webrtc.createRtcPeerConnection(jsonConfig);
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
            webrtc && webrtc.addTrack(stream.getTracks(),stream);
            console.log("createOffer start");
            webrtc.createOffer((localsdp) => {
              let sdp = {};
              sdp["type"] = "offer";
              sdp["sdp"] = localsdp.sdp;
              rtcListerner.onReceiveLocalSdp(JSON.stringify(sdp));
            },() => {
              console.log("createofferError:");
            })
            console.log("123");
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
    });
    rtcProxy.setRtcRemoteJson((callId,json) => {
        console.log("setRtcRemoteJson");
        console.log("callId:" + callId);
        console.log("json:" + json);
        let obj = JSON.parse(json);
        obj.type = obj.type.toLowerCase();
        if(obj.type == "candidate")
        {
          webrtc && webrtc.addIceCandidate(obj);
          if(!callIsCaller)
          {
            remoteCandidate.push(obj);
          }
          
        }else{
              if(obj.type == "offer"){
                if(answertype == 0){ //将remote sdp中 video中改为 a=mid:video -》 a=sendrecv|a=sendonly--recvonly
                  var videoSectionReplace = function (regx, use) {
                      var videoSectionIndex = obj.sdp.indexOf("m=video");
                      var audioSectionIndex = obj.sdp.indexOf("m=audio");
                      var end = audioSectionIndex > videoSectionIndex ? audioSectionIndex : obj.sdp.length;
          
                      obj.sdp = obj.sdp.replace(regx, function (match, offset, string) {
                          if(offset >= videoSectionIndex && offset < end){
                              return use;
                          }else{
                              return match;
                          }
                      });
                  };
          
                  videoSectionReplace(/a=sendrecv|a=sendonly/g, "a=inactive");
                }
              }
              webrtc && webrtc.setRemoteDescription(obj);
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
        webrtc && webrtc.close(false,false,false);
        rtcListerner && rtcListerner.onReceiveClose("hangup");
    });
    rtcProxy.getRtcReport(async (callId) => {
        console.log("getRtcReport");
        console.log("callId:" + callId);
        let statsOutput = "";
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
  // webrtc && webrtc.setRemoteDescription(remoteObj).then(() => {
  //   console.log("setRemoteDescription success");
      //访问用户媒体设备
      function getUserMedia(constraints, success, fail) {
      //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(fail);
      }
      function success(stream) {
        console.log("getUserMedia success");
        webrtc && webrtc.addTrack(stream.getTracks(),stream);
        webrtc && webrtc.createPRAnswer((sdp) => {
          rtcListerner.onReceiveLocalSdp(JSON.stringify(sdp));
        },() => {
          console.log("createPranswer fail");
        });
        localStream = stream;
        _eventEmitter.emit("getLocalStream",localStream,answertype);
        remoteCandidate.forEach((obj) => {
          webrtc && webrtc.addIceCandidate(obj)
        });
        remoteCandidate = [];
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
  // }).catch((reason) => {
  //   console.log("setRemoteDescription fail:"+reason);
  // });
}

EMCallManager.prototype.sendAnswer = function(callId){
  let _manager = this._manager;
    webrtc && webrtc.createAnswer((sdp) => {
      console.log("sendanswer");
      rtcListerner.onReceiveSetup("");
      let error = new EMError();  
      _manager.asyncAnswerCall(callId,error._error);
      rtcListerner.onReceiveLocalSdp(JSON.stringify(sdp));
    },() => {
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