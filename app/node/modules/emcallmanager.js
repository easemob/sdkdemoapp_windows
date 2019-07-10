'use strict';

const _ = require('underscore');
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
          if(JSON.stringify( e.candidate).indexOf('tcp') != -1){
            return;
          }
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
          if(pc && pc.iceConnectionState === "failed")
          {
            _manager.asyncEndCall(callId,6);
          }
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
              function updateSDP() {
                var sdpSection = new SDPSection(answersdp);
                var ms = sdpSection.parseMsidSemantic(sdpSection.headerSection);
                if(!ms){
                    return;
                }

                if(ms.WMS == '*') {
                    sdpSection.updateHeaderMsidSemantic(ms.WMS = "MS_0000");
                }
                var audioSSRC = sdpSection.parseSSRC(sdpSection.audioSection);
                var videoSSRC = sdpSection.parseSSRC(sdpSection.videoSection);

                audioSSRC && sdpSection.updateAudioSSRCSection(1000, "CHROME0000", ms.WMS, audioSSRC.label || "LABEL_AUDIO_1000");
                if(videoSSRC){
                    sdpSection.updateVideoSSRCSection(2000, "CHROME0000", ms.WMS, videoSSRC.label || "LABEL_VIDEO_2000");
                }
                // mslabel cname

                answersdp = sdpSection.getUpdatedSDP();
            }

            updateSDP();
            
            answersdp = answersdp.replace(/c=IN IP4 0.0.0.0/g, "c=IN IP4 172.17.2.32");
            answersdp = answersdp.replace(/audio 9/g, "audio 49707");
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
              var videoSectionReplace = function (regx, use) {
                var videoSectionIndex = remoteObj.sdp.indexOf("m=video");
                var audioSectionIndex = remoteObj.sdp.indexOf("m=audio");
                var end = audioSectionIndex > videoSectionIndex ? audioSectionIndex : remoteObj.sdp.length;
    
                remoteObj.sdp = remoteObj.sdp.replace(regx, function (match, offset, string) {
                    if(offset >= videoSectionIndex && offset < end){
                        return use;
                    }else{
                        return match;
                    }
                });
            };
    
            answertype == 0 && videoSectionReplace(/a=sendrecv|a=sendonly/g, "a=inactive");
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
          answersdp = sdpinit.sdp;
          sdpinit.sdp = sdpinit.sdp.replace(/a=recvonly/g, 'a=inactive');
          pc && pc.setLocalDescription(sdpinit).then((val) => {
            var sdpSection = new SDPSection(sdpinit.sdp);

            sdpSection.updateHeaderMsidSemantic("MS_0000");
            sdpSection.updateAudioSSRCSection(1000, "CHROME0000", "MS_0000", "LABEL_AUDIO_1000");
            sdpSection.updateVideoSSRCSection(2000, "CHROME0000", "MS_0000", "LABEL_VIDEO_2000");

            sdpinit.sdp = sdpSection.getUpdatedSDP();
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
          console.log(JSON.stringify(candidate));
          pc && pc.addIceCandidate(candidate).then(() => {
            console.log("AddIceCandidate success");
          }).catch((reason) => {
            console.log("AddIceCandidate fail:" + reason);
          })
        })
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


