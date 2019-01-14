'use strict';

const EMError = require('./emerror');
const EMMessage = require('./message/emmessage');
const EMConversation = require('./emconversation');
const EMCursorResult = require('./emcursorresult').EMCursorResult;

/**
 * Easemob EMChatManager implementation.
 */

function EMChatManager(chatManager) {
  this._manager = chatManager;
}

/**
 * Send a message.
 * @param {EMMessage} message
 * @return {void}
 */
EMChatManager.prototype.sendMessage = function (message) {
  this._manager.sendMessage(message._message);
};

/**
 * Send read ask for a message.
 * @param {EMMessage} message
 * @return {void}
 */
EMChatManager.prototype.sendReadAckForMessage = function (message) {
  this._manager.sendReadAckForMessage(message._message);
};

/**
 * Recall a message.
 * @param {EMMessage} message
 * @param {EMError} error
 * @return {void}
 */
EMChatManager.prototype.recallMessage = function (message, error) {
  this._manager.recallMessage(message._message, error._error);
};

/**
 * Resend a message.
 * @param {EMMessage} message
 * @return {void}
 */
EMChatManager.prototype.resendMessage = function (message) {
  this._manager.resendMessage(message._message);
};

/**
 * Download thumbnail for image or video message
 * Note: Image and video message thumbnail will be downloaded automatically. ONLY call this method if automatic download failed.
 * SDK will callback the user by EMChatManagerListener if user doesn't provide a callback in the message or callback return false.
 * @param {EMMessage} message
 * @return {void}
 */
EMChatManager.prototype.downloadMessageThumbnail = function (message) {
  this._manager.downloadMessageThumbnail(message._message);
};

/**
 * Download attachment of a message.
 * Note: User should call this method to download file, voice, image, video.
 * SDK will callback the user by EMChatManagerListener if user doesn't provide a callback or callback return false.
 * @param {EMMessage} message
 * @return {void}
 */
EMChatManager.prototype.downloadMessageAttachments = function (message) {
  this._manager.downloadMessageAttachments(message._message);
};

/**
 * Remove a conversation from cache and local database.
 * Note: Before removing a conversation, all conversations must be loaded from local database first
 * @param {EMMessage} message
 * @return {void}
 */
EMChatManager.prototype.removeConversation = function (conversationId, isRemoveMessages) {
  this._manager.removeConversation(conversationId, isRemoveMessages);
};

/**
 * Remove a conversation from cache and local database.
 * Note: Before removing a conversation, all conversations must be loaded from local database first
 * @param {array} list EMConversation array.
 * @return {void}
 */
EMChatManager.prototype.removeConversations = function (list, isRemoveMessages) {
  var conversations = new Array(list.length);
  for (var i = 0; i < list.length; i++) {
    conversations[i] = list[i]._conversation;
  }
  this._manager.removeConversations(conversations, isRemoveMessages);
};

/**
 * Get a conversation
 * Note: All conversations will be loaded from local database.
 * @param {String} conversationId
 * @param {Number} type
 * @param {Bool} createIfNotExist
 * @return {void}
 */
EMChatManager.prototype.conversationWithType = function (conversationId, type, createIfNotExist) {
  return new EMConversation(this._manager.conversationWithType(conversationId, type, createIfNotExist));
};

/**
 * Get all conversations from cache or local database if not in cache.
 * @return {Array} EMConversation list.
 */
EMChatManager.prototype.getConversations = function () {
  var conversations = this._manager.getConversations();
  var list = new Array(conversations.length);
  for (var i = 0; i < conversations.length; i++) {
    list[i] = new EMConversation(conversations[i]);
  }
  return list;
};

/**
 * Get all conversations from local database.
 * @return {Array}
 */
EMChatManager.prototype.loadAllConversationsFromDB = function () {
  var conversations = this._manager.loadAllConversationsFromDB();
  var list = new Array(conversations.length);
  for (var i = 0; i < conversations.length; i++) {
    list[i] = new EMConversation(conversations[i]);
  }
  return list;
};

/**
 * Add chat manager listener
 * @param {EMChatManagerListener} listener
 * @return {void}
 */
EMChatManager.prototype.addListener = function (listener) {
  this._manager.addListener(listener._listener);
};

/**
 * Remove chat manager listener
 * @param {EMChatManagerListener} listener
 * @return {void}
 */
EMChatManager.prototype.removeListener = function (listener) {
  this._manager.removeListener(listener._listener);
};

/**
 * Remove all the chat manager listeners
 * @return {void}
 */
EMChatManager.prototype.clearListeners = function () {
  this._manager.clearListeners();
};

/**
 * Insert messages
 * @param {array} list message list
 * @return {Bool}
 */
EMChatManager.prototype.insertMessages = function (list) {
  var messages = new Array(list.length);
  for (var i = 0; i < list.length; i++) {
    messages[i] = list[i]._message;
  }
  return this._manager.insertMessages(messages);
};

/**
 * fetch conversation roam messages from server.
 * @param {String} conversationId
 * @param {Number} type
 * @param {Error} error
 * @param {Number} pageSize
 * @param {String} startMsgId
 * @return {EMCursorResult} cursor store the roam messages from the server.
 */
EMChatManager.prototype.fetchHistoryMessages = function (conversationId, type, error, pageSize, startMsgId) {
  return new EMCursorResult(this._manager.fetchHistoryMessages(conversationId, type, error._error, pageSize, startMsgId), 2);
};

/**
 * Get message by message Id.
 * @param {String} messageId
 * @return {EMMessage}
 */
EMChatManager.prototype.getMessage = function (messageId) {
  return new EMMessage(this._manager.getMessage(messageId));
};

/**
 * update database participant related records, include message table, conversation table, contact table, blacklist table
 * @param {String} from
 * @param {String} changeTo
 * @return {bool}
 */
EMChatManager.prototype.updateParticipant = function (from, changeTo) {
  return this._manager.updateParticipant(from, changeTo);
};

/**
 * Upload log to server.
 * @return {void}
 */
EMChatManager.prototype.uploadLog = function () {
  this._manager.uploadLog();
};

module.exports = EMChatManager;