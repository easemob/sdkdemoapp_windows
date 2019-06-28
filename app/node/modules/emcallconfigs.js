'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMCallConfigs implementation.
 */

/**
 * EMCallConfigs constructor.
 * @constructor
 */
function EMCallConfigs() {
  if (arguments.length == 0) {
    this._callConfigs = new easemobNode.EMCallConfigs();
  } else {
    this._callConfigs = arguments[0];
  }
}

/**
 * set if send push when the remote is offline
 * @param  {Bool} sendPushIfOffline 对方离线时是否发推送
 * @return {void}
 */
EMCallConfigs.prototype.setIsSendPushIfOffline = function (sendPushIfOffline) {
  this._callConfigs.setIsSendPushIfOffline(sendPushIfOffline);
};

/**
 * get if send push when the remote is offline
 * @return {Bool} 对方离线时是否发推送
 */
EMCallConfigs.prototype.getIsSendPushIfOffline = function () {
  return this._callConfigs.getIsSendPushIfOffline();
};

/**
 * set the resolution of video,contain width and height.it will be applied on the next video call.
 * @param {Number} width 视频宽度
 * @param {Number} height 视频高度
 * @return {void}
 */
EMCallConfigs.prototype.setVideoResolution = function (width,height) {
  this._callConfigs.setVideoResolution(width,height);
};

/**
 * get the resolution width.
 * @return {Number} 返回视频宽度
 */
EMCallConfigs.prototype.getVideoResolutionWidth = function () {
  return this._callConfigs.getVideoResolutionWidth();
};

/**
 * get the resolution height.
 * @return {Number} 返回视频高度
 */
EMCallConfigs.prototype.getVideoResolutionHeight = function () {
    return this._callConfigs.getVideoResolutionHeight();
};
/**
 * set the video transfer speed
 * @param {Number} kbps 视频信号传输速度
 * @return {void}
 */
EMCallConfigs.prototype.setVideoKbps = function (kbps) {
  this._callConfigs.setVideoKbps(kbps);
};

/**
 * get the video transfer speed.
 * @return {Number} 视频信号传输速度
 */
EMCallConfigs.prototype.getVideoKbps = function () {
  return this._callConfigs.getVideoKbps();
};

/**
 * set the period of ping.
 * @param {Number} interval 设置心跳周期
 * @return {void}
 */
EMCallConfigs.prototype.setPingInterval = function (interval) {
  this._callConfigs.setPingInterval(interval);
};

/**
 * get the period of ping.
 * @return {Number} 返回心跳周期，单位秒，最小10
 */
EMCallConfigs.prototype.getPingInterval = function () {
  return this._callConfigs.getPingInterval();
};

/**
 * set audio signal transfer speed.
 * @param {Number} kbps 设置音频信号传输速率
 * @return {void} 
 */
EMCallConfigs.prototype.setAudioKbps = function (kbps) {
  this._callConfigs.setAudioKbps(kbps);
};

/**
 * get audio signal transfer speed.
 * @return {Number} 获取音频信号传输速率
 */
EMCallConfigs.prototype.getAudioKbps = function () {
  return this._callConfigs.getAudioKbps();
};

/**
 * set if report the video/audio quality.
 * @param {Bool} b
 * @return {void} 设置是否报告音视频质量
 */
EMCallConfigs.prototype.setReportQuality = function (b) {
  this._callConfigs.setReportQuality(b);
};

/**
 * get if report the video/audio quality.
 * @return {Bool} 获取是否报告音视频质量
 */
EMCallConfigs.prototype.getReportQuality = function () {
  return this._callConfigs.getReportQuality();
};

module.exports = EMCallConfigs;