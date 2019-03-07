'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMChatconfigs implementation.
 */

/**
 * EMCallback constructor.
 * @constructor
 * @param {string} resourcePath
 * @param {string} workPath
 * @param {string} appKey
 * @param {Number} deviceId
 */
function EMChatConfigs(resourcePath, workPath, appKey, deviceId) {
  if (arguments.length > 1) {
    this._chatConfigs = new easemobNode.EMChatConfigs(resourcePath, workPath, appKey, deviceId);
  } else {
    this._chatConfigs = arguments[0];
  }
}

/**
 * set sort message by server time or not. default is true.
 * @param  {Bool} sortByServerTime
 * @return {void}
 */
EMChatConfigs.prototype.setSortMessageByServerTime = function (sortByServerTime) {
  this._chatConfigs.setSortMessageByServerTime(sortByServerTime);
};

/**
 * get sort message by server time or not.
 * @return {Bool}
 */
EMChatConfigs.prototype.getSortMessageByServerTime = function () {
  return this._chatConfigs.getSortMessageByServerTime();
};

/**
 * get the resource path.
 * @return {String}
 */
EMChatConfigs.prototype.getResourcePath = function () {
  return this._chatConfigs.getResourcePath();
};

/**
 * get the work path.
 * @return {String}
 */
EMChatConfigs.prototype.getWorkPath = function () {
  return this._chatConfigs.getWorkPath();
};

/**
 * set the log path.
 * @param {String} path
 * @return {void}
 */
EMChatConfigs.prototype.setLogPath = function (path) {
  this._chatConfigs.setLogPath(path);
};

/**
 * get the log path.
 * @return {String}
 */
EMChatConfigs.prototype.getLogPath = function () {
  return this._chatConfigs.getLogPath();
};

/**
 * set the download path.
 * @param {String} path
 * @return {void}
 */
EMChatConfigs.prototype.setDownloadPath = function (path) {
  this._chatConfigs.setDownloadPath(path);
};

/**
 * get the download path.
 * @return {String}
 */
EMChatConfigs.prototype.getDownloadPath = function () {
  return this._chatConfigs.getDownloadPath();
};

/**
 * set the app key.
 * @param {String} path
 * @return {void}
 */
EMChatConfigs.prototype.setAppKey = function (appKey) {
  this._chatConfigs.setAppKey(appKey);
};

/**
 * get the app key.
 * @return {String}
 */
EMChatConfigs.prototype.getAppKey = function () {
  return this._chatConfigs.getAppKey();
};

/**
 * set sandbox mode. default is false.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setIsSandboxMode = function (b) {
  this._chatConfigs.setIsSandboxMode(b);
};

/**
 * get the sandbox mode.
 * @return {Bool}
 */
EMChatConfigs.prototype.getIsSandboxMode = function () {
  return this._chatConfigs.getIsSandboxMode();
};

/**
 * set if output the log to console. default is false.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setEnableConsoleLog = function (b) {
  this._chatConfigs.setEnableConsoleLog(b);
};

/**
 * get if output the log to console.
 * @return {Bool}
 */
EMChatConfigs.prototype.getEnableConsoleLog = function () {
  return this._chatConfigs.getEnableConsoleLog();
};

/**
 * set if auto accept friend invitation. default is false.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setAutoAcceptFriend = function (b) {
  this._chatConfigs.setAutoAcceptFriend(b);
};

/**
 * get if auto accept friend invitation.
 * @return {Bool}
 */
EMChatConfigs.prototype.getAutoAcceptFriend = function () {
  return this._chatConfigs.getAutoAcceptFriend();
};

/**
 * set if auto accept group invitation. default is true.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setAutoAcceptGroup = function (b) {
  this._chatConfigs.setAutoAcceptGroup(b);
};

/**
 * get if auto accept group invitation.
 * @return {Bool}
 */
EMChatConfigs.prototype.getAutoAcceptGroup = function () {
  return this._chatConfigs.getAutoAcceptGroup();
};

/**
 * set if need message read ack. default is true.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setRequireReadAck = function (b) {
  this._chatConfigs.setRequireReadAck(b);
};

/**
 * get if need message read ack.
 * @return {Bool}
 */
