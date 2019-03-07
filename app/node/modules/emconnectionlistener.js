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
  self._listener.onPong = function () {
    self._eventEmitter.emit('onPong');
  };
}

/**
 * Callback user when sdk connect to the server.
 * callback function type:
 * function callback() {
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMConnectionListener.prototype.onConnect = function(callback) {
  this._eventEmitter.on('onConnect', callback);
};

/**
 * Callback user when sdk disconnect from the server.
 * callback function type:
 * function callback(error) {
 *  //@param {EMError} error
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMConnectionListener.prototype.onDisconnect = function(callback) {
  this._eventEmitter.on('onDisconnect', callback);
};

/**
 * Callback user when sdk onPong data.
 * callback function type:
 * function callback() {
 *  ...
 *  //@return {void}
 * } 
 * @param {callback} callback
 * @return {void}
 */
EMConnectionListener.prototype.onPong = function(callback) {
  this._eventEmitter.on('onPong', callback);
};

module.exports = EMConnectionListener;