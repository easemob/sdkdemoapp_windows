'use strict';

const EMChatroom = require('./emchatroom');
const EMError = require('./EMError')
const {EMCursorResult, EMPageResult, EMStringCursorResult} = require('./emcursorresult');
const async = require('async');

/**
 * Easemob EMChatroomManager implementation.
 */

/**
 * EMChatroomManager constructor.
 * @constructor
 * @param {Object} manager
 */
function EMChatroomManager(manager) {
  this._manager = manager;
}

/**
 * Add chatroom manager listener.
 * @param {EMChatroomManagerListener} listener 添加的聊天室回调监听对象
 * @return {void}
 */
EMChatroomManager.prototype.addListener = function (listener) {
  this._manager.addListener(listener._listener);
};

/**
 * Remove chatroom manager listener.
 * @param {EMChatroomManagerListener} listener 移除的聊天室回调监听对象
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
 * @param {String} chatroomId 聊天室ID
 * @return {Object} EMChatroom array.
 */
EMChatroomManager.prototype.chatroomWithId = function (chatroomId) {
  return new EMChatroom(this._manager.chatroomWithId(chatroomId));
};

/**
 * Fetch all chatrooms of the app.
 * @return {Array} EMChatroom array.
 */
EMChatroomManager.prototype.fetchAllChatrooms = function () {
  var error = new EMError();
  var result = this._manager.fetchAllChatrooms(error._error);
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
 * @return {EMChatroom}             The chatroom created.
 */
EMChatroomManager.prototype.createChatroom = function (subject, description, welcomeMessage, setting, members) {
  let error = new EMError();
  return new EMChatroom(this._manager.createChatroom(subject, description, welcomeMessage, setting._setting, members, error._error));
};

/**
 * Destroy a chatroom.
 * Note: ONLY chatroom's owner can destroy the chatroom.
 * @param {String} chatroomId     chatroom ID.

 * @return {void}
 */
EMChatroomManager.prototype.destroyChatroom = function (chatroomId) {
  let error = new EMError();
  this._manager.destroyChatroom(chatroomId, error._error);
};

/**
 * Change chatroom's subject.
 * Note: ONLY chatroom's owner can change chatroom's subject.
 * @param {String} chatroomId     chatroom ID.
 * @param {String} newSubject     The new chatroom subject.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.changeChatroomSubject = function (chatroomId, newSubject) {
  let error = new EMError();
  return new EMChatroom(this._manager.changeChatroomSubject(chatroomId, newSubject, error._error));
};

/**
 * Change chatroom's description.
 * Note: ONLY chatroom's owner can change chatroom's description.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} newDescription     The new chatroom description.
 * @return {EMChatroom} The chatroom.
 */
EMChatroomManager.prototype.changeChatroomDescription = function (chatroomId, newDescription) {
  let error = new EMError();
  return new EMChatroom(this._manager.changeChatroomDescription(chatroomId, newDescription));
};

/**
 * Change chatroom's extension.
 * Note: ONLY chatroom's owner can change chatroom's extension.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} newExtension       The new chatroom extension.
 * @return {EMChatroom} The chatroom.
 */
EMChatroomManager.prototype.changeChatroomExtension = function (chatroomId, newExtension) {
  let error = new EMError();
  return new EMChatroom(this._manager.changeChatroomExtension(chatroomId, newExtension, error._error));
};

/**
 * Get chatroom's specifications.
 * @param {String} chatroomId         chatroom ID.
 * @param {Bool} fetchMembers         Wether to fetch members in the chatroom.
 * @return {EMChatroom} The chatroom.
 */
EMChatroomManager.prototype.fetchChatroomSpecification = function (chatroomId, fetchMembers) {
  let error = new EMError();
  return new EMChatroom(this._manager.fetchChatroomSpecification(chatroomId, error._error, fetchMembers));
};

/**
 * get chatroom members.
 * @param {String} chatroomId         chatroom ID.
 * @param {String} cursor             Page's cursor.
 * @param {Number} pageSize           Page size. ex. 20 for 20 objects.
 * @return {EMChatroom} The chatroom.
 */
EMChatroomManager.prototype.fetchChatroomMembers = function (chatroomId, cursor, pageSize) {
  let error = new EMError();
  return new EMStringCursorResult(this._manager.fetchChatroomMembers(chatroomId, cursor, pageSize, error._error));
};

/**
 * Join a chatroom.
 * @param {String} chatroomId         chatroom ID.
 * @return {EMChatroom} The chatroom.
 */
EMChatroomManager.prototype.joinChatroom = function (chatroomId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let chatroom = new EMChatroom(_manager.joinChatroom(chatroomId, error._error));
      return {
        code:error.errorCode,
        description:error.description,
        data:chatroom
      }
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
 * @return {void}
 */
EMChatroomManager.prototype.leaveChatroom = function (chatroomId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.leaveChatroom(chatroomId, error._error);
      return {
        code:error.errorCode,
        description:error.description
      }
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
 * @return {EMPageResult} The chatroom.
 */
EMChatroomManager.prototype.fetchChatroomsWithCursor = function (cursor, pageSize) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let cursor = new EMCursorResult(_manager.fetchChatroomsWithCursor(cursor, pageSize, error._error), 1);
      return {
        code:error.errorCode,
        description:error.description,
        data:cursor.result()
      }
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Get the chatroom by chatroom id.
 * @param {Number} pageNum          page number of pagination.
 * @param {Number} pageSize         Page size. ex. 20 for 20 objects.
 * @return {EMPageResult}
 */
EMChatroomManager.prototype.fetchChatroomsWithPage = function (pageNum, pageSize) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let cursor = new EMPageResult(_manager.fetchChatroomsWithPage(pageNum, pageSize, error._error), 1);
      return {
        code:error.errorCode,
        description:error.description,
        data:cursor.result()
      }
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Get the chatroom by chatroom id.
 * @param {String} chatroomId         chatroom ID.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.joinedChatroomById = function (chatroomId) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let chatroom = new EMChatroom(_manager.joinedChatroomById(chatroomId));
      return {
        code:error.errorCode,
        description:error.description,
        data:chatroom
      }
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * fetch chat room mute members.
 * Note: If PageNum=0, then there is no pagination and will get all the users on the list.
 * If PageNum=1, then will start from the first page of pagination.
 * @param {String} chatroomId       chatroom ID.
 * @param {Number} pageNum          page number of pagination.
 * @param {Number} pageSizePage     Page size. ex. 20 for 20 objects.
 * @return {Array} object list. The list of mute users. object like { "key" : name, "value" : 111 }.
 */
EMChatroomManager.prototype.fetchChatroomMutes = function (chatroomId, pageNum, pageSize) {
  let error = new EMError();
  let chatroom = this._manager.fetchChatroomMutes(chatroomId, pageNum, pageSize, error._error);
  return {
    code:error.errorCode,
    description:error.description,
    data:chatroom
  }
};

/**
 * fetch chat room blacklist members.
 * Note: If PageNum=0, then there is no pagination and will get all the users on the list.
 * If PageNum=1, then will start from the first page of pagination.
 * @param {String} chatroomId         chatroom ID.
 * @param {Number} pageNum            page number of pagination.
 * @param {Number} pageSize           Page size. ex. 20 for 20 objects.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.fetchChatroomBans = function (chatroomId, pageNum, pageSize) {
  let error = new EMError();
  let chatroom = this._manager.fetchChatroomBans(chatroomId, pageNum, pageSize, error._error);
  return {
    code:error.errorCode,
    description:error.description,
    data:chatroom
  }
};

/**
 * fetch chat room announcement.
 * @param {String} chatroomId         chatroom ID.
 * @return {EMChatroom}
 */
EMChatroomManager.prototype.fetchChatroomAnnouncement = function (chatroomId) {
  let error = new EMError();
  let chatroom =  this._manager.fetchChatroomAnnouncement(chatroomId, error._error);
  return {
    code:error.errorCode,
    description:error.description,
    data:chatroom
  }
};

module.exports = EMChatroomManager;