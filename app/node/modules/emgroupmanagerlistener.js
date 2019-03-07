'use strict';

const EventEmitter = require('events').EventEmitter;
const easemobNode = require('./../load');
const EMGroup = require('./emgroup');

//EMGroupManagerListener object callback interface number.
const emGroupManagerListenerCount = 19;

/**
 * Easemob EMGroupManagerListener implementation.
 */

/**
 * EMGroupManagerListener constructor.
 * @constructor
 * @param {Object} manager
 */
function EMGroupManagerListener(manager) {
  var self = this;
  self._manager = manager;
  self._eventEmitter = new EventEmitter();
  self._eventEmitter.setMaxListeners(emGroupManagerListenerCount);
  self._listener = new easemobNode.EMGroupManagerListener();
  self._listener.onReceiveInviteFromGroup = function (groupId, inviter, inviteMessage) {
    self._eventEmitter.emit('onReceiveInviteFromGroup', groupId, inviter, inviteMessage);
  };
  self._listener.onReceiveInviteAcceptionFromGroup = function (group, invitee) {
    self._eventEmitter.emit('onReceiveInviteAcceptionFromGroup', group, invitee);
  };
  self._listener.onReceiveInviteDeclineFromGroup = function (group, invitee, reason) {
    self._eventEmitter.emit('onReceiveInviteDeclineFromGroup', group, invitee, reason);
  };
  self._listener.onAutoAcceptInvitationFromGroup = function (group, inviter, inviteMessage) {
    self._eventEmitter.emit('onAutoAcceptInvitationFromGroup', group, inviter, inviteMessage);
  };
  self._listener.onLeaveGroup = function (group, reason) {
    self._eventEmitter.emit('onLeaveGroup', group, reason);
  };
  self._listener.onReceiveJoinGroupApplication = function (group, from, message) {
    self._eventEmitter.emit('onReceiveJoinGroupApplication', group, from, message);
  };
  self._listener.onReceiveAcceptionFromGroup = function (group) {
    self._eventEmitter.emit('onReceiveAcceptionFromGroup', group);
  };
  self._listener.onReceiveRejectionFromGroup = function (groupId, reason) {
    self._eventEmitter.emit('onReceiveRejectionFromGroup', groupId, reason);
  };
  self._listener.onUpdateMyGroupList = function (list) {
    var groupList = new Array(list.length);
    for (var i = 0; i < list.length; i++) {
      groupList[i] = self._manager.groupWithId(list[i]);
    }
    self._eventEmitter.emit('onUpdateMyGroupList', groupList);
  };
  self._listener.onAddMutesFromGroup = function (group, mutes, muteExpire) {
    self._eventEmitter.emit('onAddMutesFromGroup', group, mutes, muteExpire);
  };
  self._listener.onRemoveMutesFromGroup = function (group, mutes) {
    self._eventEmitter.emit('onRemoveMutesFromGroup', group, mutes);
  };
  self._listener.onAddAdminFromGroup = function (group, admin) {
    self._eventEmitter.emit('onAddAdminFromGroup', group, admin);
  };
  self._listener.onRemoveAdminFromGroup = function (group, admin) {
    self._eventEmitter.emit('onRemoveAdminFromGroup', group, admin);
  };
  self._listener.onAssignOwnerFromGroup = function (group, newOwner, oldOwner) {
    self._eventEmitter.emit('onAssignOwnerFromGroup', group, newOwner, oldOwner);
  };
  self._listener.onMemberJoinedGroup = function (group, member) {
    self._eventEmitter.emit('onMemberJoinedGroup', group, member);
  };
  self._listener.onMemberLeftGroup = function (group, member) {
    self._eventEmitter.emit('onMemberLeftGroup', group, member);
  };
  self._listener.onUpdateAnnouncementFromGroup = function (group, announcement) {
    self._eventEmitter.emit('onUpdateAnnouncementFromGroup', group, announcement);
  };
  self._listener.onUploadSharedFileFromGroup = function (group, sharedFile) {
    self._eventEmitter.emit('onUploadSharedFileFromGroup', group, sharedFile);
  };
  self._listener.onDeleteSharedFileFromGroup = function (group, fileId) {
    self._eventEmitter.emit('onDeleteSharedFileFromGroup', group, fileId);
  };
}

