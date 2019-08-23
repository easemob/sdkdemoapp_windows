'use strict';

const EMGroup = require('./emgroup');
const EMError = require('./emerror');
const {EMCursorResult, EMPageResult, EMStringCursorResult} = require('./emcursorresult');
const EMCallback = require('./emcallback');
const EMMucSharedFile = require('./emmucsharedfile');
const async = require('async');

/**
 * Easemob EMGroupManager implementation.
 */

/**
 * EMGroupManager constructor.
 * @constructor
 * @param {Object} manager 组管理对象
 */
function EMGroupManager(manager) {
  this._manager = manager;
}

/**
 * Add group manager listener.
 * @param {EMGroupManagerListener} listener 组管理的回调监听对象
 * @return {void}
 */
EMGroupManager.prototype.addListener = function (listener) {
  this._manager.addListener(listener._listener);
};

/**
 * Remove group manager listener.
 * @param {EMGroupManagerListener} listener 组管理的回调监听对象
 * @return {void}
 */
EMGroupManager.prototype.removeListener = function (listener) {
  this._manager.removeListener(listener._listener);
};

/**
 * Remove all the listeners.
 * @return {void}
 */
EMGroupManager.prototype.clearListeners = function () {
  this._manager.clearListeners();
};

/**
 * Get a group with groupId, create the group if not exist.
 * @param {String} groupId 群组ID
 * @return {EMGroup} 返回群组对象
 */
EMGroupManager.prototype.groupWithId = function (groupId) {
  return new EMGroup(this._manager.groupWithId(groupId));
};

function createGroupList(list) {
  var groups = new Array(list.length);
  for (var i = 0; i < list.length; i++) {
    groups[i] = new EMGroup(list[i]);
  }
  return groups;
}

/**
 * Get groups for login user from cache, or from local database if not in cache.
 * @return {Array} EMGroup array.
 */
EMGroupManager.prototype.allMyGroups = function () {
  let error = new EMError();
  let grouplist = createGroupList(this._manager.allMyGroups(error._error));
  return {
    code:error.errorCode,
    description:error.description,
    data:grouplist
  };
};

/**
 * Fetch all groups for login user from server.
 * Note: Groups in memory will be updated.
 * @return {Object} {code,description,data} EMGroup array.
 */
