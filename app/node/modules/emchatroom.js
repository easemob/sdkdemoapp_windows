'use strict';

const EMMucSetting = require('./emmucsetting');

/**
 * Easemob EMChatroom implementation.
 */

/**
 * EMChatroom constructor.
 * @constructor
 * @param {Object} chatroom 聊天室对象
 */
function EMChatroom(chatroom) {
  this._chatroom = chatroom;
}

/**
 * Get chatroom's ID.
 * @return {String} 聊天室ID
 */
EMChatroom.prototype.chatroomId = function () {
  return this._chatroom.chatroomId();
};

/**
 * Get chatroom's subject.
 * @return {String} 返回聊天室名称
 */
EMChatroom.prototype.chatroomSubject = function () {
  return this._chatroom.chatroomSubject();
};

/**
 * Get chatroom's description.
 * @return {String} 返回聊天室描述
 */
EMChatroom.prototype.chatroomDescription = function () {
  return this._chatroom.chatroomDescription();
};

/**
 * Get chatroom's owner.
 * @return {String} 返回聊天室群主
 */
EMChatroom.prototype.owner = function () {
  return this._chatroom.owner();
};

/**
 * Get chatroom's setting.
 * @return {Number} 返回聊天室设置
 */
EMChatroom.prototype.chatroomSetting = function () {
  return new EMMucSetting(this._chatroom.chatroomSetting());
};

/**
 * Get current members count.
 * @return {Number} 返回聊天室成员数
 */
EMChatroom.prototype.chatroomMemberCount = function () {
  return this._chatroom.chatroomMemberCount();
};

/**
 * Get max count of chatroom member.
 * @return {Number} 返回聊天室最大人数
 */
EMChatroom.prototype.chatroomMemberMaxCount = function () {
  return this._chatroom.chatroomMemberMaxCount();
};

/**
 * Get chatroom's members.
 * Note: Will return empty array if have not ever got chatroom's members.
 * @return {Array} String list.聊天室成员列表
 */
EMChatroom.prototype.chatroomMembers = function () {
  return this._chatroom.chatroomMembers();
};

/**
 * Get chatroom's bans.
 * Note: Will return empty array if have not ever got chatroom's bans.
 * @return {Array} String list. 聊天室禁言成员列表
 */
EMChatroom.prototype.chatroomBans = function () {
  return this._chatroom.chatroomBans();
};

/**
 * Get chatroom's admins.
 * Note: Will return empty array if have not ever got chatroom's admins.
 * @return {Array} String list. 聊天室管理员列表
 */
EMChatroom.prototype.chatroomAdmins = function () {
  return this._chatroom.chatroomAdmins();
};

/**
 * Get chatroom's mutes.
 * Note: Will return empty array if have not ever got chatroom's mutes.
 * object is like {"key": name, "value": muteTime}.
 * @return {Array} Object list. 聊天室禁言一段时间的成员列表
 */
EMChatroom.prototype.chatroomMutes = function () {
  return this._chatroom.chatroomMutes();
};

/**
 * Get current login user type.
 * @return {Number} 聊天室类型
 */
EMChatroom.prototype.chatroomMemberType = function () {
  return this._chatroom.chatroomMemberType();
};

/**
 * Get chatroom's announcement.
 * @return {String} 聊天室公告
 */
EMChatroom.prototype.chatroomAnnouncement = function () {
  return this._chatroom.chatroomAnnouncement();
};

module.exports = EMChatroom;