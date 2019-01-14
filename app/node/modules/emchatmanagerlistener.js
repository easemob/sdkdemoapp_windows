'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');
const EMError = require('./emerror');
const EMMessage = require('./message/emmessage');
const EMConversation = require('./emconversation');

//EMChatManagerListener object callback interface number.
const emChatManagerListenerCount = 8;

/**
 * Easemob EMChatManagerListener implementation.
 */

function createEMMessageList(array) {
  var messageList = new Array(array.length);
  for (var i = 0; i < array.length; i++) {
    messageList[i] = new EMMessage(array[i]);
  }
  return messageList;
}

function createEMConversationList(array) {
  var conversationList = new Array(array.length);
  for (var i = 0; i < array.length; i++) {
    conversationList[i] = new EMConversation(array[i]);
  }
  return conversationList;
}

function EMChatManagerListener() {
  var self = this;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(emChatManagerListenerCount);
  self._listener = new easemobNode.EMChatManagerListener();
  self._listener.onReceiveMessages = function(messages) {
    self._eventEmitter.emit('onReceiveMessages', createEMMessageList(messages));
  };
  self._listener.onReceiveCmdMessages = function(messages) {
    self._eventEmitter.emit('onReceiveCmdMessages', createEMMessageList(messages));
  };
  self._listener.onMessageStatusChanged = function(message, error) {
    self._eventEmitter.emit('onMessageStatusChanged', new EMMessage(message), new EMError(error));
  };
  self._listener.onMessageAttachmentsStatusChanged = function (message, error) {
    self._eventEmitter.emit('onMessageAttachmentsStatusChanged', new EMMessage(message), new EMError(error));
  };
  self._listener.onReceiveHasReadAcks = function (messages) {
    self._eventEmitter.emit('onReceiveHasReadAcks', createEMMessageList(messages));
  };
  self._listener.onReceiveHasDeliveredAcks = function (messages) {
    self._eventEmitter.emit('onReceiveHasDeliveredAcks', createEMMessageList(messages));
  };
  self._listener.onReceiveRecallMessages = function (messages) {
    self._eventEmitter.emit('onReceiveRecallMessages', createEMMessageList(messages));
  };
  self._listener.onUpdateConversationList = function (conversations) {
    self._eventEmitter.emit('onUpdateConversationList', createEMConversationList(conversations));
  };
}

/**
 * Callback user when receive a list of messages from remote peer.
 * callback function type:
 * function callback(messages) {
 *  //@param {Array} messages EMMessage array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveMessages = function(callback) {
  this._eventEmitter.on('onReceiveMessages', callback);
};

/**
 * Callback user when receive a list of command messages from remote peer.
 * callback function type:
 * function callback(messages) {
 *  //@param {Array} messages EMMessage array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveCmdMessages = function(callback) {
  this._eventEmitter.on('onReceiveCmdMessages', callback);
};

/**
 * Callback user when send message successed or failed.
 * callback function type:
 * function callback(message, error) {
 *  //@param {EMMessage} message
 *  //@param {EMError} error
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onMessageStatusChanged = function(callback) {
  this._eventEmitter.on('onMessageStatusChanged', callback);
};

/**
 * Callback user when attachment download status changed.
 * callback function type:
 * function callback(message, error) {
 *  //@param {EMMessage} message
 *  //@param {EMError} error
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onMessageAttachmentsStatusChanged = function(callback) {
  this._eventEmitter.on('onMessageAttachmentsStatusChanged', callback);
};

/**
 * Callback user when receive read ack for messages.
 * callback function type:
 * function callback (messages) {
 *  //@param {Array} messages EMMessage array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveHasReadAcks = function(callback) {
  this._eventEmitter.on('onReceiveHasReadAcks', callback);
};

/**
 * Callback user when receive delivery successed ack for messages.
 * callback function type:
 * function callback (messages) {
 *  //@param {Array} messages EMMessage array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveHasDeliveredAcks = function(callback) {
  this._eventEmitter.on('onReceiveHasDeliveredAcks', callback);
};

/**
 * Callback user when receive recall for messages.
 * callback function type:
 * function callback (messages) {
 *  //@param {Array} messages EMMessage array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveRecallMessages = function(callback) {
  this._eventEmitter.on('onReceiveRecallMessages', callback);
};

/**
 * Callback user when conversation list are changed.
 * callback function type:
 * function callback (conversations) {
 *  // @param {Array} conversations EMConversation array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMChatManagerListener.prototype.onUpdateConversationList = function(callback) {
  this._eventEmitter.on('onUpdateConversationList', callback);
};

module.exports = EMChatManagerListener;