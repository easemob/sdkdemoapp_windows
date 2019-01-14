'use strict';

const EMMucSetting = require('./emmucsetting');

/**
 * Easemob EMChatroom implementation.
 */

function EMChatroom(chatroom) {
  this._chatroom = chatroom;
}

/**
 * Get chatroom's ID.
 * @return {String}
 */
EMChatroom.prototype.chatroomId = function () {
  return this._chatroom.chatroomId();
};

/**
 * Get chatroom's subject.
 * @return {String}
 */
EMChatroom.prototype.chatroomSubject = function () {
  return this._chatroom.chatroomSubject();
};

/**
 * Get chatroom's description.
 * @return {String}
 */
EMChatroom.prototype.chatroomDescription = function () {
  return this._chatroom.chatroomDescription();
};

/**
 * Get chatroom's owner.
 * @return {String}
 */
EMChatroom.prototype.owner = function () {
  return this._chatroom.owner();
};

/**
 * Get chatroom's setting.
 * @return {Number}
 */
EMChatroom.prototype.chatroomSetting = function () {
  return new EMMucSetting(this._chatroom.chatroomSetting());
};

/**
 * Get current members count.
 * @return {Number}
 */
EMChatroom.prototype.chatroomMemberCount = function () {
  return this._chatroom.chatroomMemberCount();
};

/**
 * Get max count of chatroom member.
 * @return {Number}
 */
EMChatroom.prototype.chatroomMemberMaxCount = function () {
  return this._chatroom.chatroomMemberMaxCount();
};

/**
 * Get chatroom's members.
 * Note: Will return empty array if have not ever got chatroom's members.
 * @return {Array} String list.
 */
EMChatroom.prototype.chatroomMembers = function () {
  return this._chatroom.chatroomMembers();
};

/**
 * Get chatroom's bans.
 * Note: Will return empty array if have not ever got chatroom's bans.
 * @return {Array} String list.
 */
EMChatroom.prototype.chatroomBans = function () {
  return this._chatroom.chatroomBans();
};

/**
 * Get chatroom's admins.
 * Note: Will return empty array if have not ever got chatroom's admins.
 * @return {Array} String list.
 */
EMChatroom.prototype.chatroomAdmins = function () {
  return this._chatroom.chatroomAdmins();
};

/**
 * Get chatroom's mutes.
 * Note: Will return empty array if have not ever got chatroom's mutes.
 * object is like {"key": name, "value": muteTime}.
 * @return {Array} Object list.
 */
EMChatroom.prototype.chatroomMutes = function () {
  return this._chatroom.chatroomMutes();
};

/**
 * Get current login user type.
 * @return {Number}
 */
EMChatroom.prototype.chatroomMemberType = function () {
  return this._chatroom.chatroomMemberType();
};

/**
 * Get chatroom's announcement.
 * @return {String}
 */
EMChatroom.prototype.chatroomAnnouncement = function () {
  return this._chatroom.chatroomAnnouncement();
};

module.exports = EMChatroom;