const _ = require('underscore');
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

module.exports = SDPSection;