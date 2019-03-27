'use strict';

const EMError = require('./emerror');
const EMMessage = require('./message/emmessage');
const EMConversation = require('./emconversation');
const EMCursorResult = require('./emcursorresult').EMCursorResult;
const async = require('async');

/**
 * Easemob EMChatManager implementation.
 */

/**
 * EMChatManager constructor.
 * @constructor
 * @param {Object} chatManager
 */
function EMChatManager(chatManager) {
  this._manager = chatManager;
}

/**
 * Send a message.
 * @param {EMMessage} message 发送的消息
 * @return {void}
 */
EMChatManager.prototype.sendMessage = function (message) {
  this._manager.sendMessage(message._message);
};

/**
 * Send read ask for a message.
 * @param {EMMessage} message 发送消息的已读ack
 * @return {void}
 */
EMChatManager.prototype.sendReadAckForMessage = function (message) {
  this._manager.sendReadAckForMessage(message._message);
};

/**
 * Recall a message.
 * @param {EMMessage} message 要撤回的消息
 * @return {void}
 */
EMChatManager.prototype.recallMessage = function (message) {
  let error = new EMError();
  this._manager.recallMessage(message._message, error._error);
};

/**
 * Resend a message.
 * @param {EMMessage} message 要重发的消息
 * @return {void}
 */
EMChatManager.prototype.resendMessage = function (message) {
  this._manager.resendMessage(message._message);
};

/**
 * Download thumbnail for image or video message
 * Note: Image and video message thumbnail will be downloaded automatically. ONLY call this method if automatic download failed.
 * SDK will callback the user by EMChatManagerListener if user doesn't provide a callback in the message or callback return false.
 * @param {EMMessage} message 要下载缩略的消息
 * @return {void}
 */
EMChatManager.prototype.downloadMessageThumbnail = function (message) {
  this._manager.downloadMessageThumbnail(message._message);
};

/**
 * Download attachment of a message.
 * Note: User should call this method to download file, voice, image, video.
 * SDK will callback the user by EMChatManagerListener if user doesn't provide a callback or callback return false.
 * @param {EMMessage} message 要下载附件的消息
 * @return {void}
 */
EMChatManager.prototype.downloadMessageAttachments = function (message) {
  this._manager.downloadMessageAttachments(message._message);
};

/**
 * Remove a conversation from cache and local database.
 * Note: Before removing a conversation, all conversations must be loaded from local database first
 * @param {String} conversationId 要删除的会话ID
 * @param {Bool} isRemoveMessages 删除会话时，是否移除消息
 * @return {void}
 */
EMChatManager.prototype.removeConversation = function (conversationId, isRemoveMessages) {
  this._manager.removeConversation(conversationId, isRemoveMessages);
};

/**
 * Remove a conversation from cache and local database.
 * Note: Before removing a conversation, all conversations must be loaded from local database first
 * @param {array} list 要删除的会话数组
 * @param {Bool} isRemoveMessages 删除会话时，是否移除消息
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
 * @param {String} conversationId 会话ID
 * @param {Number} type 会话类型，0为单聊，1为群组
 * @param {Bool} createIfNotExist 如果会话不存在，是否临时创建
 * @return {void}
 */
EMChatManager.prototype.conversationWithType = function (conversationId, type, createIfNotExist) {
  return new EMConversation(this._manager.conversationWithType(conversationId, type, createIfNotExist));
};

/**
 * Get all conversations from cache or local database if not in cache.
 * @return {Array} 会话对象列表
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
 * @return {Array} 会话对象列表
 */
EMChatManager.prototype.loadAllConversationsFromDB = function () {
  var _manager = this._manager;
  async function f(){
    try{
      var conversations = _manager.loadAllConversationsFromDB();
      var list = new Array(conversations.length);
      for (var i = 0; i < conversations.length; i++) {
        list[i] = new EMConversation(conversations[i]);
      }
      return list;
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Add chat manager listener
 * @param {EMChatManagerListener} listener 添加会话的回调监听对象
 * @return {void}
 */
EMChatManager.prototype.addListener = function (listener) {
  this._manager.addListener(listener._listener);
};

/**
 * Remove chat manager listener
 * @param {EMChatManagerListener} listener 移除会话的回调监听对象
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
 * @param {array} list message list 插入消息到本地，消息列表
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
 * @param {String} conversationId 会话ID
 * @param {Number} type 会话类型，0为单聊，1为群组
 * @param {Number} pageSize 分页
 * @param {String} startMsgId 开始的消息ID
 * @return {Object} {code,description,data},code为结果，0为成功，其他失败，description为失败原因，data为消息列表
 */
EMChatManager.prototype.fetchHistoryMessages = function (conversationId, type, pageSize, startMsgId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let cursorresult = new EMCursorResult(_manager.fetchHistoryMessages(conversationId, type, error._error, pageSize, startMsgId), 2);
      return {
        code:error.errorCode,
        description:error.description,
        data:cursorresult.result()
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
  return 
};

/**
 * Get message by message Id.
 * @param {String} messageId 消息ID
 * @return {EMMessage} 消息
 */
EMChatManager.prototype.getMessage = function (messageId) {
  return new EMMessage(this._manager.getMessage(messageId));
};

/**
 * update database participant related records, include message table, conversation table, contact table, blacklist table
 * @param {String} from 修改前的会话ID
 * @param {String} changeTo 修改后的会话ID
 * @return {bool}
 */
EMChatManager.prototype.updateParticipant = function (from, changeTo) {
  return this._manager.updateParticipant(from, changeTo);
};

/**
 * Upload log to server.上传日志到服务器
 * @return {void} 
 */
EMChatManager.prototype.uploadLog = function () {
  this._manager.uploadLog();
};

module.exports = EMChatManager;