/**
 * Callback user when user is invited to a group.
 * Note: User can accept or decline the invitation.
 * callback function type:
 * function callback(groupId, inviter, inviteMessage) {
 *  //@param {String} groupId
 *  //@param {String} inviter
 *  //@param {String} inviteMessage
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onReceiveInviteFromGroup = function (callback) {
  this._eventEmitter.on('onReceiveInviteFromGroup', callback);
};

/**
 * Callback user when the user accept to join the group.
 * callback function type:
 * function callback(group, invitee) {
 *  //@param {EMGroup} group
 *  //@param {String} invitee
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onReceiveInviteAcceptionFromGroup = function (callback) {
  this._eventEmitter.on('onReceiveInviteAcceptionFromGroup', callback);
};

/**
 * Callback user when the user decline to join the group.
 * callback function type:
 * function callback(group, invitee, reason) {
 *  //@param {EMGroup} group
 *  //@param {String} invitee
 *  //@param {String} reason
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onReceiveInviteDeclineFromGroup = function (callback) {
  this._eventEmitter.on('onReceiveInviteDeclineFromGroup', callback);
};

/**
 * Callback user when user is invited to a group.
 * Note: User has been added to the group when received this callback.
 * callback function type:
 * function callback(group, inviter, inviteMessage) {
 *  //@param {EMGroup} group
 *  //@param {String} inviter
 *  //@param {String} inviteMessage
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onAutoAcceptInvitationFromGroup = function (callback) {
  this._eventEmitter.on('onAutoAcceptInvitationFromGroup', callback);
};

/**
 * Callback user when user is kicked out from a group or the group is destroyed.
 * callback function type:
 * function callback(group, reason) {
 *  //@param {EMGroup} group
 *  //@param {Number} reason
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onLeaveGroup = function (callback) {
  this._eventEmitter.on('onLeaveGroup', callback);
};

/**
 * Callback user when receive a join group application.
 * callback function type:
 * function callback(group, from, message) {
 *  //@param {EMGroup} group
 *  //@param {String} from
 *  //@param {String} message
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onReceiveJoinGroupApplication = function (callback) {
  this._eventEmitter.on('onReceiveJoinGroupApplication', callback);
};

/**
 * Callback user when receive owner's approval.
 * callback function type:
 * function callback(group) {
 *  //@param {EMGroup} group
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onReceiveAcceptionFromGroup = function (callback) {
  this._eventEmitter.on('onReceiveAcceptionFromGroup', callback);
};

/**
 * Callback user when receive group owner's rejection.
 * callback function type:
 * function callback(groupId, reason) {
 *  //@param {String} groupId
 *  //@param {String} reason
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onReceiveRejectionFromGroup = function (callback) {
  this._eventEmitter.on('onReceiveRejectionFromGroup', callback);
};

/**
 * Callback user when login user's group list is updated.
 * callback function type:
 * function callback(list) {
 *  //@param {Array} list. EMGroup array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onUpdateMyGroupList = function (callback) {
  this._eventEmitter.on('onUpdateMyGroupList', callback);
};

/**
 * Callback user when user add to group mute list.
 * callback function type:
 * function callback(group, mutes, muteExpire) {
 *  //@param {EMGroup} group
 *  //@param {Array} mutes. String mute array.
 *  //@param {Number} muteExpire
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onAddMutesFromGroup = function (callback) {
  this._eventEmitter.on('onAddMutesFromGroup', callback);
};

/**
 * Callback user when user remove from group mute list.
 * callback function type:
 * function callback(group, mutes) {
 *  //@param {EMGroup} group
 *  //@param {Array} mutes. String mute array.
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onRemoveMutesFromGroup = function (callback) {
  this._eventEmitter.on('onRemoveMutesFromGroup', callback);
};

/**
 * Callback user when promote to group admin.
 * callback function type:
 * function callback(group, admin) {
 *  //@param {EMGroup} group
 *  //@param {String} admin
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onAddAdminFromGroup = function (callback) {
  this._eventEmitter.on('onAddAdminFromGroup', callback);
};

/**
 * Callback user when cancel admin.
 * callback function type:
 * function callback(group, admin) {
 *  //@param {EMGroup} group
 *  //@param {String} admin
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onRemoveAdminFromGroup = function (callback) {
  this._eventEmitter.on('onRemoveAdminFromGroup', callback);
};

/**
 * Callback user when promote to group owner.
 * callback function type:
 * function callback(group, newOwner, oldOwner) {
 *  //@param {EMGroup} group
 *  //@param {String} newOwner
 *  //@param {String} oldOwner
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onAssignOwnerFromGroup= function (callback) {
  this._eventEmitter.on('onAssignOwnerFromGroup', callback);
};

/**
 * Callback user when a user join the group.
 * callback function type:
 * function callback(group, member) {
 *  //@param {EMGroup} group
 *  //@param {String} member
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onMemberJoinedGroup = function (callback) {
  this._eventEmitter.on('onMemberJoinedGroup', callback);
};

/**
 * Callback user when a user leave the group.
 * callback function type:
 * function callback(group, member) {
 *  //@param {EMGroup} group
 *  //@param {String} member
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onMemberLeftGroup = function (callback) {
  this._eventEmitter.on('onMemberLeftGroup', callback);
};

/**
 * Callback user when update group announcement.
 * callback function type:
 * function callback(group, announcement) {
 *  //@param {EMGroup} group
 *  //@param {String} announcement
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onUpdateAnnouncementFromGroup = function (callback) {
  this._eventEmitter.on('onUpdateAnnouncementFromGroup', callback);
};

/**
 * Callback user when group member upload share file.
 * callback function type:
 * function callback(group, sharedFile) {
 *  //@param {EMGroup} group
 *  //@param {EMMucSharedFile} sharedFile
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onUploadSharedFileFromGroup = function (callback) {
  this._eventEmitter.on('onUploadSharedFileFromGroup', callback);
};

/**
 * Callback user when group admin or owner or file uploader delete share file.
 * callback function type:
 * function callback(group, fileId) {
 *  //@param {EMGroup} group
 *  //@param {String} fileId
 *  ...
 *  //@return {void}
 * }
 * @param {callback} callback
 * @return {void}
 */
EMGroupManagerListener.prototype.onDeleteSharedFileFromGroup = function (callback) {
  this._eventEmitter.on('onDeleteSharedFileFromGroup', callback);
};

module.exports = EMGroupManagerListener;