EMChatConfigs.prototype.getRequireReadAck = function () {
  return this._chatConfigs.getRequireReadAck();
};

/**
 * set if need message delivery ack. default is false.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setRequireDeliveryAck = function (b) {
  this._chatConfigs.setRequireDeliveryAck(b);
};

/**
 * get if need message delivery ack.
 * @return {Bool}
 */
EMChatConfigs.prototype.getRequireDeliveryAck = function () {
  return this._chatConfigs.getRequireDeliveryAck();
};

/**
 * set if need load all conversation when login. default is true.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setAutoConversationLoaded = function (b) {
  this._chatConfigs.setAutoConversationLoaded(b);
};

/**
 * get if load all conversation when login.
 * @return {Bool}
 */
EMChatConfigs.prototype.getAutoConversationLoaded = function () {
  return this._chatConfigs.getAutoConversationLoaded();
};

/**
 * set if delete message when exit group. default is true.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setDeleteMessageAsExitGroup = function (b) {
  this._chatConfigs.setDeleteMessageAsExitGroup(b);
};

/**
 * get if delete message when exit group.
 * @return {Bool}
 */
EMChatConfigs.prototype.getDeleteMessageAsExitGroup = function () {
  return this._chatConfigs.getDeleteMessageAsExitGroup();
};

/**
 * set if chatroom owner can leave. default is true.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setIsChatroomOwnerLeaveAllowed = function (b) {
  this._chatConfigs.setIsChatroomOwnerLeaveAllowed(b);
};

/**
 * get if chatroom owner can leave.
 * @return {Bool}
 */
EMChatConfigs.prototype.getIsChatroomOwnerLeaveAllowed = function () {
  return this._chatConfigs.getIsChatroomOwnerLeaveAllowed();
};

/**
 * set the number of message load at first time. default is 20.
 * @param {Number} b
 * @return {void}
 */
EMChatConfigs.prototype.setNumOfMessageLoaded = function (num) {
  this._chatConfigs.setNumOfMessageLoaded(num);
};

/**
 * get the number of message load at first time.
 * @return {Number}
 */
EMChatConfigs.prototype.getNumOfMessageLoaded = function () {
  return this._chatConfigs.getNumOfMessageLoaded();
};

/**
 * set os type. default data is 2, type is Linux.
 * {
 * OS_IOS = 0,
 * OS_ANDROID = 1,
 * OS_LINUX   = 2,
 * OS_OSX     = 3,
 * OS_MSWIN   = 4,
 * OS_OTHER   = 16,
 * }
 * @param {Number} osType
 * @return {void}
 */
EMChatConfigs.prototype.setOs = function (osType) {
  this._chatConfigs.setOs(osType);
};

/**
 * get os type.
 * @return {Number}
 */
EMChatConfigs.prototype.getOs = function () {
  return this._chatConfigs.getOs();
};

/**
 * set os version.
 * @param {String} osVersion
 * @return {void}
 */
EMChatConfigs.prototype.setOsVersion = function (osVersion) {
  this._chatConfigs.setOsVersion(osVersion);
};

/**
 * return os version.
 * @return {String}
 */
EMChatConfigs.prototype.getOsVersion = function () {
  return this._chatConfigs.getOsVersion();
};

/**
 * set sdk version.
 * @param {String} version
 * @return {void}
 */
EMChatConfigs.prototype.setSdkVersion = function (version) {
  this._chatConfigs.setSdkVersion(version);
};

/**
 * return sdk version.
 * @return {String}
 */
EMChatConfigs.prototype.getSdkVersion = function () {
  return this._chatConfigs.getSdkVersion();
};

/**
 * return device unique id.
 * @return {Number}
 */
EMChatConfigs.prototype.getDeviceID = function () {
  return this._chatConfigs.getDeviceID();
};

/**
 * set client resource.
 * @param {String} resource
 * @return {void}
 */
EMChatConfigs.prototype.setClientResource = function (resource) {
  this._chatConfigs.setClientResource(resource);
};

/**
 * get client resource.
 * @return {String}
 */
EMChatConfigs.prototype.clientResource = function () {
  return this._chatConfigs.clientResource();
};

