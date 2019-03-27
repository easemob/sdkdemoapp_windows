'use strict';

const EMMucSetting = require('./emmucsetting');
const EMMucSharedFile = require('./emmucsharedfile');

/**
 * Easemob EMGroup implementation.
 */

/**
 * EMError constructor.
 * @constructor
 * @param {Object} group
 */
function EMGroup(group) {
  this._group = group;
}

/**
 * Get group's ID.
 * @return {String} 返回groupId
 */
EMGroup.prototype.groupId = function () {
  return this._group.groupId();
};

/**
 * Get group's subject.
 * @return {String} 返回组名称
 */
EMGroup.prototype.groupSubject = function () {
  return this._group.groupSubject();
};

/**
 * Get group's description.
 * @return {String} 返回组描述
 */
EMGroup.prototype.groupDescription = function () {
  return this._group.groupDescription();
};

/**
 * Get group's owner.
 * @return {String} 返回群主
 */
EMGroup.prototype.groupOwner = function () {
  return this._group.groupOwner();
};

/**
 * Get group's setting.
 * @return {EMMucSetting} 返回组设置
 */
EMGroup.prototype.groupSetting = function () {
  return new EMMucSetting(this._group.groupSetting());
};

/**
 * Get current members count.
 * @return {Number} 返回组成员计数
 */
EMGroup.prototype.groupMembersCount = function () {
  return this._group.groupMembersCount();
};

/**
 * Get current login user type.
 * @return {Number} 返回组成员类型
 */
EMGroup.prototype.groupMemberType = function () {
  return this._group.groupMemberType();
};

/**
 * Get whether push is enabled status.
 * @return {Bool} 返回是否允许发送消息
 */
EMGroup.prototype.isPushEnabled = function () {
  return this._group.isPushEnabled();
};

/**
 * Get whether group messages is blocked.
 * @return {Bool} 返回当前是否屏蔽群
 */
EMGroup.prototype.isMessageBlocked = function () {
  return this._group.isMessageBlocked();
};

/**
 * Get a copy of group's member list.
 * Note: Will return empty array if have not ever got group's members.
 * @return {Array} String list. 组成员列表
 */
EMGroup.prototype.groupMembers = function () {
  return this._group.groupMembers();
};

/**
 * Get a copy of group's bans.
 * Note: Will return empty array if have not ever got group's bans.
 * @return {Array} String list. 组禁言成员列表
 */
EMGroup.prototype.groupBans = function () {
  return this._group.groupBans();
};

/**
 * Get group's admins.
 * Note: Will return empty array if have not ever got group's admins.
 * @return {Array} String list. 组管理员列表
 */
EMGroup.prototype.groupAdmins = function () {
  return this._group.groupAdmins();
};

/**
 * Get group's mutes.
 * Note: Will return empty array if have not ever got group's mutes.
 * object is like {"key": name, "value": muteTime}.
 * @return {Array} Object list. 聊天室禁言列表
 */
EMGroup.prototype.groupMutes = function () {
  return this._group.groupMutes();
};

/**
 * Get group's shared files.
 * @return {Array} EMMucSharedFile array.
 */
EMGroup.prototype.groupSharedFiles = function () {
  var result = this._group.groupSharedFiles();
  var list = new Array(result.length);
  for (var i = 0; i < result.length; i++) {
    list[i] = new EMMucSharedFile(result[i]);
  }
  return list;
};

/**
 * Get group's announcement.
 * @return {String} 群公告
 */
EMGroup.prototype.groupAnnouncement = function () {
  return this._group.groupAnnouncement();
};

module.exports = EMGroup;