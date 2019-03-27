'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');
const EMError = require('./emerror');

//EMConnectionListener object callback interface number.
const emConnectionListenerCount = 3;

/**
 * Easemob EMConnectionListener implementation.
 */

/**
 * EMConnectionListener constructor.
 * @constructor
 */
function EMConnectionListener() {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(emConnectionListenerCount);
  self._listener = new easemobNode.EMConnectionListener();
  self._listener.onConnect = function() {
    self._eventEmitter.emit('onConnect');
  };
  self._listener.onDisconnect = function (error) {
    self._eventEmitter.emit('onDisconnect', new EMError(error));
  };
}

/**
 * Callback user when sdk connect to the server.
 * @param {EMConnectionListener~onConnectCallback} callback 回调函数
 * @return {void}
 */
EMConnectionListener.prototype.onConnect = function(callback) {
  this._eventEmitter.on('onConnect', callback);
};

/**
 * @function EMConnectionListener~onConnectCallback
 * @return {void}
 */

/**
 * Callback user when sdk disconnect from the server.
 * @param {EMConnectionListener~onDisconnectCallback} callback 回调函数
 * @return {void}
 */
EMConnectionListener.prototype.onDisconnect = function(callback) {
  this._eventEmitter.on('onDisconnect', callback);
};

/**
 * @function EMConnectionListener~onDisconnectCallback
 * @param {EMError} error 断开连接结果
 * @return {void}
 */

module.exports = EMConnectionListener;