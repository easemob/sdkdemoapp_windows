'use strict';

const EMTextMessageBody = require('./emtextmessagebody');
const EMImageMessageBody = require('./emimagemessagebody').EMImageMessageBody;
const EMVideoMessageBody = require('./emvideomessagebody').EMVideoMessageBody;
const EMLocationMessageBody = require('./emlocationmessagebody');
const EMVoiceMessageBody = require('./emvoicemessagebody');
const EMFileMessageBody = require('./emfilemessagebody');
const EMCmdMessageBody = require('./emcmdmessagebody');

/**
 * Easemob EMMessage implementation.
 */

/**chat type.
 * {
 * SINGLE = 0,    // One-to-one chat
 * GROUP = 1,     // Group chat
 * CHATROOM = 2   // Chatroom chat
 * }
 * Message status.
 * {
 * NEW = 0,            // New message
 * DELIVERING = 1,     // Message is delivering
 * SUCCESS = 2,        // Message is delivered successfully
 * FAIL = 3            // Message delivering failed
 * }
 * message direction.
 * {
 * SEND = 0,
 * RECEIVE = 1
 * }
 * message body type.
 * {
 * TEXT = 0,        // Text message body
 * IMAGE = 1,       // Image message body
 * VIDEO = 2,       // Video message body
 * LOCATION = 3,    // Location message body
 * VOICE = 4,       // Voice message body
 * FILE = 5,        // File message body
 * COMMAND = 6      // Command message body
 * }
 */
/**
 * EMMessage constructor.
 * @constructor
 * @param {Object} message
 */
function EMMessage(message) {
  this._message = message;
  this._callback = null;
}

/**
 * Get message id.
 * @return {String}
 */
EMMessage.prototype.msgId = function () {
  return this._message.msgId();
};

/**
 * Set message id.
 * Note: User should never change a message's id if you don't want to save as a new message.
 * @param {String} msgId
 * @return {void}
 */
EMMessage.prototype.setMsgId = function (msgId) {
  this._message.setMsgId(msgId);
};

/**
 * Get message sender.
 * @return {String}
 */
EMMessage.prototype.from = function () {
  return this._message.from();
};

/**
 * Set message sender.
 * @param {String} from
 * @return {void}
 */
EMMessage.prototype.setFrom = function (from) {
  this._message.setFrom(from);
};

/**
 * Get message receiver.
 * @return {String}
 */
EMMessage.prototype.to = function () {
  return this._message.to();
};

/**
 * Set message receiver.
 * @param {String} to
 * @return {void}
 */
EMMessage.prototype.setTo = function (to) {
  this._message.setTo(to);
};

/**
 * Get conversation id.
 * @return {String}
 */
EMMessage.prototype.conversationId = function () {
  return this._message.conversationId();
};

/**
 * Set message's conversation id.
 * Note: User should NOT change message's conversation id after received or sent a message.
 * @param {String} conversationId
 * @return {void}
 */
EMMessage.prototype.setConversationId = function (conversationId) {
  this._message.setConversationId(conversationId);
};

/**
 * Get message status.
 * @return {Number}
 */
EMMessage.prototype.status = function () {
  return this._message.status();
};

/**
 * Set message's status.
 * Note: User should NOT change message's status directly.
 * Message status.
 * {
 * NEW = 0,            // New message
 * DELIVERING = 1,     // Message is delivering
 * SUCCESS = 2,        // Message is delivered successfully
 * FAIL = 3            // Message delivering failed
 * }
 * @param {Number} status
 * @return {void}
 */
EMMessage.prototype.setStatus = function (status) {
  this._message.setStatus(status);
};

/**
 * Get message chat type.
 * @return {Number}
 */
EMMessage.prototype.chatType = function () {
  return this._message.chatType();
};

/**
 * Set message's chat type.
 * Note: User should NOT change message's chat type after receive or send a message.
 * {
 * SINGLE = 0,    // One-to-one chat
 * GROUP = 1,     // Group chat
 * CHATROOM = 2   // Chatroom chat
 * }
 * @param {Number} status
 * @return {void}
 */
EMMessage.prototype.setChatType = function (chatType) {
  this._message.setChatType(chatType);
};

/**
 * Get message direction.
 * @return {Number}
 */
EMMessage.prototype.msgDirection = function () {
  return this._message.msgDirection();
};

/**
 * Set message's direction.
 * Note: User should NOT change message's message direction after received or sent a message.
 * message direction.
 * {
 * SEND = 0,
 * RECEIVE = 1
 * }
 * @param {Number} status
 * @return {void}
 */
EMMessage.prototype.setMsgDirection = function (msgDirection) {
  this._message.setMsgDirection(msgDirection);
};

/**
 * Get if message is read status.
 * @return {Bool}
 */
EMMessage.prototype.isRead = function () {
  return this._message.isRead();
};

/**
 * Set if message is read status.
 * Note: User should NOT change message's read status directly.
 * @param {Bool} isRead
 * @return {void}
 */
EMMessage.prototype.setIsRead = function (isRead) {
  this._message.setIsRead(isRead);
};

/**
 * Get message if has listened status.
 * @return {Bool}
 */
EMMessage.prototype.isListened = function () {
  return this._message.isListened();
};

/**
 * Set message's listened status.
 * Note: User should NOT change message's listened status directly.
 * @param {Bool} isRead
 * @return {void}
 */
EMMessage.prototype.setIsListened = function (isListened) {
  this._message.setIsListened(isListened);
};

/**
 * Get message read ack status.
 * Note: For receiver, it indicates whether has sent read ack, and for sender, it indicates whether has received read ack.
 * @return {Bool}
 */
