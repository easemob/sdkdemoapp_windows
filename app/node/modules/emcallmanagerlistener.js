'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');
const EMCallSession = require('./emcallsession');
const EMError = require('./emerror');

//EMCallManagerListener object callback interface number.
const emCallManagerListenerCount = 3;

/**
 * Easemob EMCallManagerListener implementation.
 */

/**
 * EMCallManagerListener constructor.
 * @constructor
 */
function EMCallManagerListener() {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(emCallManagerListenerCount);
  self._listener = new easemobNode.EMCallManagerListener();
  self._listener.onRecvCallFeatureUnsupported = function (callsession,error) {
      self._eventEmitter.emit('onRecvCallFeatureUnsupported',  callsession,new EMError(error));
  };
  self._listener.onRecvCallIncoming = function (callsession) {
    self._eventEmitter.emit('onRecvCallIncoming',  new EMCallSession(callsession));
  };
  self._listener.onRecvCallConnected = function (callsession) {
    self._eventEmitter.emit('onRecvCallConnected',  new EMCallSession(callsession));
  };
  self._listener.onRecvCallAccepted = function (callsession) {
    self._eventEmitter.emit('onRecvCallAccepted',  new EMCallSession(callsession));
  };
  self._listener.onRecvCallEnded = function (callsession,reason,error) {
    self._eventEmitter.emit('onRecvCallEnded',  new EMCallSession(callsession),reason,new EMError(error));
  };
  self._listener.onRecvCallNetworkStatusChanged = function (callsession,toStatus) {
    self._eventEmitter.emit('onRecvCallNetworkStatusChanged',  new EMCallSession(callsession),toStatus);
  };
  self._listener.onRecvCallStateChanged = function (callsession,type) {
    self._eventEmitter.emit('onRecvCallStateChanged',  new EMCallSession(callsession),type);
  };
}

/**
 * Callback user when user receive an unsupported video/audio feature
 * @param {EMCallManagerListener~onRecvCallFeatureUnsupportedCallback} callback 回调函数
 * @return {void}
 */
EMCallManagerListener.prototype.onRecvCallFeatureUnsupported = function (callback) {
  this._eventEmitter.on('onRecvCallFeatureUnsupported', callback);
};

/**
 * Callback user when user receive an video/audio call
 * @param {EMCallManagerListener~onRecvCallIncomingCallback} callback 回调函数
 * @return {void}
 */
EMCallManagerListener.prototype.onRecvCallIncoming = function (callback) {
    this._eventEmitter.on('onRecvCallIncoming', callback);
  };

/**
 * Callback user when a call is connected
 * @param {EMCallManagerListener~onRecvCallIncomingCallback} callback 回调函数
 * @return {void}
 */
EMCallManagerListener.prototype.onRecvCallConnected = function (callback) {
    this._eventEmitter.on('onRecvCallConnected', callback);
  };

/**
 * Callback user when user accepted a call
 * @param {EMCallManagerListener~onRecvCallIncomingCallback} callback 回调函数
 * @return {void}
 */
EMCallManagerListener.prototype.onRecvCallAccepted = function (callback) {
    this._eventEmitter.on('onRecvCallAccepted', callback);
  };

/**
 * Callback user when a call is ended
 * @param {EMCallManagerListener~onRecvCallEndedCallback} callback 回调函数
 * @return {void}
 */
EMCallManagerListener.prototype.onRecvCallEnded = function (callback) {
    this._eventEmitter.on('onRecvCallEnded', callback);
  };

/**
 * Callback user when the network status is changed
 * @param {EMCallManagerListener~onRecvCallNetworkStatusChangedCallback} callback 回调函数
 * @return {void}
 */
EMCallManagerListener.prototype.onRecvCallNetworkStatusChanged = function (callback) {
    this._eventEmitter.on('onRecvCallNetworkStatusChanged', callback);
  };

/**
 * Callback user when the call state is changed
 * @param {EMCallManagerListener~onRecvCallStateChangedCallback} callback 回调函数
 * @return {void}
 */
EMCallManagerListener.prototype.onRecvCallStateChanged = function (callback) {
    this._eventEmitter.on('onRecvCallStateChanged', callback);
  };

/**
 * @function EMCallManagerListener~onRecvCallFeatureUnsupportedCallback
 * @param {EMCallSession} callsession 会话对象
 * @param {EMError} error 错误信息
 * @return {void}
 */

/**
 * @function EMCallManagerListener~onRecvCallIncomingCallback
 * @param {EMCallSession} callsession 会话对象
 * @return {void}
 */

/**
 * @function EMCallManagerListener~onRecvCallEndedCallback
 * @param {EMCallSession} callsession 会话对象
 * @param {Number} reason 会话结束原因，0挂掉，1无响应，2拒绝，3忙碌，4失败，5不支持，6离线
 * @param {EMError} error 错误信息
 * @return {void}
 */

/**
 * @function EMCallManagerListener~onRecvCallNetworkStatusChangedCallback
 * @param {EMCallSession} callsession 会话对象
 * @param {Number} toStatus 网络状态，0连接，1不稳定，2断开
 * @return {void}
 */

/**
 * @function EMCallManagerListener~onRecvCallStateChangedCallback
 * @param {EMCallSession} callsession 会话对象
 * @param {Number} type 会话类型，0音频暂停，1音频恢复，2视频暂停，3视频恢复
 * @return {void}
 */

module.exports = EMCallManagerListener;