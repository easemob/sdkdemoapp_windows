'use strict';

const easemobNode = require('./../load');
const EMError = require('./emerror');
const EMChatConfigs = require('./emchatconfig');
const EMContactManager = require('./emcontactmanager');
const EMChatManager = require('./emchatmanager');
const EMGroupManager = require('./emgroupmanager');
const EMChatroomManager = require('./EMChatroomManager');
const async = require('async');
const fs = require("fs")
/**
 * Easemob EMClient implementation.
 */

/**
 * EMClient constructor.
 * @constructor
 * @param {Object} chatConfigs EMChatConfigs
 */
function EMClient(chatConfigs,autoLogin) {
  this._emclient = easemobNode.createEMClient(chatConfigs._chatConfigs);
  if(autoLogin)
  {
    console.log("autologin");
    var _emclient = this._emclient;
    // 异步读取
    let configs = new EMChatConfigs(_emclient.getChatConfigs());
    fs.readFile(configs.getWorkPath() +'/easemobkey.json', function (err, data) {
      console.log("filedata:" + data);
    if (err) {
        console.error(err);
    }else{
      let info = JSON.parse(data);
      if(info.username && info.password)
      {
        let ret = new EMError(_emclient.login(info.username, info.password));
        if(ret.errorCode ==0)
           console.log("autologin success");
        else
           console.log("autologin fail:" + ret.description);
      }
    }
  });
  }
}

/**
 * Login with username and password.
 * @param {String} username
 * @param {String} password
 * @return {result}
 */
