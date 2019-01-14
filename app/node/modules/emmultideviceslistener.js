'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');

//EMMultiDevicesListener object callback interface number.
const emMultiDevicesListenerCount = 2;

/**
 * Easemob EMMultiDevicesListener implementation.
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
 * callback function type:
 * function callback(operation, target, ext) {
 *  //@param {Number} operation
 *  //@param {String} target
 *  //@param {String} ext
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMMultiDevicesListener.prototype.onContactMultiDevicesEvent = function (callback) {
  this._eventEmitter.on('onContactMultiDevicesEvent', callback);
};

/**
 * callback function called when contact added.
 * callback function type:
 * function callback(operation, target, usernames) {
 *  //@param {Number} operation
 *  //@param {String} target
 *  //@param {Array} usernames. String username array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMMultiDevicesListener.prototype.onGroupMultiDevicesEvent = function (callback) {
  this._eventEmitter.on('onGroupMultiDevicesEvent', callback);
};

module.exports = EMMultiDevicesListener;