'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');

//EMConferenceListener object callback interface number.
const emConferenceListenerCount = 3;

/**
 * Easemob EMConferenceListener implementation.
 */

/**
 * EMConferenceListener constructor.
 * @constructor
 */
function EMConferenceListener() {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(emConferenceListenerCount);
  self._listener = new easemobNode.EMCallConferenceListener();
  self._listener.onReceiveInvite = function (confId,password,ext) {
    self._eventEmitter.emit('onReceiveInvite',  confId,password,ext);
  };
}

/**
 * Callback user when user receive a video/audio call inviting from a conference.
 * @param {EMConferenceListener~onReceiveInviteCallback} callback 回调函数
 * @return {void}
 */
EMConferenceListener.prototype.onReceiveInvite = function (callback) {
  this._eventEmitter.on('onReceiveInvite', callback);
};

/**
 * @function EMConferenceListener~onReceiveInviteCallback
 * @param {String} confId 邀请的会议ID
 * @param {String} password 会议密码
 * @param {String} ext 会议扩展信息
 * @return {void}
 */

module.exports = EMConferenceListener;