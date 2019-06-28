'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMCallSessionStatistics implementation.
 */

/**
 * EMCallSessionStatistics constructor.
 * @constructor
 */
function EMCallSessionStatistics() {
  if (arguments.length == 0) {
    this._callSessionStatistics = new easemobNode.EMCallSessionStatistics();
  } else {
    this._callSessionStatistics = arguments[0];
  }
}

/**
 * set the call connect type
 * @param  {String} type 设置连接类型
 * @return {void}
 */
EMCallSessionStatistics.prototype.setConnType = function (type) {
  this._callSessionStatistics.setConnType(type);
};

/**
 * get the call connect type
 * @return {String} 返回连接类型
 */
EMCallSessionStatistics.prototype.getConnType = function () {
  return this._callSessionStatistics.getConnType();
};


/**
 * set the call connection rtt
 * @param  {Number} rtt 设置连接有效往返时间
 * @return {void}
 */
EMCallSessionStatistics.prototype.setConnectionRtt = function (rtt) {
    this._callSessionStatistics.setConnectionRtt(rtt);
  };
  
/**
 * get the call connection rtt
 * @return {Number} 返回连接有效往返时间
*/
EMCallSessionStatistics.prototype.getConnectionRtt = function () {
    return this._callSessionStatistics.getConnectionRtt();
  };

/**
 * set the call local video rtt
 * @param  {Number} rtt 设置视频有效往返时间
 * @return {void}
 */
EMCallSessionStatistics.prototype.setLocalVideoRtt = function (rtt) {
    this._callSessionStatistics.setLocalVideoRtt(rtt);
  };
  
/**
 * get the call local video rtt
 * @return {Number} 返回视频有效往返时间
*/
EMCallSessionStatistics.prototype.getLocalVideoRtt = function () {
    return this._callSessionStatistics.getLocalVideoRtt();
  };

/**
 * set the call width of remote video
 * @param  {Number} width 设置显示对方视频的宽度
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRemoteVideoWidth = function (width) {
    this._callSessionStatistics.setRemoteVideoWidth(width);
  };
  
/**
 * get the call width of remote video
 * @return {Number} 返回显示对方视频的宽度
*/
EMCallSessionStatistics.prototype.getRemoteVideoWidth = function () {
    return this._callSessionStatistics.getRemoteVideoWidth();
  };

/**
 * set the call height of remote video
 * @param  {Number} height 设置显示对方视频的高度
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRemoteVideoHeight = function (height) {
    this._callSessionStatistics.setRemoteVideoHeight(height);
  };
  
/**
 * get the call height of remote video
 * @return {Number} 返回显示对方视频的高度
*/
EMCallSessionStatistics.prototype.getRemoteVideoHeight = function () {
    return this._callSessionStatistics.getRemoteVideoHeight();
  };

/**
 * set the call local video fps
 * @param  {Number} fps 设置本地视频每秒传输帧数
 * @return {void}
 */
EMCallSessionStatistics.prototype.setLocalVideoFps = function (fps) {
    this._callSessionStatistics.setLocalVideoFps(fps);
  };
  
/**
 * get the call local video fps
 * @return {Number} 返回本地视频每秒传输帧数
*/
EMCallSessionStatistics.prototype.getLocalVideoFps = function () {
    return this._callSessionStatistics.getLocalVideoFps();
  };

/**
 * set the call remote video fps
 * @param  {Number} fps 设置对方视频每秒传输帧数
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRemoteVideoFps = function (fps) {
    this._callSessionStatistics.setRemoteVideoFps(fps);
  };
  
/**
 * get the call remote video fps
 * @return {Number} 返回对方视频每秒传输帧数
*/
EMCallSessionStatistics.prototype.getRemoteVideoFps = function () {
    return this._callSessionStatistics.getRemoteVideoFps();
  };

/**
 * set the call local video packets lost rate
 * @param  {Number} lost 设置本地视频丢包率
 * @return {void}
 */
EMCallSessionStatistics.prototype.setLocalVideoPacketsLostRate = function (lost) {
    this._callSessionStatistics.setLocalVideoPacketsLostRate(lost);
  };
  
