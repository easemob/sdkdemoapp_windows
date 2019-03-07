'use strict';

const easemobNode = require('./../load');
const EMError = require('./emerror');
const async = require('async');

/**
 * Easemob EMContactManager implementation.
 */

function EMContactManager(contactManager) {
  this._manager = contactManager;
}

/**
 * register contact status change listener.
 * @param {EMContactListener} listener
 * @return {void}
 */
EMContactManager.prototype.registerContactListener = function (listener) {
  this._manager.registerContactListener(listener._listener);
};

/**
 * remove registration of contact status change listener.
 * @param {EMContactListener} listener
 * @return {void}
 */
EMContactManager.prototype.removeContactListener = function (listener) {
  this._manager.removeContactListener(listener._listener);
};

/**
 * retrieve current user's friend list from server.
 * @return {Object}
 */
EMContactManager.prototype.allContacts = function () {
  let error = new EMError();
  let contactlist = this._manager.allContacts(error._error);
  return {
    code:error.errorCode,
    description:error.description,
    data:contactlist
  };
};

/**
 * retrieve current user's friend list from server.
 * @return {Object}
 */
EMContactManager.prototype.getContactsFromServer = function () {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let contactlist = _manager.getContactsFromServer(error._error);
      return {
        code:error.errorCode,
        description:error.description,
        data:contactlist
      }
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * invite contact to be friend, need contact accept.
 * @return {Object} String array
 */
EMContactManager.prototype.getContactsFromDB = function () {
  let error = new EMError();
  let contactlist = this._manager.getContactsFromDB(error._error);
  return {
    code:error.errorCode,
    description:error.description,
    data:contactlist
  };
};

/**
 * invite contact to be friend, need contact accept.
 * @param {String} username
 * @param {String} message
 * @return {Object}
 */
EMContactManager.prototype.inviteContact = function (username, message) {
  let error = new EMError();
  var _manager = this._manager;
  async function f(){
    try{
      _manager.inviteContact(username, message, error._error);
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
 * invite contact to be friend, need contact accept.
 * @param {String} username
 * @param {String} message
 * @return {Object}
 */
EMContactManager.prototype.deleteContact = function (username,keepConversation) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.deleteContact(username, error._error,keepConversation);
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
 * accept contact's invitation.
 * @param {String} username
 * @return {void}
 */
EMContactManager.prototype.acceptInvitation = function (username) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.acceptInvitation(username, error._error);
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
 * decline contact's invitation.
 * @param {String} username
 * @return {void}
 */
EMContactManager.prototype.declineInvitation = function (username) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.declineInvitation(username, error._error);
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
 * retrieve black list from memory.
 * @return {Array} String array
 */
EMContactManager.prototype.blacklist = function () {
  let error = new EMError();
  let memberlist = this._manager._manager.blacklist(error._error);
  return {
    code:error.errorCode,
    description:error.description,
    data:memberlist
  }
};

/**
 * retrieve black list from server.
 * @return {Array} String array
 */
EMContactManager.prototype.getBlackListFromServer = function () {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      let memberlist = _manager.getBlackListFromServer(error._error);
      return {
        code:error.errorCode,
        description:error.description,
        data:memberlist
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * save black list.
 * @param {Array} blacklist String array
 * @return {void}
 */
EMContactManager.prototype.saveBlackList = function (blacklist) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.saveBlackList(blacklist, error._error);
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
 * add contact to blacklist.
 * Note: both whether both side will be blocked, if true user also can not subscribe contact's presense. both = false is not work yet, current behaviour is both side conmunication will be blocded.
 * @param {String} username
 * @return {void}
 */
EMContactManager.prototype.addToBlackList = function (username) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.addToBlackList(username,true, error._error);
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
 * remove contact from black list.
 * @param {String} username
 * @return {void}
 */
EMContactManager.prototype.removeFromBlackList = function (username) {
  var _manager = this._manager;
  async function f(){
    try{
      let error = new EMError();
      _manager.removeFromBlackList(username, error._error);
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
 * get self id list on other platforms.
 * @param {Error} error
 * @return {Array} String
 */
EMContactManager.prototype.getSelfIdsOnOtherPlatform = function (error) {
  return this._manager.getSelfIdsOnOtherPlatform(error._error);
};

module.exports = EMContactManager;