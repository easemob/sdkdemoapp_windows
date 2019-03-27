'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');

//EMMultiDevicesListener object callback interface number.
const emMultiDevicesListenerCount = 2;

/**
 * Easemob EMMultiDevicesListener implementation.
 */

/**
 * EMMultiDevicesListener constructor.
 * @constructor
 */
function EMMultiDevicesListener() {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._listener = new easemobNode.EMMultiDevicesListener();
  self._eventEmitter.setMaxListeners(emMultiDevicesListenerCount);
  self._listener.onContactMultiDevicesEvent = function (operation, target, ext) {
    self._eventEmitter.emit('onContactMultiDevicesEvent', operation, target, ext);
  };
  self._listener.onGroupMultiDevicesEvent = function (operation, target, usernames) {
    self._eventEmitter.emit('onGroupMultiDevicesEvent', operation, target, usernames);
  };
}

/**
 * callback function called when contact added.
 * @param {EMMultiDevicesListener~onContactMultiDevicesEventCallback} callback 回调函数
 * @return {void}
 */
EMMultiDevicesListener.prototype.onContactMultiDevicesEvent = function (callback) {
  this._eventEmitter.on('onContactMultiDevicesEvent', callback);
};

/**
 * @function EMMultiDevicesListener~onContactMultiDevicesEventCallback
 * @param {Number} operation 操作类型
 * @param {String} target 目标机器
 * @param {String} ext 扩展信息
 * @return {void}
 */

/**
 * callback function called when contact added.
 * @param {EMMultiDevicesListener~onGroupMultiDevicesEventCallback} callback
 * @return {void}
 */
EMMultiDevicesListener.prototype.onGroupMultiDevicesEvent = function (callback) {
  this._eventEmitter.on('onGroupMultiDevicesEvent', callback);
};

/**
 * @function EMMultiDevicesListener~onGroupMultiDevicesEventCallback
 * @param {Number} operation 操作类型
 * @param {String} target 目标机器
 * @param {Array} usernames. String username array.
 * @return {void}
 */

module.exports = EMMultiDevicesListener;