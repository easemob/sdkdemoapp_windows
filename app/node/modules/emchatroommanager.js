'use strict';

const EMChatroom = require('./emchatroom');
const {EMCursorResult, EMPageResult, EMStringCursorResult} = require('./emcursorresult');
const async = require('async');

/**
 * Easemob EMChatroomManager implementation.
 */

function EMChatroomManager(manager) {
  this._manager = manager;
}

/**
 * Add chatroom manager listener.
 * @param {EMChatroomManagerListener} listener
 * @return {void}
 */
EMChatroomManager.prototype.addListener = function (listener) {
  this._manager.addListener(listener._listener);
};

/**
 * Remove chatroom manager listener.
 * @param {EMChatroomManagerListener} listener
 * @return {void}
 */
EMChatroomManager.prototype.removeListener = function (listener) {
  this._manager.removeListener(listener._listener);
};

/**
 * Remove all the chatroom manager listeners.
 * @return {void}
 */
EMChatroomManager.prototype.clearListeners = function () {
  this._manager.clearListeners();
};

/**
 * Get the chatroom by chatroomId, create a chatroom if not existed.
 * @param {EMError} error
 * @return {Array} EMChatroom array.
 */
EMChatroomManager.prototype.chatroomWithId = function (chatroomId) {
  return new EMChatroom(this._manager.chatroomWithId(chatroomId));
};

/**
 * Fetch all chatrooms of the app.
 * @param {EMError} error
 * @return {Array} EMChatroom array.
 */
EMChatroomManager.prototype.fetchAllChatrooms = function (error) {
  var result = this._manager.fetchAllChatrooms();
  var list = new Array(result.length);
  for (var i = 0; i < result.length; i++) {
    list[i] = new EMChatroom(result[i]);
  }
  return list;
};

/**
 * Create a new chatroom.
 * Note: Login user will be the owner of the chat room created.
 * @param {String} subject          chatroom's subject.
 * @param {String} description      chatroom's description.
 * @param {String} welcomeMessage   Welcoming message that will be sent to invited user.
 * @param {String} setting          chatroom's setting.
 * @param {Array} members           a list of chatroom's members.
 * @param {EMError} error           EMError used for output.
 * @return {EMChatroom}             The chatroom created.
 */
EMChatroomManager.prototype.createChatroom = function (subject, description, welcomeMessage, setting, members, error) {
  return new EMChatroom(this._manager.createChatroom(subject, description, welcomeMessage, setting._setting, members, error._error));
};

/**
 * Destroy a chatroom.
 * Note: ONLY chatroom's owner can destroy the chatroom.
 * @param {String} chatroomId     chatroom ID.
 * @param {EMError} error         EMError used for output.
 * @return {void}
 */
EMChatroomManager.prototype.destroyChatroom = function (chatroomId, error) {
  this._manager.destroyChatroom(chatroomId, error._error);
};

/**
 * Change chatroom's subject.
 * Note: ONLY chatroom's owner can change chatroom's subject.
 * @param {String} chatroomId     chatroom ID.
 * @param {String} newSubject     The new chatroom subject.
 * @param {EMError} error         EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.changeChatroomSubject = function (chatroomId, newSubject, error) {
  return new EMChatroom(this._manager.changeChatroomSubject(chatroomId, newSubject, error._error));
};

/**
 * Change chatroom's description.
 * Note: ONLY chatroom's owner can change chatroom's description.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} newDescription     The new chatroom description.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.changeChatroomDescription = function (chatroomId, newDescription, error) {
  return new EMChatroom(this._manager.changeChatroomDescription(chatroomId, newDescription, error._error));
};

/**
 * Change chatroom's extension.
 * Note: ONLY chatroom's owner can change chatroom's extension.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} newExtension       The new chatroom extension.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.changeChatroomExtension = function (chatroomId, newExtension, error) {
  return new EMChatroom(this._manager.changeChatroomExtension(chatroomId, newExtension, error._error));
};

/**
 * Get chatroom's specifications.
 * @param {String} chatroomId         chatroom ID.
 * @param {EMError} error             EMError used for output.
 * @param {Bool} fetchMembers         Wether to fetch members in the chatroom.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.fetchChatroomSpecification = function (chatroomId, error, fetchMembers) {
  return new EMChatroom(this._manager.fetchChatroomSpecification(chatroomId, error._error, fetchMembers));
};

/**
 * get chatroom members.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} cursor             Page's cursor.
 * @param {Number} pageSize           Page size. ex. 20 for 20 objects.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.fetchChatroomMembers = function (chatroomId, cursor, pageSize, error) {
  return new EMStringCursorResult(this._manager.fetchChatroomMembers(chatroomId, cursor, pageSize, error._error));
};

/**
 * Join a chatroom.
 * @param {String} chatroomId         chatroom ID.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.joinChatroom = function (chatroomId, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return new EMChatroom(_manager.joinChatroom(chatroomId, error._error));
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Join a chatroom.
 * @param {String} chatroomId         chatroom ID.
 * @param {EMError} error             EMError used for output.
 * @return {void}
 */
