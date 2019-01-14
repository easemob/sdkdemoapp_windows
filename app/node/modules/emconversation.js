'use strict';

const EMMessage = require('./message/emmessage');

/**
 * Easemob EMConversation implementation.
 */

/**
 * EMConversationType
 * {
 * CHAT = 0,
 * GROUPCHAT = 1,
 * CHATROOM = 2,
 * }
 * EMMessageSearchDirection
 * {
 * UP = 0
 * DOWN = 1
 * }
 */

function EMConversation(conversation) {
  this._conversation = conversation;
}

/**
 * Get conversation id.
 * Note: For a single chat conversation, it's remote peer's user name, for a group chat conversation, it's group id.
 * @return {String}
 */
EMConversation.prototype.conversationId = function () {
  return this._conversation.conversationId();
};

/**
 * Get conversation type.
 * @return {String}
 */
EMConversation.prototype.conversationType = function () {
  return this._conversation.conversationType();
};

/**
 * Remove a message from DB and cache.
 * Note: It's user's responsibility to confirm removed message belongs to the conversation.
 * Better to use message to remove message instead of message id.
 * @param {EMMessage or String} message EMMessage is the message to remove, String is message Id. 
 * @return {Bool}
 */
EMConversation.prototype.removeMessage = function (message) {
  if (typeof(message) == "string") {
    return this._conversation.removeMessage(message);
  } else {
    return this._conversation.removeMessage(message._message);
  }
};

/**
 * Insert a message to DB.
 * Note: It's user's responsibility to confirm inserted message belongs to the conversation.
 * @param {EMMessage} message
 * @return {Bool}
 */
EMConversation.prototype.insertMessage = function (message) {
  return this._conversation.insertMessage(message._message);
};

/**
 * Append a message to the last of conversation.
 * Note: It's user's responsibility to confirm inserted message belongs to the conversation.
 * @param {EMMessage} message
 * @return {Bool}
 */
EMConversation.prototype.appendMessage = function (message) {
  return this._conversation.appendMessage(message._message);
};

/**
 * Append a message to the last of conversation.
 * It's user's responsibility to confirm updated message belongs to the conversation, and user
 * should NOT change a message's id.
 * @param {EMMessage} message
 * @return {Bool}
 */
EMConversation.prototype.updateMessage = function (message) {
  return this._conversation.updateMessage(message._message);
};

/**
 * Clear all messages belong to the the conversation(include DB and memory cache).
 * @return {Bool}
 */
EMConversation.prototype.clearAllMessages = function () {
  return this._conversation.clearAllMessages();
};

/**
 * Change message's read status.
 * Note: It's user's responsibility to confirm changed message belongs to the conversation.
 * @param {String} msgId
 * @param {Bool} isRead the second param is optional.
 * @return {Bool}
 */
EMConversation.prototype.markMessageAsRead = function (msgId, isRead) {
  return this._conversation.markMessageAsRead(msgId, isRead);
};

/**
 * Change all messages's read status.
 * @param {Bool} isRead
 * @return {Bool}
 */
EMConversation.prototype.markAllMessagesAsRead = function (isRead) {
  return this._conversation.markAllMessagesAsRead(isRead);
};

/**
 * Get unread messages count of conversation.
 * @param {Bool} isRead
 * @return {Bool}
 */
EMConversation.prototype.unreadMessagesCount = function () {
  return this._conversation.unreadMessagesCount();
};

/**
 * Get the total messages count of conversation.
 * @return {Number}
 */
EMConversation.prototype.messagesCount = function () {
  return this._conversation.messagesCount();
};

/**
 * Load a message(Will load message from DB if not exist in cache).
 * @param {String} msgId.
 * @return {EMMessage}
 */
EMConversation.prototype.loadMessage = function (msgId) {
  return new EMMessage(this._conversation.loadMessage(msgId));
};

/**
 * Get latest message of conversation.
 * @return {EMMessage}
 */
EMConversation.prototype.latestMessage = function () {
  return new EMMessage(this._conversation.latestMessage());
};

/**
 * Get received latest message of conversation.
 * @return {EMMessage}
 */
