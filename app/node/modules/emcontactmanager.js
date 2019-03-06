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
 * @param {Error} error
 * @return {Array} String array
 */
EMContactManager.prototype.allContacts = function (error) {
  return this._manager.allContacts(error._error);
};

/**
 * retrieve current user's friend list from server.
 * @param {Error} error
 * @return {Array} String array
 */
EMContactManager.prototype.getContactsFromServer = function (error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.getContactsFromServer(error._error);
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * invite contact to be friend, need contact accept.
 * @param {Error} error
 * @return {Array} String array
 */
EMContactManager.prototype.getContactsFromDB = function (error) {
  return this._manager.getContactsFromDB(error._error);
};

/**
 * invite contact to be friend, need contact accept.
 * @param {String} username
 * @param {String} message
 * @param {Error} error
 * @return {void}
 */
EMContactManager.prototype.inviteContact = function (username, message, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.inviteContact(username, message, error._error);
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
 * @param {Error} error
 * @return {void}
 */
EMContactManager.prototype.deleteContact = function (username, error,keepConversation) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.deleteContact(username, error._error,keepConversation);
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
 * @param {Error} error
 * @return {void}
 */
EMContactManager.prototype.acceptInvitation = function (username, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.acceptInvitation(username, error._error);
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
 * @param {Error} error
 * @return {void}
 */
EMContactManager.prototype.declineInvitation = function (username, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.declineInvitation(username, error._error);
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * retrieve black list from memory.
 * @param {Error} error
 * @return {Array} String array
 */
EMContactManager.prototype.blacklist = function (error) {
  return this._manager._manager.blacklist(error._error);
};

/**
 * retrieve black list from server.
 * @param {Error} error
 * @return {Array} String array
 */
EMContactManager.prototype.getBlackListFromServer = function (error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.getBlackListFromServer(error._error);
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * retrieve black list from local database.
 * @param {Error} error
 * @return {Array} String array
 */
EMContactManager.prototype.getBlackListFromDB = function (error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.getBlackListFromDB(error._error);
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
 * @param {Error} error
 * @return {void}
 */
EMContactManager.prototype.saveBlackList = function (blacklist, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.saveBlackList(blacklist, error._error);
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
 * @param {Bool} both
 * @param {Error} error
 * @return {void}
 */
EMContactManager.prototype.addToBlackList = function (username, both, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.addToBlackList(username, both, error._error);
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
 * @param {Error} error
 * @return {void}
 */
EMContactManager.prototype.removeFromBlackList = function (username, error) {
  var _manager = this._manager;
  async function f(){
    try{
      return _manager.removeFromBlackList(username, error._error);
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