var _SDPSection = {
  headerSection: null,

  audioSection: null,
  videoSection: null,

  _parseHeaderSection: function (sdp, audioIndex, videoIndex) {
      var index = audioIndex;

      if(videoIndex === -1){ //保持不变
      }else if(audioIndex === -1){
          index = videoIndex;
      }else{
          index = Math.min(audioIndex, videoIndex);
      }

      if (index >= 0) {
          return sdp.slice(0, index);
      }
      return sdp;
  },

  _parseAudioSection: function (sdp, audioIndex, videoIndex) {
      var index = audioIndex;
      if (index >= 0) {
          return sdp.slice(index, videoIndex < index ? sdp.length : videoIndex);
      }
  },

  _parseVideoSection: function (sdp, audioIndex, videoIndex) {
      var index = videoIndex;
      if (index >= 0) {
          return sdp.slice(index, audioIndex < index ? sdp.length : audioIndex);
      }
  },

  spiltSection: function (sdp) {
      var self = this;

      self._preSDP = sdp;

      var audioIndex = self._preAudioIndex = sdp.indexOf('m=audio');
      var videoIndex = self._preVideoIndex = sdp.indexOf('m=video');

      self.headerSection = self._parseHeaderSection(sdp, audioIndex, videoIndex);
      self.audioSection = self._parseAudioSection(sdp, audioIndex, videoIndex);
      self.videoSection = self._parseVideoSection(sdp, audioIndex, videoIndex);
  },


  setVideoBitrate: function (vbitrate) {
      if(!vbitrate || !this.videoSection){
          return;
      }

      this.videoSection = this.setBitrate(this.videoSection, vbitrate);
  },

  setAudioBitrate: function (abitrate) {
      if(!abitrate || !this.audioSection){
          return;
      }

      this.audioSection = this.setBitrate(this.audioSection, abitrate);
  },

  setBitrate: function (section, bitrate) {
      section = section.replace(/(b=)(?:AS|TIAS)(\:)\d+/g, "$1AS$2" + bitrate);
      if(section.indexOf('b=AS') < 0){
          section = section.replace(/(m=(?:audio|video)[^\r\n]+)([\r\n]+)/g, "$1$2b=AS:" + bitrate + "$2")
      }
      return section;
  },

  updateVideoSection: function (regx, oper) {
      var self = this;

      if(!self.videoSection){
          return;
      }

      self.videoSection = self.videoSection.replace(regx, oper);
  },

  updateAudioSection: function (regx, oper) {
      var self = this;

      if(!self.audioSection){
          return;
      }

      self.audioSection = self.audioSection.replace(regx, oper);
  },

  updateVideoSendonly: function () {
      var self = this;

      if(!self.videoSection){
          return;
      }

      self.videoSection = self.videoSection.replace(/sendrecv/g, "sendonly");
  },

  updateVideoRecvonly: function () {
      var self = this;

      if(!self.videoSection){
          return;
      }

      self.videoSection = self.videoSection.replace(/sendrecv/g, "recvonly");
  },

  updateAudioSendonly: function () {
      var self = this;

      if(!self.audioSection){
          return;
      }

      self.audioSection = self.audioSection.replace(/sendrecv/g, "sendonly");
  },

  updateAudioRecvonly: function () {
      var self = this;

      if(!self.audioSection){
          return;
      }

      self.audioSection = self.audioSection.replace(/sendrecv/g, "recvonly");
  },

  updateVCodes: function (vcodes) {
      var self = this;

      if(!vcodes){
          return;
      }
      if(!self.videoSection){
          return;
      }

      if(typeof vcodes === "string"){
          var arr = [];
          arr.push(vcodes);
          vcodes = arr;
      }

      var vcodeMap = {};
      var regexp = /a=rtpmap:(\d+) ([A-Za-z0-9]+)\/.*/ig;
      var arr = self._parseLine(self.videoSection, regexp);
      for(var i = 0; i < arr.length; i++) {
          var codeNum = arr[++i];
          var code = arr[++i];
          vcodeMap[code] = codeNum;
      }

      //H264
      //if(/Firefox/.test(navigator.userAgent) || /Chrome/.test(navigator.userAgent)){ //a=fmtp:126 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1
      var h264_regexp = /a=fmtp:(\d+) .*profile-level-id=42e01f;?.*/ig;
      var h264_arr = self._parseLine(self.videoSection, h264_regexp);

      if(h264_arr && h264_arr.length >= 2){
          vcodeMap['H264'] = h264_arr[1];
      }
      //}

      var numCodes = []
      for(var i = 0; i < vcodes.length; i++){
          var supportVCode = vcodeMap[vcodes[i]];
          supportVCode && numCodes.push(supportVCode);
      }
      if(numCodes.length == 0){
          _logger.warn("Not found vcodes map", vcodes);
          if(self._webrtc){
              _logger.warn("Not found vcodes map", vcodes, self._webrtc._rtcId, self._webrtc.__id);
          }
      }

      var codeLineLastIndex = self.videoSection.indexOf('\r');
      var codeLine = self.videoSection.substring(0, codeLineLastIndex);

      var fields = codeLine.split(' ');

      Array.prototype.push.apply(numCodes, fields.slice(3));

      var newNumCodes = [];
      var _map = {};
      _.forEach(numCodes, function (index, ele) {
          if(newNumCodes.length == 0){
              newNumCodes.push(ele);
              _map[ele] = true;
          } else {
              if(!_map[ele]){
                  newNumCodes.push(ele);
                  _map[ele] = true;
              }
          }
      });
      //alert(numCodes.join(' '));

      //fields.splice(3, 0, numCodes);
      fields.splice(3, fields.length - 3, newNumCodes.join(' '));

      codeLine = fields.join(' ');
      //_logger.info(codeLine);
      if(self._webrtc){
          _logger.warn(codeLine, self._webrtc._rtcId, self._webrtc.__id);
      }

      self.videoSection = codeLine + self.videoSection.substring(codeLineLastIndex);
  },

  removeSSRC: function (section) {
      var arr = [];

      var _arr = section.split(/a=ssrc:[^\n]+/g);
      for (var i = 0; i < _arr.length; i++) {
          _arr[i] != '\n' && arr.push(_arr[i]);
      }
      // arr.push('');

      return arr.join('\n');
  },

  removeField_msid: function (section) {
      var arr = [];

      var _arr = section.split(/a=msid:[^\n]+/g);
      for (var i = 0; i < _arr.length; i++) {
          _arr[i] != '\n' && arr.push(_arr[i]);
      }
      // arr.push('');

      section = arr.join('\n');
      arr = [];

      _arr = section.split(/[\n]+/g);
      for (var i = 0; i < _arr.length; i++) {
          (_arr[i] != '\n') && arr.push(_arr[i]);
      }

      return arr.join('\n');
  },

  updateHeaderMsidSemantic: function (wms) {

      var self = this;

      var line = "a=msid-semantic: WMS " + wms;

      var _arr = self.headerSection.split(/a=msid\-semantic: WMS.*/g);
      var arr = [];
      switch (_arr.length) {
          case 1:
              arr.push(_arr[0]);
              break;
          case 2:
              arr.push(_arr[0]);
              arr.push(line);
              arr.push('\n');
              break;
          case 3:
              arr.push(_arr[0]);
              arr.push(line);
              arr.push('\n');
              arr.push(_arr[2]);
              arr.push('\n');
              break;
      }

      return self.headerSection = arr.join('');
  },

  updateAudioSSRCSection: function (ssrc, cname, msid, label) {
      var self = this;

      self.audioSection && (self.audioSection = self.removeSSRC(self.audioSection));
      self.audioSection && (self.audioSection = self.removeField_msid(self.audioSection));
      self.audioSection && (self.audioSection = self.audioSection + self.ssrcSection(ssrc, cname, msid, label));
  },


  updateVideoSSRCSection: function (ssrc, cname, msid, label) {
      var self = this;

      self.videoSection && (self.videoSection = self.removeSSRC(self.videoSection));
      self.videoSection && (self.videoSection = self.removeField_msid(self.videoSection));
      self.videoSection && (self.videoSection = self.videoSection + self.ssrcSection(ssrc, cname, msid, label))
  },

  getUpdatedSDP: function (audioVideo) {
      var self = this;

      if(self._preAudioIndex < 0 || self._preVideoIndex < 0){
          return this._preSDP;
      }

      audioVideo = (audioVideo === true || audioVideo === undefined);
      var sdpAudioVideo = self._preAudioIndex < self._preVideoIndex;

      if(audioVideo == sdpAudioVideo){
          return this._preSDP;
      }

      var videoMid;
      self.videoSection.replace(/a=mid:([^\r\n]+)/, function(match, p1){
          videoMid = p1;
          return match;
      });

      var audioMid;
      self.audioSection.replace(/a=mid:([^\r\n]+)/, function(match, p1){
          audioMid = p1;
          return match;
      });

      var sdp;
      if(audioVideo){
          sdp = self.headerSection.replace(/a=group:BUNDLE [^\r\n]+/, "a=group:BUNDLE " + audioMid + " " + videoMid);

          self.audioSection && (sdp += self.audioSection);
          self.videoSection && (sdp += self.videoSection);
      }else{
          sdp = self.headerSection.replace(/a=group:BUNDLE [^\r\n]+/, "a=group:BUNDLE " + videoMid + " " + audioMid);

          self.videoSection && (sdp += self.videoSection);
          self.audioSection && (sdp += self.audioSection);
      }

      return sdp;
  },

  parseMsidSemantic: function (header) {
      var self = this;

      var regexp = /a=msid\-semantic:\s*WMS (\S+)/ig;
      var arr = self._parseLine(header, regexp);

      arr && arr.length == 2 && (self.msidSemantic = {
          line: arr[0],
          WMS: arr[1]
      });

      return self.msidSemantic;
  },

  ssrcSection: function (ssrc, cname, msid, label) {
      var lines = [
          'a=ssrc:' + ssrc + ' cname:' + cname,
          'a=ssrc:' + ssrc + ' msid:' + msid + ' ' + label,
          'a=ssrc:' + ssrc + ' mslabel:' + msid,
          'a=ssrc:' + ssrc + ' label:' + label,
          ''
      ];

      return lines.join('\n');
  },

  parseSSRC: function (section) {
      var self = this;

      var regexp = new RegExp("a=(ssrc):(\\d+) (\\S+):(\\S+)", "ig");

      var arr = self._parseLine(section, regexp);
      if (arr) {
          var ssrc = {
              lines: [],
              updateSSRCSection: self.ssrcSection
          };

          for (var i = 0; i < arr.length; i++) {
              var e = arr[i];
              if (e.indexOf("a=ssrc") >= 0) {
                  ssrc.lines.push(e);
              } else {
                  switch (e) {
                      case 'ssrc':
                      case 'cname':
                      case 'msid':
                      case 'mslabel':
                      case 'label':
                          ssrc[e] = arr[++i];
                  }
              }
          }

          return ssrc;
      }
  },

  _parseLine: function (str, regexp) {
      var arr = [];

      var _arr;
      while ((_arr = regexp.exec(str)) != null) {
          for (var i = 0; i < _arr.length; i++) {
              arr.push(_arr[i]);
          }
      }

      if (arr.length > 0) {
          return arr;
      }
  }
};

var SDPSection = function (sdp, webrc) {
  _.extend(this, _SDPSection);
  this._webrtc = webrc;
  this.spiltSection(sdp);
};

SDPSection.isAudioVideo = function (sdp) {
  var audioIndex = sdp.indexOf('m=audio');
  var videoIndex = sdp.indexOf('m=video');

  return audioIndex < videoIndex;
}

SDPSection.isVideoPreAudio = function (sdp) {
  var audioIndex = sdp.indexOf('m=audio');
  var videoIndex = sdp.indexOf('m=video');

  return audioIndex >= 0 && videoIndex>=0 && videoIndex < audioIndex;
}
module.exports = EMCallManager;