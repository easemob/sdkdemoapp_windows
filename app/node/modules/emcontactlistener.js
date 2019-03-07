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
 * callback function type:
 * function callback(username) {
 *  //@param {String} username
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMContactListener.prototype.onContactAdded = function (callback) {
  this._eventEmitter.on('onContactAdded', callback);
};

/**
 * called when contact deleted.
 * callback function type:
 * function callback(username) {
 *  //@param {String} username
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMContactListener.prototype.onContactDeleted = function (callback) {
  this._eventEmitter.on('onContactDeleted', callback);
};

/**
 * called when user be invited by contact to be friend.
 * callback function type:
 * function callback(username, reason) {
 *  //@param {String} username
 *  //@param {String} reason
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMContactListener.prototype.onContactInvited = function (callback) {
  this._eventEmitter.on('onContactInvited', callback);
};

/**
 * called when user invite contact to be friend, and contact has accepted the invitation.
 * callback function type:
 * function callback(username) {
 *  //@param {String} username
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMContactListener.prototype.onContactAgreed = function (callback) {
  this._eventEmitter.on('onContactAgreed', callback);
};

/**
 * called when user invite contact to be friend, and contact has declined the invitation.
 * callback function type:
 * function callback(username) {
 *  //@param {String} username
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMContactListener.prototype.onContactRefused = function (callback) {
  this._eventEmitter.on('onContactRefused', callback);
};

module.exports = EMContactListener;