EMConversation.prototype.latestMessageFromOthers = function () {
  return new EMMessage(this._conversation.latestMessageFromOthers());
};

function createEMMessageList(array) {
  var messageList = new Array(array.length);
  for (var i = 0; i < array.length; i++) {
    messageList[i] = new EMMessage(array[i]);
  }
  return messageList;
}

/**
 * Load specified number of messages from DB.
 * Note: The return result will NOT include the reference message, 
 * and load message from the latest message if reference message id is empty.
 * The result will be sorted by ASC.
 * The trailing position resident last arrived message;

 * @param {String} refMsgId
 * @param {Number} count
 * @param {Number} direction optional
 * @return {Array} EMMessage array list.
 */
EMConversation.prototype.loadMoreMessagesByMsgId = function (refMsgId, count, direction) {
  return createEMMessageList(this._conversation.loadMoreMessages(0, refMsgId, count, direction));
};

/**
 * Load specified number of messages before the timestamp from DB.
 * Note: The result will be sorted by ASC.
 * @param {Number} timeStamp The reference timestamp
 * @param {Number} count Message count to load
 * @param {Number} direction optional. Message search direction
 * @return {Array} EMMessage array list.
 */
EMConversation.prototype.loadMoreMessagesByTime = function (timeStamp, count, direction) {
  return createEMMessageList(this._conversation.loadMoreMessages(1, timeStamp, count, direction));
};

/**
 * Load specified number of messages before the timestamp and with the specified type from DB.
 * Note: The result will be sorted by ASC.
 * @param {Number} type Message type to load.
 * @param {Number} timeStamp optional. The reference timestamp, milliseconds, will reference current time if timestamp is negative. default is -1.
 * @param {Number} count optional. Message count to load, will load all messages meeet the conditions if count is negative. default is -1.
 * @param {String} from optional. Message sender, will ignore it if it's empty. default is empty.
 * @param {Number} direction optional. Message search direction. default is UP(0).
 * @return {Array} EMMessage array list.
 */
EMConversation.prototype.loadMoreMessagesByType = function (type, timeStamp, count, from, direction) {
  return createEMMessageList(this._conversation.loadMessage(2, type, timeStamp, count, from, direction));
};

/**
 * Load specified number of messages before the timestamp and contains the specified keywords from DB.
 * Note: The result will be sorted by ASC.
 * @param {String} keywords Message contains keywords, will ignore it if it's empty.
 * @param {Number} timeStamp the reference timestamp, milliseconds, will reference current time if timestamp is negative. default is -1.
 * @param {Number} count Message count to load, will load all messages meeet the conditions if count is negative. default is -1.
 * @param {String} from Message sender, will ignore it if it's empty, default is empty.
 * @param {Number} direction Message search direction, default is UP(0).
 * @return {Array} EMMessage array list.
 */
EMConversation.prototype.loadMoreMessagesByKeyWords = function (keywords, timeStamp, count, from, direction) {
  return createEMMessageList(this._conversation.loadMoreMessages(3, keywords, timeStamp, count, from, direction));
};

/**
 * Load messages from DB.
 * Note: To avoid occupy too much memory, user should limit the max messages count to load.
 * The result will be sorted by ASC.
 * The trailing position resident last arrived message;
 * @param {Number} startTimeStamp
 * @param {Number} endTimeStamp
 * @param {Number} maxCount
 * @return {Array} EMMessage array list.
 */
EMConversation.prototype.loadMoreMessagesBetweenTime = function(startTimeStamp, endTimeStamp, maxCount) {
  return createEMMessageList(this._conversation.loadMoreMessages(4, startTimeStamp, endTimeStamp, maxCount));
};

/**
 * Get conversation extend attribute.
 * @return {String}
 */
EMConversation.prototype.extField = function () {
  return this._conversation.extField();
};

/**
 * Set conversation extend attribute.
 * @param {String} ext
 */
EMConversation.prototype.setExtField = function (ext) {
  return this._conversation.setExtField(ext);
};

/**
 * Get conversation last sync roam key. if don't have, return empty string.
 * @return {String}
 */
EMConversation.prototype.lastSyncedMsgId = function () {
  return this._conversation.lastSyncedMsgId();
};

module.exports = EMConversation;