EMChatroomManager.prototype.leaveChatroom = function (chatroomId, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.leaveChatroom(chatroomId, error._error);
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Get the chatroom by chatroom id.
 * @param {String} cursor           Page's cursor.
 * @param {Number} pageSize         Page size. ex. 20 for 20 objects.
 * @param {EMError} error           EMError used for output.
 * @return {EMPageResult}
 */
EMChatroomManager.prototype.fetchChatroomsWithCursor = function (cursor, pageSize, error) {
  return new EMCursorResult(this._manager.fetchChatroomsWithCursor(cursor, pageSize, error._error), 1);
};

/**
 * Get the chatroom by chatroom id.
 * @param {Number} pageNum          page number of pagination.
 * @param {Number} pageSize         Page size. ex. 20 for 20 objects.
 * @param {EMError} error           EMError used for output.
 * @return {EMPageResult}
 */
EMChatroomManager.prototype.fetchChatroomsWithPage = function (pageNum, pageSize, error) {
  return new EMPageResult(this._manager.fetchChatroomsWithPage(pageNum, pageSize, error._error), 1);
};

/**
 * Get the chatroom by chatroom id.
 * @param {String} chatroomId         chatroom ID.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.joinedChatroomById = function (chatroomId) {
  return new EMChatroom(this._manager.joinedChatroomById(chatroomId));
};

/**
 * Get the chatroom by chatroom id.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} newOwner           new chatroom owner.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.transferChatroomOwner = function (chatroomId, newOwner, error) {
  return new EMChatroom(this._manager.transferChatroomOwner(chatroomId, newOwner, error._error));
};

/**
 * add admin to the chatroom.
 * Note: ONLY owner has permission, not for admin or member.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} admin              new admin added.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.addChatroomAdmin = function (chatroomId, admin, error) {
  return new EMChatroom(this._manager.addChatroomAdmin(chatroomId, admin, error._error));
};

/**
 * remove admin to the chatroom. Only owner has permission, not for admin or member.
 * Note: ONLY owner has permission, not for admin or member.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} admin              admin removed.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.removeChatroomAdmin = function (chatroomId, addmin, error) {
  return new EMChatroom(this._manager.removeChatroomAdmin(chatroomId, addmin, error._error));
};

/**
 * add chatroom muted members.
 * @param {String} chatroomId         chatroom ID.
 * @param {Array} members             add muted members.
 * @param {Number} muteDuration       members mute duration in milliseconds.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.muteChatroomMembers = function (chatroomId, members, muteDuration, error) {
  return new EMChatroom(this._manager.muteChatroomMembers(chatroomId, members, muteDuration, error._error));
};

/**
 * remove chat room mute members.
 * @param {String} chatroomId         chatroom ID.
 * @param {Array} members             remove muted members.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.unmuteChatroomMembers = function (chatroomId, members, error) {
  return new EMChatroom(this._manager.unmuteChatroomMembers(chatroomId, members, error._error));
};

/**
 * fetch chat room mute members.
 * Note: If PageNum=0, then there is no pagination and will get all the users on the list.
 * If PageNum=1, then will start from the first page of pagination.
 * @param {String} chatroomId       chatroom ID.
 * @param {Number} pageNum          page number of pagination.
 * @param {Number} pageSizePage     Page size. ex. 20 for 20 objects.
 * @param {EMError} error           EMError used for output.
 * @return {Array} object list. The list of mute users. object like { "key" : name, "value" : 111 }.
 */
EMChatroomManager.prototype.fetchChatroomMutes = function (chatroomId, pageNum, pageSize, error) {
  return this._manager.fetchChatroomMutes(chatroomId, pageNum, pageSize, error._error);
};

/**
 * remove chat room members.
 * @param {String} chatroomId         chatroom ID.
 * @param {Array} members             remove chat room members.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.removeChatroomMembers = function (chatroomId, members, error) {
  return new EMChatroom(this._manager.removeChatroomMembers(chatroomId, members, error._error));
};

/**
 * add user to chat room blacklist.
 * @param {String} chatroomId         chatroom ID.
 * @param {Array} members             add to chat room blacklist.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.blockChatroomMembers = function (chatroomId, members, error) {
  return new EMChatroom(this._manager.blockChatroomMembers(chatroomId, members, error._error));
};

/**
 * remove members from chat room blacklist.
 * @param {String} chatroomId         chatroom ID.
 * @param {Array} members             remeve from chat room blacklist.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.unblockChatroomMembers = function (chatroomId, members, error) {
  return new EMChatroom(this._manager.unblockChatroomMembers(chatroomId, members, error._error));
};

/**
 * fetch chat room blacklist members.
 * Note: If PageNum=0, then there is no pagination and will get all the users on the list.
 * If PageNum=1, then will start from the first page of pagination.
 * @param {String} chatroomId         chatroom ID.
 * @param {Number} pageNum            page number of pagination.
 * @param {Number} pageSize           Page size. ex. 20 for 20 objects.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.fetchChatroomBans = function (chatroomId, pageNum, pageSize, error) {
  return this._manager.fetchChatroomBans(chatroomId, pageNum, pageSize, error._error);
};

/**
 * fetch chat room announcement.
 * @param {String} chatroomId         chatroom ID.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.fetchChatroomAnnouncement = function (chatroomId, error) {
  return this._manager.fetchChatroomAnnouncement(chatroomId, error._error);
};

/**
 * Update chat room announcement.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} newAnnouncement    The new chatroom announcement.
 * @param {EMError} error             EMError used for output.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.updateChatroomAnnouncement = function (chatroomId, newAnnouncement, error) {
  return new EMChatroom(this._manager.updateChatroomAnnouncement(chatroomId, newAnnouncement, error._error));
};

module.exports = EMChatroomManager;