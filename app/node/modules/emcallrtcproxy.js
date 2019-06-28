'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMCallRtcProxy implementation.
 */

 /**
 * EMCallRtcProxy constructor.
 * @constructor
 */
function EMCallRtcProxy() {
    if (arguments.length == 0) {
        this._rtcProxy = new easemobNode.EMCallRtcProxyInterface();
      } else {
        this._rtcProxy = arguments[0];
      }
}

/**
 * 推送消息
 * @param {EMCallRtcProxy~sendPushMessage} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.sendPushMessage = function(callback) {
  this._rtcProxy.sendPushMessage = callback;
};

/**
 * 创建rtc
 * @param {EMCallRtcProxy~createRtc} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.createRtc = function(callback) {
    this._rtcProxy.createRtc = callback;
  };

/**
 * 设置rtc配置
 * @param {EMCallRtcProxy~setRtcConfigure} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.setRtcConfigure = function(callback) {
    this._rtcProxy.setRtcConfigure = callback;
  };

/**
 * 设置rtc对方信息
 * @param {EMCallRtcProxy~setRtcRemoteJson} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.setRtcRemoteJson = function(callback) {
    this._rtcProxy.setRtcRemoteJson = callback;
  };

/**
 * rtc接收
 * @param {EMCallRtcProxy~createRtcAnswer} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.createRtcAnswer = function(callback) {
    this._rtcProxy.createRtcAnswer = callback;
  };

/**
 * 修改rtc
 * @param {EMCallRtcProxy~updateRtc} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.updateRtc = function(callback) {
    this._rtcProxy.updateRtc = callback;
  };

/**
 * 结束rtc
 * @param {EMCallRtcProxy~endRtc} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.endRtc = function(callback) {
    this._rtcProxy.endRtc = callback;
  };

/**
 * 获取rtc报告
 * @param {EMCallRtcProxy~getRtcReport} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.getRtcReport = function(callback) {
    this._rtcProxy.getRtcReport = callback;
  };

/**
 * 切换摄像头
 * @param {EMCallRtcProxy~switchCamera} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallRtcProxy.prototype.switchCamera = function(callback) {
    this._rtcProxy.switchCamera = callback;
  };

/**
 * @function EMCallRtcProxy~sendPushMessage
 * @param {String} from 呼叫ID
 * @param {String} to 被叫方
 * @param {Number} callType 类型
 * @return {void}
 */

/**
 * @function EMCallRtcProxy~createRtc
 * @param {String} callId 呼叫ID
 * @param {String} remoteId 被叫方
 * @param {Number} type 类型
 * @param {String} localConfig
 * @return {void}
 */

/**
 * @function EMCallRtcProxy~setRtcConfigure
 * @param {String} callId 呼叫ID
 * @param {Number} type 类型
 * @param {Booler} isCaller
 * @param {String} localConfig
 * @return {void}
 */

/**
 * @function EMCallRtcProxy~setRtcRemoteJson
 * @param {String} callId 呼叫ID
 * @param {String} json json信息
 * @return {void}
 */

/**
 * @function EMCallRtcProxy~createRtcAnswer
 * @param {String} callId 呼叫ID
 * @return {void}
 */

/**
 * @function EMCallRtcProxy~updateRtc
 * @param {String} callId 呼叫ID
 * @param {Number} controlType
 * @return {void}
 */

/**
 * @function EMCallRtcProxy~endRtc
 * @param {String} callId 呼叫ID
 * @return {void}
 */

/**
 * @function EMCallRtcProxy~getRtcReport
 * @param {String} callId 呼叫ID
 * @return {String} rtc Report
 */

/**
 * @function EMCallRtcProxy~switchCamera
 * @param {String} callId 呼叫ID
 * @return {void}
 */

module.exports = EMCallRtcProxy;