EMMessage.prototype.isReadAcked = function () {
  return this._message.isReadAcked();
};

/**
 * Set message's read ack status.
 * Note: User should NOT change message's read ack status directly.
 * @param {Bool} isRead
 * @return {void}
 */
EMMessage.prototype.setIsReadAcked = function (isReadAcked) {
  this._message.setIsReadAcked(isReadAcked);
};

/**
 * Get message delivering status.
 * Note: For receiver, it indicates whether has sent delivering succeed ack; and for sender, it indicates whether has received delivering succeed ack.
 * @return {Bool}
 */
EMMessage.prototype.isDeliverAcked = function () {
  return this._message.isDeliverAcked();
};

/**
 * Set message's delivery ack status.
 * Note: User should NOT change message's delivery ack status directly.
 * @param {Bool} isRead
 * @return {void}
 */
EMMessage.prototype.setIsDeliverAcked = function (isDeliverAcked) {
  this._message.setIsDeliverAcked(isDeliverAcked);
};

/**
 * Get message timestamp(server time).
 * @return {Number}
 */
EMMessage.prototype.timestamp = function () {
  return this._message.timestamp();
};

/**
 * Set message's timestamp.
 * Note: User should NOT change message's timestamp.
 * @param {Number} timestamp
 * @return {void}
 */
EMMessage.prototype.setTimestamp = function (timestamp) {
  this._message.setTimestamp(timestamp);
};

/**
 * Get message's local time.
 * @return {Number}
 */
EMMessage.prototype.localTime = function () {
  return this._message.localTime();
};

/**
 * Set message's local time.
 * Note: User should NOT change message's server time.
 * @param {Number} timestamp
 * @return {void}
 */
EMMessage.prototype.setLocalTime = function (localTime) {
  this._message.setLocalTime(localTime);
};

/**
 * Get message body list.
 * @return {Array} message bodies list.
 */
EMMessage.prototype.bodies = function () {
  var bodies = this._message.bodies();
  var messageBodys = new Array(bodies.length);
  for (var i = 0; i < bodies.length; i++) {
    switch (bodies[i].type()) {
      case 0:   // TEXT
        messageBodys[i] = new EMTextMessageBody(bodies[i]);
        break;
      case 1:   // IMAGE
        messageBodys[i] = new EMImageMessageBody(bodies[i]);
        break;
      case 2:   // VIDEO
        messageBodys[i] = new EMVideoMessageBody(bodies[i]);
        break;
      case 3:   // LOCATION
        messageBodys[i] = new EMLocationMessageBody(bodies[i]);
        break;
      case 4:   // VOICE
        messageBodys[i] = new EMVoiceMessageBody(bodies[i]);
        break;
      case 5:   // FILE
        messageBodys[i] = new EMFileMessageBody(bodies[i]);
        break;
      case 6:   //COMMAND
        messageBodys[i] = new EMCmdMessageBody(bodies[i]);
        break;
      default:
    }
  }
  return messageBodys;
};

/**
 * Clear all bodies.
 * @return {void}
 */
EMMessage.prototype.clearBodies = function () {
  this._message.clearBodies();
};

/**
 * Add a body to message.
 * @return {void}
 */
EMMessage.prototype.addBody = function (body) {
  this._message.addBody(body._body);
};

/**
 * Add a extend attribute to message.
 * Note: Supported types: Bool Number and String.
 * @param {String} attribute
 * @param {Bool | Number | String} value
 * @return {void}
 */
EMMessage.prototype.setAttribute = function (attribute, value) {
  this._message.setAttribute(attribute, value);
};

/**
 * Get extend attribute of message.
 * Note: Supported types: Bool Number and String.
 * @param {String} attribute
 * @return {Bool | Number | String}
 */
EMMessage.prototype.getAttribute = function (attribute) {
  return this._message.getAttribute(attribute);
};

/**
 * Add a extend json object attribute to message.
 * @param {String} attribute
 * @param {Object} object
 * @return {void}
 */
EMMessage.prototype.setJsonAttribute = function (attribute, object) {
  this._message.setJsonAttribute(attribute, JSON.stringify(object));
};

/**
 * Get extend attribute of json object.
 * @param {String} attribute
 * @return {Object}
 */
EMMessage.prototype.getJsonAttribute = function (attribute) {
  return JSON.parse(this._message.getJsonAttribute(attribute));
};

/**
 * Remove a attribute from message by key. 
 * @param {String} attribute
 * @return {void}
 */
EMMessage.prototype.removeAttribute = function (attribute) {
  this._message.removeAttribute(attribute);
};

/**
 * Remove all attributes from message.
 * @return {void}
 */
EMMessage.prototype.clearAttributes = function () {
  this._message.clearAttributes();
};

/**
 * Get all attributes from message.
 * @return {Array} array contains obj, obj like { "attr" : "1", "value" : "1" }
 */
EMMessage.prototype.ext = function () {
  return this._message.ext();
};

/**
 * Get message's callback to notify status change.
 * @return {EMCallback}
 */
EMMessage.prototype.callback = function () {
  return this._callback;
};

/**
 * Set message's callback to notify status change.
 * @param {EMCallback} callback
 * @return {void}
 */
EMMessage.prototype.setCallback = function (callback) {
  this._callback = callback;
  this._message.setCallback(callback._callback);
};

/**
 * Set progress.
 * @param {Number} percent
 * @return {void}
 */
EMMessage.prototype.setProgress = function (percent) {
  this._message.setProgress(percent);
};

/**
 * Get progress
 * @return {Number}
 */
EMMessage.prototype.getProgress = function () {
  return this._message.getProgress();
};

module.exports = EMMessage;