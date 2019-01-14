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
 * The success callback of async method.
 * callback function type:
 * function callback() {
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMCallback.prototype.onSuccess = function(callback) {
  this._eventEmitter.on('onSuccess', callback);
};

/**
 * The fail callback of async method.
 * callback function type:
 * function callback(error) {
 *  //@param {EMError} error
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMCallback.prototype.onFail = function(callback) {
  this._eventEmitter.on('onFail', callback);
};

/**
 * The progress callback of async method.
 * callback function type:
 * function callback(progress) {
 *  //@param {Number} progress
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMCallback.prototype.onProgress = function (callback) {
  this._eventEmitter.on('onProgress', callback);
};

module.exports = EMCallback;