/**
 * set log output level. default is DEBUG_LEVEL.
 * {
 * DEBUG_LEVEL = 0,
 * WARNING_LEVEL = 1,
 * ERROR_LEVEL = 2
 * }
 * @param {Number} level
 * @return {void}
 */
EMChatConfigs.prototype.setLogLevel = function (level) {
  this._chatConfigs.setLogLevel(level);
};

/**
 * get device unique id.
 * @return {String}
 * @return {void}
 */
EMChatConfigs.prototype.deviceUuid = function () {
  return this._chatConfigs.deviceUuid();
};

/**
 * set device name.
 * @param {String} resource
 * @return {void}
 */
EMChatConfigs.prototype.setDeviceName = function (name) {
  this._chatConfigs.setDeviceName(name);
};

/**
 * return device name.
 * @return {String}
 */
EMChatConfigs.prototype.getDeviceName = function () {
  return this._chatConfigs.getDeviceName();
};

//privateConfigs
/**
 * return private config EMChatPrivateConfigs. used for im private deploy.
 * EMChatPrivateConfigs.enableDns enable dns ot not. {Bool}
 * EMChatPrivateConfigs.chatServer IM server ip. {String}
 * EMChatPrivateConfigs.chatPort IM server port. {Number}
 * EMChatPrivateConfigs.restServer rest server ip and port. {String}
 * EMChatPrivateConfigs.resolverServer resolver server address. {String}
 * EMChatPrivateConfigs.chatDomain char domain. {String}
 * EMChatPrivateConfigs.groupDomain group domain. {String}
 * @return {EMChatPrivateConfigs}
 */
EMChatConfigs.prototype.privateConfigs = function () {
  return this._chatConfigs.privateConfigs();
};

/**
 * set delete messages as exit chatroom. default is true.
 * @param {Bool} b
 * @return {void}
 */
EMChatConfigs.prototype.setDeleteMessageAsExitChatRoom = function (b) {
  this._chatConfigs.setDeleteMessageAsExitChatRoom(b);
};

/**
 * get delete messages as exit chatroom.
 * @return {Bool}
 */
EMChatConfigs.prototype.getDeleteMessageAsExitChatRoom = function () {
  return this._chatConfigs.getDeleteMessageAsExitChatRoom();
};

/**
 * set using https only. default is false.
 * @param {Bool} httpsOnly
 * @return {void}
 */
EMChatConfigs.prototype.setUsingHttpsOnly = function (httpsOnly) {
  this._chatConfigs.setUsingHttpsOnly(httpsOnly);
};

/**
 * get using https only.
 * @return {Bool}
 */
EMChatConfigs.prototype.getUsingHttpsOnly = function () {
  return this._chatConfigs.getUsingHttpsOnly();
};

/**
 * set dns url.
 * @param {String} url
 * @return {void}
 */
EMChatConfigs.prototype.setDnsURL = function (url) {
  this._chatConfigs.setDnsURL(url);
};

/**
 * get dns url.
 * @return {String}
 */
EMChatConfigs.prototype.getDnsURL = function () {
  return this._chatConfigs.getDnsURL();
};

/**
 * set transfer attachments or not. default is true.
 * @param {Bool} transfer
 * @return {void}
 */
EMChatConfigs.prototype.setTransferAttachments = function (transfer) {
  this._chatConfigs.setTransferAttachments(transfer);
};

/**
 * get transfer attachments or not.
 * @return {Bool}
 */
EMChatConfigs.prototype.getTransferAttachments = function () {
  return this._chatConfigs.getTransferAttachments();
};

/**
 * set auto download thumbnail attachments or not. default is true.
 * @param {Bool} autoDownload
 * @return {void}
 */
EMChatConfigs.prototype.setAutoDownloadThumbnail = function (autoDownload) {
  this._chatConfigs.setAutoDownloadThumbnail(autoDownload);
};

/**
 * get auto download thumbnail or not.
 * @return {Bool}
 */
EMChatConfigs.prototype.getAutoDownloadThumbnail = function () {
  return this._chatConfigs.getAutoDownloadThumbnail();
};

module.exports = EMChatConfigs;