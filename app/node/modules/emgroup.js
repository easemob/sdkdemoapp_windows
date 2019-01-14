'use strict';

const EMMucSetting = require('./emmucsetting');
const EMMucSharedFile = require('./emmucsharedfile');

/**
 * Easemob EMGroup implementation.
 */

function EMGroup(group) {
  this._group = group;
}

/**
 * Get group's ID.
 * @return {String}
 */
EMGroup.prototype.groupId = function () {
  return this._group.groupId();
};

/**
 * Get group's subject.
 * @return {String}
 */
EMGroup.prototype.groupSubject = function () {
  return this._group.groupSubject();
};

/**
 * Get group's description.
 * @return {String}
 */
EMGroup.prototype.groupDescription = function () {
  return this._group.groupDescription();
};

/**
 * Get group's owner.
 * @return {String}
 */
EMGroup.prototype.groupOwner = function () {
  return this._group.groupOwner();
};

/**
 * Get group's setting.
 * @return {EMMucSetting}
 */
EMGroup.prototype.groupSetting = function () {
  return new EMMucSetting(this._group.EMMucSetting());
};

/**
 * Get current members count.
 * @return {Number}
 */
EMGroup.prototype.groupMembersCount = function () {
  return this._group.groupMembersCount();
};

/**
 * Get current login user type.
 * @return {Number}
 */
EMGroup.prototype.groupMemberType = function () {
  return this._group.groupMemberType();
};

/**
 * Get whether push is enabled status.
 * @return {Bool}
 */
EMGroup.prototype.isPushEnabled = function () {
  return this._group.isPushEnabled();
};

/**
 * Get whether group messages is blocked.
 * @return {Bool}
 */
EMGroup.prototype.isMessageBlocked = function () {
  return this._group.isMessageBlocked();
};

/**
 * Get a copy of group's member list.
 * Note: Will return empty array if have not ever got group's members.
 * @return {Array} String list.
 */
EMGroup.prototype.groupMembers = function () {
  return this._group.groupMembers();
};

/**
 * Get a copy of group's bans.
 * Note: Will return empty array if have not ever got group's bans.
 * @return {Array} String list.
 */
EMGroup.prototype.groupBans = function () {
  return this._group.groupBans();
};

/**
 * Get group's admins.
 * Note: Will return empty array if have not ever got group's admins.
 * @return {Array} String list.
 */
EMGroup.prototype.groupAdmins = function () {
  return this._group.groupAdmins();
};

/**
 * Get group's mutes.
 * Note: Will return empty array if have not ever got group's mutes.
 * object is like {"key": name, "value": muteTime}.
 * @return {Array} Object list.
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
 * @return {String}
 */
EMGroup.prototype.groupAnnouncement = function () {
  return this._group.groupAnnouncement();
};

module.exports = EMGroup;