'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');
const EMError = require('./emerror');
const handle = new easemobNode.EMCallbackObserverHandle();

//EMCallback object callback interface number.
const emCallbackCount = 3;

/**
 * Easemob EMCallback implementation.
 */

 /**
 * EMCallback constructor.
 * @constructor
 */
function EMCallback() {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(emCallbackCount);
  self._callback = new easemobNode.EMCallback(handle);
  self._callback.onSuccess = function() {
    self._eventEmitter.emit('onSuccess');
  };
  self._callback.onFail = function(error) {
    self._eventEmitter.emit('onSuccess', new EMError(error));
  };
  self._callback.onProgress = function(progress) {
    self._eventEmitter.emit('onSuccess', progress);
  };
}

/**
 * 设置操作成功时执行的回调
 * @param {EMCallback~success} callback 回调函数，成功时执行
 * @return {void}
 */
EMCallback.prototype.onSuccess = function(callback) {
  this._eventEmitter.on('onSuccess', callback);
};
/**
 * @function EMCallback~success
 * @return {void}
 */

/**
 * 设置操作失败时执行的回调
 * @param {EMCallback~fail} callback 回调函数，失败时执行
 * @return {void}
 */
EMCallback.prototype.onFail = function(callback) {
  this._eventEmitter.on('onFail', callback);
};

/**
 * @function EMCallback~fail
 * @param {EMError} error EMError对象
 * @return {void}
 */

/**
 * 操作进度改变时，执行的回调
 * @param {EMCallback~progress} callback called when method is running
 * @return {void}
 */
EMCallback.prototype.onProgress = function (callback) {
  this._eventEmitter.on('onProgress', callback);
};

/**
 * @function EMCallback~progress
 * @param {Number} progress 进度，1-100
 * @return {void}
 */

module.exports = EMCallback;