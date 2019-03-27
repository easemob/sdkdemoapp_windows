'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');
const EMError = require('./emerror');
const EMMessage = require('./message/emmessage');
const EMConversation = require('./emconversation');

//EMChatManagerListener object callback interface number.
const emChatManagerListenerCount = 8;

/**
 * 创建消息列表
 * @param {Array} array 消息数组
 * @return {Array} 消息数组
 */

function createEMMessageList(array) {
  var messageList = new Array(array.length);
  for (var i = 0; i < array.length; i++) {
    messageList[i] = new EMMessage(array[i]);
  }
  return messageList;
}

/**
 * 创建会话列表
 * @param {Array} array 会话数组
 * @return {Array} 会话数组
 */
function createEMConversationList(array) {
  var conversationList = new Array(array.length);
  for (var i = 0; i < array.length; i++) {
    conversationList[i] = new EMConversation(array[i]);
  }
  return conversationList;
}

/**
 * EMChatManagerListener constructor.
 * @constructor
 */
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
 * @param {EMChatManagerListener~ReceiveMessages} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveMessages = function(callback) {
  this._eventEmitter.on('onReceiveMessages', callback);
};

/**
 * @function EMChatManagerListener~ReceiveMessages
 * @param {Array} messages EMMessage array.
 * @return {void}
 */

/**
 * Callback user when receive a list of command messages from remote peer.
 * @param {EMChatManagerListener~ReceiveMessages} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveCmdMessages = function(callback) {
  this._eventEmitter.on('onReceiveCmdMessages', callback);
};

/**
 * Callback user when send message successed or failed.
 * @param {EMChatManagerListener~ReceiveMessages} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onMessageStatusChanged = function(callback) {
  this._eventEmitter.on('onMessageStatusChanged', callback);
};

/**
 * Callback user when attachment download status changed.
 * @param {EMChatManagerListener~MessageAttachmentsStatusChanged} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onMessageAttachmentsStatusChanged = function(callback) {
  this._eventEmitter.on('onMessageAttachmentsStatusChanged', callback);
};

/**
 * @function EMChatManagerListener~MessageAttachmentsStatusChanged
 * @param {EMMessage} message EMMessage.
 * @param {EMError} error EMError
 * @return {void}
 */

/**
 * Callback user when receive read ack for messages.
 * @param {EMChatManagerListener~ReceiveMessages} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveHasReadAcks = function(callback) {
  this._eventEmitter.on('onReceiveHasReadAcks', callback);
};

/**
 * Callback user when receive delivery successed ack for messages.
 * @param {EMChatManagerListener~ReceiveMessages} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveHasDeliveredAcks = function(callback) {
  this._eventEmitter.on('onReceiveHasDeliveredAcks', callback);
};

/**
 * Callback user when receive recall for messages.
 * @param {EMChatManagerListener~ReceiveMessages} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onReceiveRecallMessages = function(callback) {
  this._eventEmitter.on('onReceiveRecallMessages', callback);
};

/**
 * Callback user when conversation list are changed.
 * @param {EMChatManagerListener~ConversationList} callback 回调函数
 * @return {void}
 */
EMChatManagerListener.prototype.onUpdateConversationList = function(callback) {
  this._eventEmitter.on('onUpdateConversationList', callback);
};

/**
 * @function EMChatManagerListener~ConversationList
 * @param {Array} conversations EMConversation array.
 * @return {void}
 */

module.exports = EMChatManagerListener;