/**
 * get the call local video packets lost rate
 * @return {Number} 返回本地视频丢包率
*/
EMCallSessionStatistics.prototype.getLocalVideoPacketsLostRate = function () {
    return this._callSessionStatistics.getLocalVideoPacketsLostRate();
  };

/**
 * set the call local audio packets lost rate
 * @param  {Number} lost 设置本地音频丢包率
 * @return {void}
 */
EMCallSessionStatistics.prototype.setLocalAudioPacketsLostRate = function (lost) {
    this._callSessionStatistics.setLocalAudioPacketsLostRate(lost);
  };
  
/**
 * get the call local audio packets lost rate
 * @return {Number} 返回本地音频丢包率
*/
EMCallSessionStatistics.prototype.getLocalAudioPacketsLostRate = function () {
    return this._callSessionStatistics.getLocalAudioPacketsLostRate();
  };

/**
 * set the call remote video packets lost rate
 * @param  {Number} lost 设置对方视频丢包率
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRemoteVideoPacketsLostRate = function (lost) {
    this._callSessionStatistics.setRemoteVideoPacketsLostRate(lost);
  };
  
/**
 * get the call remote video packets lost rate
 * @return {Number} 返回对方视频丢包率
*/
EMCallSessionStatistics.prototype.getRemoteVideoPacketsLostRate = function () {
    return this._callSessionStatistics.getRemoteVideoPacketsLostRate();
  };

/**
 * set the call remote audio packets lost rate
 * @param  {Number} lost 设置对方音频丢包率
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRemoteAudioPacketsLostRate = function (lost) {
    this._callSessionStatistics.setRemoteAudioPacketsLostRate(lost);
  };
  
/**
 * get the call remote audio packets lost rate
 * @return {Number} 返回对方音频丢包率
*/
EMCallSessionStatistics.prototype.getRemoteAudioPacketsLostRate = function () {
    return this._callSessionStatistics.getRemoteAudioPacketsLostRate();
  };

/**
 * set the call local video actual bps
 * @param  {Number} bps 设置本地视频实际比特率
 * @return {void}
 */
EMCallSessionStatistics.prototype.setLocalVideoActualBps = function (bps) {
    this._callSessionStatistics.setLocalVideoActualBps(bps);
  };
  
/**
 * get the call local video actual bps
 * @return {Number} 返回本地视频实际比特率
*/
EMCallSessionStatistics.prototype.getLocalVideoActualBps = function () {
    return this._callSessionStatistics.getLocalVideoActualBps();
  };

/**
 * set the call remote audio actual bps
 * @param  {Number} bps 设置对方音频实际比特率
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRemoteAudioBps = function (bps) {
    this._callSessionStatistics.setRemoteAudioBps(bps);
  };
  
/**
 * get the call remote audio actual bps
 * @return {Number} 返回对方音频实际比特率
*/
EMCallSessionStatistics.prototype.getRemoteAudioBps = function () {
    return this._callSessionStatistics.getRemoteAudioBps();
  };

/**
 * set the call remote video actual bps
 * @param  {Number} bps 设置对方视频实际比特率
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRemoteVideoBps = function (bps) {
    this._callSessionStatistics.setRemoteVideoBps(bps);
  };
  
/**
 * get the call remote video actual bps
 * @return {Number} 返回对方视频实际比特率
*/
EMCallSessionStatistics.prototype.getRemoteVideoBps = function () {
    return this._callSessionStatistics.getRemoteVideoBps();
  };
  
/**
 * set the call rtc report
 * @param  {String} report 设置rtc状态信息
 * @return {void}
 */
EMCallSessionStatistics.prototype.setRtcReport = function (report) {
    this._callSessionStatistics.setRtcReport(bps);
  };
  
/**
 * get the call rtc report
 * @return {String} 返回rtc状态信息
*/
EMCallSessionStatistics.prototype.getRtcReport = function () {
    return this._callSessionStatistics.getRtcReport();
  };

module.exports = EMCallSessionStatistics;