EMGroupManager.prototype.fetchAllMyGroups = function () {

  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let grouplist = createGroupList(_manager.fetchAllMyGroups(error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:grouplist
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Fetch app's public groups with page.
 * If PageNum=0, then there is no pagination and will get all the users on the list.
 * If PageNum=1, then will start from the first page of pagination.
 * @param {Number} pageNum 获取的页数
 * @param {Number} pageSize 每页的群组计数
 * @return {Object}  {code,description,data} cursor store the public groups.
 */
EMGroupManager.prototype.fetchPublicGroupsWithPage = function (pageNum, pageSize) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let pageresult = new EMPageResult(_manager.fetchPublicGroupsWithPage(pageNum, pageSize, error._error), 0);
      return {
        code:error.errorCode,
        description:error.description,
        data:pageresult.result()
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Create a new group.
 * Note: user will be the owner of the group created.
 * @param {String} subject          Group's subject.
 * @param {String} description      Group's description.
 * @param {String} welcomeMessage   Welcoming message that will be sent to invited user.
 * @param {String} setting          Group's setting.
 * @param {Array} members           Group's members. String array.
 * @return {Object}      {code,description,data}          The group created.
 */
EMGroupManager.prototype.createGroup = function (subject, description, welcomeMessage, setting, members) {
  
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.createGroup(subject, description, welcomeMessage, setting._setting, members, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Join a public group.
 * Note: The group's style must be PUBLIC_JOIN_OPEN, or will return error.
 * @param {String} groupId    Group ID.
 * @return {Object}    {code,description,data}      The group joined.
 */
EMGroupManager.prototype.joinPublicGroup = function (groupId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.joinPublicGroup(groupId, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Request to join a public group, need owner or admin's approval.
 * Note: The group's style must be PUBLIC_JOIN_APPROVAL, or will return error.
 * @param {String} groupId        Group ID.
 * @param {String} nickName       user's nickname in the group.
 * @param {String} message        requesting message, that will be sent to group owner.
 * @return {Object}       {code,description,data}       The group to join.
 */
EMGroupManager.prototype.applyJoinPublicGroup = function (groupId, nickName, message) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.applyJoinPublicGroup(groupId, nickName, message, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Leave a group.
 * Note: Group owner cannot leave the group.
 * @param {String} groupId        Group ID.
 * @return {Object} {code,description,data}
 */
EMGroupManager.prototype.leaveGroup = function (groupId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.leaveGroup(groupId, error._error);
      return {
        code:error.errorCode,
        description:error.description
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Destroy a group.
 * Note: Only group owner can destroy the group.
 * @param {String} groupId        Group ID.
 * @return {Object} {code,description,data}
 */
EMGroupManager.prototype.destroyGroup = function (groupId, error) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.destroyGroup(groupId, error._error);
      return {
        code:error.errorCode,
        description:error.description
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Add members to a group.
 * Note: whether if user has permission to invite other user depends on group's setting
 * @param {String} groupId          Group ID
 * @param {Array} members           string members array, Invited users.
 * @param {String} welcomeMessage   Welcome message that will be sent to invited user.
 * @return {Object}     {code,description,data}           The group.
 */
EMGroupManager.prototype.addGroupMembers = function (groupId, members, welcomeMessage) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.addGroupMembers(groupId, members, welcomeMessage, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Remove members from a group.
 * Note: ONLY group owner and admin owner can remove members.
 * ONLY group owner can remove both admin and members.
 * @param {String} groupId          Group ID.
 * @param {Array} members           string members array, Removed members.
 * @return {Object}      {code,description,data}          The group.
 */
EMGroupManager.prototype.removeGroupMembers = function (groupId, members) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.removeGroupMembers(groupId, members, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Block group's members, the blocked user cannot send message in the group.
 * Note: ONLY group owner and admin owner can block members.
 * ONLY group owner can block both admin and members.
 * @param {String} groupId          Group ID.
 * @param {Array} members           string members array,  Blocked members.

 * @param {String} reason           The reason of blocking members.
 * @return {Object}     {code,description,data}           The group.
 */
EMGroupManager.prototype.blockGroupMembers = function (groupId, members, reason) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.blockGroupMembers(groupId, members, error._error, reason));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Unblock group's members.
 * Note: ONLY group owner and admin owner can unblock members.
 * ONLY group owner can unblock both admin and members.
 * @param {String} groupId          Group ID.
 * @param {Array} members           string members array,  Unblocked users.
 * @param {EMError} error           EMError used for output.
 * @return {Object}     {code,description,data}           The group.
 */
EMGroupManager.prototype.unblockGroupMembers = function (groupId, members) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.unblockGroupMembers(groupId, members, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Change group's subject.
 * Note: Only group's owner can change group's subject.
 * @param {String} groupId          Group ID.
 * @param {String} newSubject       The new group subject.
 * @param {EMError} error           EMError used for output.
 * @return {Object}     {code,description,data}           The group.
 */
EMGroupManager.prototype.changeGroupSubject = function (groupId, newSubject) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.changeGroupSubject(groupId, newSubject, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Change group's description.
 * Note: Only group's owner can change group's description.
 * @param {String} groupId          Group ID.
 * @param {String} newDescription   The new group description.
 * @param {EMError} error           EMError used for output.
 * @return {Object}     {code,description,data}           The group.
 */
EMGroupManager.prototype.changeGroupDescription = function (groupId, newDescription) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.changeGroupDescription(groupId, newDescription, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Change group's extension.
 * Note: Only group's owner can change group's extension.
 * @param {String} groupId          Group ID.
 * @param {String} newDescription   The new group extension.
 * @param {EMError} error           EMError used for output.
 * @return {Object}     {code,description,data}           The group.
 */
EMGroupManager.prototype.changeGroupExtension = function (groupId, newExtension) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.changeGroupExtension(groupId, newExtension, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Get group's specification.
 * @param {String} groupId          Group ID.
 * @param {EMError} error           EMError used for output.
 * @param {Bool} fetchMembers       Whether get group's members.
 * @return {Object}    {code,description,data}            The group.
 */
EMGroupManager.prototype.fetchGroupSpecification = function (groupId, fetchMembers) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.fetchGroupSpecification(groupId, error._error, fetchMembers));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Get group's member list
 * Note: User can input empty string as cursor at the first time
 * @param {String} groupId          Group ID.
 * @param {String} cursor           Page's cursor.
 * @param {Number} pageSize         Page size. ex. 20 for 20 objects.
 * @return {Object} {code,description,data}  the cursor store the list of group members.
 */
EMGroupManager.prototype.fetchGroupMembers = function (groupId, cursor, pageSize) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let memberlist = new EMStringCursorResult(_manager.fetchGroupMembers(groupId, cursor, pageSize, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:memberlist.result(),
        nextcursor:memberlist.nextPageCursor()
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Get group's bans member list
 * Note: User can input empty string as cursor at the first time
 * @param {String} groupId          Group ID.
 * @param {Number} pageNum          Page's cursor.
 * @param {Number} pageSize         Page size. ex. 20 for 20 objects.
 * @return {Object}  {code,description,data} the cursor store the list of group members.
 */

EMGroupManager.prototype.fetchGroupBans = function (groupId, pageNum, pageSize) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let grouplist = new EMStringCursorResult(_manager.fetchGroupBans(groupId, pageNum, pageSize, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:grouplist.result(),
        nextcursor:grouplist.nextPageCursor()
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Search for a public group.
 * @param {String} groupId          Group ID to be found.
 * @return {Object}     {code,description,data}           The group with specified id.
 */
EMGroupManager.prototype.searchPublicGroup = function (groupId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.searchPublicGroup(groupId, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Block group message.
 * Note: Owner cannot block the group message.
 * @param {String} groupId          Group ID.
 * @return {Object}       {code,description,data}         The group.
 */
EMGroupManager.prototype.blockGroupMessage = function (groupId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.blockGroupMessage(groupId, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Unblock group message.
 * @param {String} groupId          Group ID.
 * @return {Object}        {code,description,data}        The group.
 */
EMGroupManager.prototype.unblockGroupMessage = function (groupId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.unblockGroupMessage(groupId, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Accept user's group joining request.
 * Note: Only group's owner and admin can approval user's request to join group.
 * @param {String} groupId          Group ID.
 * @param {String} user             The user that made the request.
 * @return {Object}       {code,description,data}         The group.
 */
EMGroupManager.prototype.acceptJoinGroupApplication = function (groupId, user) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.acceptJoinGroupApplication(groupId, user, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Decline user's join application.
 * Note: Only group's owner and admin can decline user's request to join group.
 * @param {String} groupId          Group ID.
 * @param {String} user             The user that made the request.
 * @return {Object}        {code,description,data}        The group.
 */
EMGroupManager.prototype.declineJoinGroupApplication = function (groupId, user, reason) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.declineJoinGroupApplication(groupId, user, reason, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * accept invitation to join a group.
 * @param {String} groupId          Group ID.
 * @param {String} inviter          Inviter
 * @return {Object}      {code,description,data}          The group user has accepted.
 */
EMGroupManager.prototype.acceptInvitationFromGroup = function (groupId, inviter) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.acceptInvitationFromGroup(groupId, inviter, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * decline invitation to join a group.
 * @param {String} groupId          Group ID.
 * @param {String} inviter          Inviter.
 * @param {String} reason           The decline reason.
 * @return {Object}        {code,description,data}        The group user has accepted.
 */
EMGroupManager.prototype.declineInvitationFromGroup = function (groupId, inviter, reason) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.declineInvitationFromGroup(groupId, inviter, reason, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * transfer to new group owner.
 * Note: Only group owner can transfer ownership
 * @param {String} groupId          Group ID of the current owner.
 * @param {String} newOwner         Group ID of the new owner.
 * @return {Object}          {code,description,data}      The group user has accepted.
 */
EMGroupManager.prototype.transferGroupOwner = function (groupId, newOwner) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.transferGroupOwner(groupId, newOwner, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * add group admin.
 * Note: Only group owner can add admin.
 * @param {String} groupId          Group ID.
 * @param {String} admin            New group admin.
 * @return {Object}      {code,description,data}          The group.
 */
EMGroupManager.prototype.addGroupAdmin = function (groupId, admin) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.addGroupAdmin(groupId, admin, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * remove group admin.
 * Note: ONLY group owner can remove admin, not other admin.
 * @param {String} groupId          Group ID.
 * @param {String} admin            Group admin member.
 * @return {Object}       {code,description,data}         The group.
 */
EMGroupManager.prototype.removeGroupAdmin = function (groupId, admin) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.removeGroupAdmin(groupId, admin, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * add group mute members.
 * Note: Temporary mute members will not be able to talk in the chat room for period of time.
 * @param {String} groupId          Group ID.
 * @param {Array}  members          Group's mute members.
 * @param {Number} muteDuration     mute duration in milliseconds.
 * @return {Object}      {code,description,data}          The group.
 */
EMGroupManager.prototype.muteGroupMembers = function (groupId, members, muteDuration) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.muteGroupMembers(groupId, members, muteDuration, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * remove group muted members.
 * @param {String} groupId          Group ID.
 * @param {Array}  members          mute members to be removed.
 * @return {Object}      {code,description,data}          The group.
 */
EMGroupManager.prototype.unmuteGroupMembers = function (groupId, members, error) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.unmuteGroupMembers(groupId, members, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Get the list of group muted users.
 * @param {String} groupId          Group ID.
 * @param {Number} pageNum          mute members to be removed.
 * @param {Number} pageSizePage     size. ex. 20 for 20 objects.
 * @return {Object} {code,description,data}  The list of mute users. object like { "key" : name, "value" : 111 }.
 */
EMGroupManager.prototype.fetchGroupMutes = function (groupId, pageNum, pageSize) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let dataArray = _manager.fetchGroupMutes(groupId, pageNum, pageSize, error._error)
      return {
        code:error.errorCode,
        description:error.description,
        data:dataArray
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * upload a sharing file to group.
 * @param {String} groupId          Group ID.
 * @param {String} filePath         file path to be uploaded to on server. Can be used for file downloading later.
 * @param {EMCallback} callback     EMCallback contains onProgress of file uploading progress.
 * @return {Object} {code,description,data} EMMucSharedFile list. 
 */
EMGroupManager.prototype.uploadGroupSharedFile = function (groupId, filePath, callback) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let sharedFile = new EMMucSharedFile(_manager.uploadGroupSharedFile(groupId, filePath, callback._callback, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:sharedFile
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * fetch group's shared files list.
 * @param {String} groupId          Group ID.
 * @param {Number} pageNum          page number of pagination.
 * @param {Number} pageSize         Page size. ex. 20 for 20 objects.
 * @return {Object}  {code,description,data} EMMucSharedFile list. 
 */
EMGroupManager.prototype.fetchGroupSharedFiles = function (groupId, pageNum, pageSize) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      var result = _manager.fetchGroupSharedFiles(groupId, pageNum, pageSize, error._error);
      var sharedFiles = new Array(result.length);
      for (var i = 0; i < result.length; i++) {
        sharedFiles[i] = new EMMucSharedFile(result[i]);
      }
      return {
        code:error.errorCode,
        description:error.description,
        data:sharedFiles
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * delete a shared file.
 * Note: ONLY group's admin and owner or file uploader can delete shared file.
 * @param {String} groupId          Group ID.
 * @param {String} filePath         store file to this path.
 * @param {String} fileId           shared file id.
 * @param {EMCallback} callback     EMCallback contains onProgress of file uploading progress.
 * @return {Object}        {code,description,data}        The group.
 */
EMGroupManager.prototype.downloadGroupSharedFile = function (groupId, filePath, fileId, callback) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.downloadGroupSharedFile(groupId, filePath, fileId, callback._callback, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * delete a shared file.
 * Note: ONLY group's admin and owner or file uploader can delete shared file.
 * @param {String} groupId          Group ID.
 * @param {String} fileId           shared file id.
 * @return {Object}       {code,description,data}         The group.
 */
EMGroupManager.prototype.deleteGroupSharedFile = function (groupId, fileId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.deleteGroupSharedFile(groupId, fileId, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * fetch group's announcement.
 * Note: Only group's members can fetch group's announcement.
 * @param {String} groupId          Group ID.
 * @return {Object}         {code,description,data}        The group's announcement in string.
 */
EMGroupManager.prototype.fetchGroupAnnouncement = function (groupId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let announcement = _manager.fetchGroupAnnouncement(groupId, error._error);
      return {
        code:error.errorCode,
        description:error.description,
        data:announcement
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Update group's announcement.
 * @param {String} groupId          Group ID.
 * @param {String} newAnnouncement  a new group announcement.
 * @return {Object}  {code,description,data}  The group.
 */
EMGroupManager.prototype.updateGroupAnnouncement = function (groupId, newAnnouncement) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let group = new EMGroup(_manager.updateGroupAnnouncement(groupId, newAnnouncement, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:group
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

module.exports = EMGroupManager;