EMClient.prototype.login = function (username, password) {
  var _emclient = this._emclient;
  async function f(){
    try{
      let error = new EMError(_emclient.login(username, password));
      let info = {username,password};
      let configs = new EMChatConfigs(_emclient.getChatConfigs());
      fs.writeFile(configs.getWorkPath() + "/easemobkey.json",JSON.stringify(info),(err) => {
      if(err)
        console.log(err);
    });
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
 * Login with username and token.
 * @param {String} username
 * @param {String} token
 * @return {EMError}
 */
EMClient.prototype.loginWithToken = function (username, token) {
  var _emclient = this._emclient;
  async function f(){
    try{
      let error = new EMError(_emclient.loginWithToken(username, token));
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
 * Logout current user.
 * @return {EMError}
 */
EMClient.prototype.logout = function () {
  var _emclient = this._emclient;
  async function f(){
    try{
      _emclient.logout();
      let configs = new EMChatConfigs(_emclient.getChatConfigs());
      fs.unlink(configs.getWorkPath() + "/easemobkey.json",(err)=>{
        if (err) {
          return console.error(err);
        }
      });
      return {
        code:0,
        description:""
      };
    }catch(err)
    {
      console.log(err);
    }
  }
  return f();
};

/**
 * Logout current user.
 *EMLoginInfo.loginUser() login user name. {String}
 *EMLoginInfo.loginPassword() login user password. {String}
 *EMLoginInfo.loginToken() login user token. {String}
 * @return {EMLoginInfo}
 */
EMClient.prototype.getLoginInfo = function () {
  let logininfo = this._emclient.getLoginInfo();
  return {
    loginUser:logininfo.loginUser(),
    loginPassword:logininfo.loginPassword(),
    loginToken:logininfo.loginToken()
  }
};

/**
 * change appkey only when user not logged in.
 * @param {String} appKey
 * @return {EMError}
 */
EMClient.prototype.changeAppkey = function (appKey) {
  let error = new EMError(this._emclient.changeAppkey(appKey));
  return {
    code:error.errorCode,
    description:error.description
  };
};

/**
 * register connection listener.
 * @param {EMConnectionListener} listener
 * @return {void}
 */
EMClient.prototype.addConnectionListener = function (listener) {
  this._emclient.addConnectionListener(listener._listener);
};

/**
 * remove connection listener.
 * @param {EMConnectionListener} listener
 * @return {void}
 */
EMClient.prototype.removeConnectionListener = function (listener) {
  this._emclient.removeConnectionListener(listener._listener);
};

/**
 * Register a new account with user name and password.
 * @param {String} username
 * @param {String} password
 * @return {EMError}
 */
EMClient.prototype.createAccount = function (username, password) {
  var _emclient = this._emclient;
  async function f(){
    try{
      let error = new EMError(_emclient.createAccount(username, password));
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
 * get the chat configs.
 * @return {EMChatConfigs}
 */
EMClient.prototype.getChatConfigs = function () {
  return new EMChatConfigs(this._emclient.getChatConfigs());
};

/**
 * Get chat manager to handle the message operation.
 * @return {EMChatManager}
 */
EMClient.prototype.getChatManager = function () {
  return new EMChatManager(this._emclient.getChatManager());
};

/**
 * Get contact manager to manage the contacts.
 * @return {EMContactManager}
 */
EMClient.prototype.getContactManager = function () {
  return new EMContactManager(this._emclient.getContactManager());
};

/**
 * Get group manager to manage the group.
 * @return {EMGroupManager}
 */
EMClient.prototype.getGroupManager = function () {
  return new EMGroupManager(this._emclient.getGroupManager());
};

/**
 * Get chatroom manager to manage the chatroom.
 * @return {EMChatroomManager}
 */
EMClient.prototype.getChatroomManager = function () {
  return new EMChatroomManager(this._emclient.getChatroomManager());
};

/**
 * register multi devices listener.
 * @param {EMMultiDevicesListener} listener
 * @return {void}
 */
EMClient.prototype.addMultiDevicesListener = function (listener) {
  this._emclient.addMultiDevicesListener(listener._listener);
};

/**
 * remove register multi devices listener.
 * @param {EMMultiDevicesListener} listener
 * @return {void}
 */
EMClient.prototype.removeMultiDevicesListener = function (listener) {
  this._emclient.removeMultiDevicesListener(listener._listener);
};

/**
 * clear all register multi devices listener.
 * @return {void}
 */
EMClient.prototype.clearAllMultiDevicesListeners = function () {
  this._emclient.clearAllMultiDevicesListeners();
};

/**
 * Forced to logout the specified logged in device. return an array of EMDeviceInfo.
 * EMDeviceInfo.resource device resource.
 * EMDeviceInfo.deviceUUID device uuid.
 * EMDeviceInfo.deviceName device name.
 * @param {String} username
 * @param {String} password
 * @param {String} error
 * @return {Array} EMDeviceInfo
 */
EMClient.prototype.getLoggedInDevicesFromServer = function (username, password, error) {
  return this._emclient.getLoggedInDevicesFromServer(username, password, error._error);
};

/**
 * Forced to logout the specified logged in device.
 * @param {String} username
 * @param {String} password
 * @param {String} resource
 * @param {String} error
 * @return {void}
 */
EMClient.prototype.kickDevice = function (username, password, resource, error) {
  this._emclient.kickDevice(username, password, resource, error._error);
};

/**
 * Forced to logout all logged in device.
 * @param {String} username
 * @param {String} password
 * @param {String} error
 * @return {void}
 */
EMClient.prototype.kickAllDevices = function (username, password, error) {
  this._emclient.kickAllDevices(username, password, error._error);
};

/**
 * call this method to notify SDK the network change.
 * @param {Number} to
 * @param {Bool} forceReconnect
 * @return {void}
 * {
 * NONE = 0
 * CABLE = 1,
 * WIFI = 2,
 * MOBILE = 3
 * }
 */
EMClient.prototype.onNetworkChanged = function (to, forceReconnect) {
  this._emclient.onNetworkChanged(to, forceReconnect);
};

/**
 * reconnect client.
 * @return {void}
 */
EMClient.prototype.reconnect = function () {
  this._emclient.reconnect();
};

/**
 * disconnect client.
 * @return {void}
 */
EMClient.prototype.disconnect = function () {
  this._emclient.disconnect();
};

module.exports = EMClient;