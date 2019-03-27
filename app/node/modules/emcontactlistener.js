'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');

//EMContactListener object callback interface number.
const emContactListenerCount = 5;

/**
 * Easemob EMContactListener implementation.
 */

/**
 * EMContactListener constructor.
 * @constructor
 */
function EMContactListener() {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(emContactListenerCount);
  self._listener = new easemobNode.EMContactListener();
  self._listener.onContactAdded = function (username) {
    self._eventEmitter.emit('onContactAdded', username);
  };
  self._listener.onContactDeleted = function (username) {
    self._eventEmitter.emit('onContactDeleted', username);
  };
  self._listener.onContactInvited = function (username, reason) {
    self._eventEmitter.emit('onContactInvited', username, reason);
  };
  self._listener.onContactAgreed = function (username) {
    self._eventEmitter.emit('onContactAgreed', username);
  };
  self._listener.onContactRefused = function (username) {
    self._eventEmitter.emit('onContactRefused', username);
  };
}

/**
 * callback function called when contact added.
 * @param {EMContactListener~onContactAddedCallback} callback 回调函数
 * @return {void}
 */
EMContactListener.prototype.onContactAdded = function (callback) {
  this._eventEmitter.on('onContactAdded', callback);
};

/**
 * @function EMContactListener~onContactAddedCallback
 * @param {String} username 用户ID
 * @return {void}
 */

/**
 * called when contact deleted.
 * @param {EMContactListener~onContactDeletedCallback} callback 回调函数
 * @return {void}
 */
EMContactListener.prototype.onContactDeleted = function (callback) {
  this._eventEmitter.on('onContactDeleted', callback);
};

/**
 * @function EMContactListener~onContactDeletedCallback
 * @param {String} username 好友ID
 * @return {void}
 */

/**
 * called when user be invited by contact to be friend.
 * @param {EMContactListener~onContactInvitedCallback} callback 回调函数
 * @return {void}
 */
EMContactListener.prototype.onContactInvited = function (callback) {
  this._eventEmitter.on('onContactInvited', callback);
};

/**
 * @function EMContactListener~onContactInvitedCallback
 * @param {String} username 好友ID
 * @param {String} reason 添加原因
 * @return {void}
 */

/**
 * called when user invite contact to be friend, and contact has accepted the invitation.
 * @param {EMContactListener~onContactAgreedCallback} callback 回调函数
 * @return {void}
 */
EMContactListener.prototype.onContactAgreed = function (callback) {
  this._eventEmitter.on('onContactAgreed', callback);
};

/**
 * @function EMContactListener~onContactAgreedCallback
 * @param {String} username 好友ID
 * @return {void}
 */

/**
 * called when user invite contact to be friend, and contact has declined the invitation.
 * @param {EMContactListener~onContactRefusedCallback} callback 回调函数
 * @return {void}
 */
EMContactListener.prototype.onContactRefused = function (callback) {
  this._eventEmitter.on('onContactRefused', callback);
};

/**
 * @function EMContactListener~onContactRefusedCallback
 * @param {String} username 用户ID
 * @return {void}
 */

module.exports = EMContactListener;