'use strict';

const easemobNode = require('./../load');
const EMChatPrivateConfigs = require('./EMChatPrivateConfigs');

/**
 * Easemob EMChatconfigs implementation.
 */

/**
 * EMCallback constructor.
 * @constructor
 * @param {string} resourcePath 资源文件存储路径
 * @param {string} workPath 日志文件存储路径
 * @param {string} appKey appKey，官网应用申请得到
 * @param {Number} deviceId 设备ID，一般设为0
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
 * @param  {Bool} sortByServerTime 消息是否按服务器时间排序
 * @return {void}
 */
EMChatConfigs.prototype.setSortMessageByServerTime = function (sortByServerTime) {
  this._chatConfigs.setSortMessageByServerTime(sortByServerTime);
};

/**
 * get sort message by server time or not.
 * @return {Bool} 消息是否按服务器时间排序
 */
EMChatConfigs.prototype.getSortMessageByServerTime = function () {
  return this._chatConfigs.getSortMessageByServerTime();
};

/**
 * get the resource path.
 * @return {String} 返回资源存储路径
 */
EMChatConfigs.prototype.getResourcePath = function () {
  return this._chatConfigs.getResourcePath();
};

/**
 * get the work path.
 * @return {String} 返回工作路径
 */
EMChatConfigs.prototype.getWorkPath = function () {
  return this._chatConfigs.getWorkPath();
};

/**
 * set the log path.
 * @param {String} path 日志存储路径
 * @return {void}
 */
EMChatConfigs.prototype.setLogPath = function (path) {
  this._chatConfigs.setLogPath(path);
};

/**
 * get the log path.
 * @return {String} 返回日志存储路径
 */
EMChatConfigs.prototype.getLogPath = function () {
  return this._chatConfigs.getLogPath();
};

/**
 * set the download path.
 * @param {String} path 下载路径
 * @return {void}
 */
EMChatConfigs.prototype.setDownloadPath = function (path) {
  this._chatConfigs.setDownloadPath(path);
};

/**
 * get the download path.
 * @return {String} 返回下载路径
 */
EMChatConfigs.prototype.getDownloadPath = function () {
  return this._chatConfigs.getDownloadPath();
};

/**
 * set the app key.
 * @param {String} appKey 设置appKey
 * @return {void}
 */
EMChatConfigs.prototype.setAppKey = function (appKey) {
  this._chatConfigs.setAppKey(appKey);
};

/**
 * get the app key.
 * @return {String} 返回appKey
 */
EMChatConfigs.prototype.getAppKey = function () {
  return this._chatConfigs.getAppKey();
};

/**
 * set sandbox mode. default is false.
 * @param {Bool} b 设置是否沙盒模式
 * @return {void} 
 */
EMChatConfigs.prototype.setIsSandboxMode = function (b) {
  this._chatConfigs.setIsSandboxMode(b);
};

/**
 * get the sandbox mode.
 * @return {Bool} 获取是否沙盒模式
 */
EMChatConfigs.prototype.getIsSandboxMode = function () {
  return this._chatConfigs.getIsSandboxMode();
};

/**
 * set if output the log to console. default is false.
 * @param {Bool} b 设置是否输出日志到控制台
 * @return {void}
 */
EMChatConfigs.prototype.setEnableConsoleLog = function (b) {
  this._chatConfigs.setEnableConsoleLog(b);
};

/**
 * get if output the log to console.
 * @return {Bool} 获取是否输出日志到控制台
 */
EMChatConfigs.prototype.getEnableConsoleLog = function () {
  return this._chatConfigs.getEnableConsoleLog();
};

/**
 * set if auto accept friend invitation. default is false.
 * @param {Bool} b
 * @return {void} 设置是否自动同意好友申请
 */
EMChatConfigs.prototype.setAutoAcceptFriend = function (b) {
  this._chatConfigs.setAutoAcceptFriend(b);
};

/**
 * get if auto accept friend invitation.
 * @return {Bool} 获取是否自动同意好友申请
 */
EMChatConfigs.prototype.getAutoAcceptFriend = function () {
  return this._chatConfigs.getAutoAcceptFriend();
};

/**
 * set if auto accept group invitation. default is true.
 * @param {Bool} b 设置是否自动同意组邀请
 * @return {void}
 */
EMChatConfigs.prototype.setAutoAcceptGroup = function (b) {
  this._chatConfigs.setAutoAcceptGroup(b);
};

/**
 * get if auto accept group invitation.
 * @return {Bool} 获取是否自动同意组邀请
 */
EMChatConfigs.prototype.getAutoAcceptGroup = function () {
  return this._chatConfigs.getAutoAcceptGroup();
};

/**
 * set if need message read ack. default is true.
 * @param {Bool} b 设置消息是否需要已读确认
 * @return {void}
 */
EMChatConfigs.prototype.setRequireReadAck = function (b) {
  this._chatConfigs.setRequireReadAck(b);
};

/**
 * get if need message read ack.
 * @return {Bool} 获取消息是否需要已读确认
 */
EMChatConfigs.prototype.getRequireReadAck = function () {
  return this._chatConfigs.getRequireReadAck();
};

/**
 * set if need message delivery ack. default is false.
 * @param {Bool} b 设置消息传输是否需要到达确认
 * @return {void}
 */
EMChatConfigs.prototype.setRequireDeliveryAck = function (b) {
  this._chatConfigs.setRequireDeliveryAck(b);
};

/**
 * get if need message delivery ack.
 * @return {Bool} 获取消息传输是否需要到达确认
 */
EMChatConfigs.prototype.getRequireDeliveryAck = function () {
  return this._chatConfigs.getRequireDeliveryAck();
};

/**
 * set if need load all conversation when login. default is true.
 * @param {Bool} b 设置登录时是否自动加载所有会话
 * @return {void}
 */
EMChatConfigs.prototype.setAutoConversationLoaded = function (b) {
  this._chatConfigs.setAutoConversationLoaded(b);
};

/**
 * get if load all conversation when login.
 * @return {Bool} 获取登录时是否自动加载所有会话
 */
EMChatConfigs.prototype.getAutoConversationLoaded = function () {
  return this._chatConfigs.getAutoConversationLoaded();
};

/**
 * set if delete message when exit group. default is true.
 * @param {Bool} b 设置退出组时，是否删除消息
 * @return {void}
 */
EMChatConfigs.prototype.setDeleteMessageAsExitGroup = function (b) {
  this._chatConfigs.setDeleteMessageAsExitGroup(b);
};

/**
 * get if delete message when exit group.
 * @return {Bool} 获取退出组时，是否删除消息
 */
EMChatConfigs.prototype.getDeleteMessageAsExitGroup = function () {
  return this._chatConfigs.getDeleteMessageAsExitGroup();
};

/**
 * set if chatroom owner can leave. default is true.
 * @param {Bool} b 设置聊天室所有人是否可以退出
 * @return {void} 
 */
EMChatConfigs.prototype.setIsChatroomOwnerLeaveAllowed = function (b) {
  this._chatConfigs.setIsChatroomOwnerLeaveAllowed(b);
};

/**
 * get if chatroom owner can leave.
 * @return {Bool} 获取聊天室所有人是否可以退出
 */
EMChatConfigs.prototype.getIsChatroomOwnerLeaveAllowed = function () {
  return this._chatConfigs.getIsChatroomOwnerLeaveAllowed();
};

/**
 * set the number of message load at first time. default is 20.
 * @param {Number} num 设置会话默认加载的消息条数
 * @return {void}
 */
EMChatConfigs.prototype.setNumOfMessageLoaded = function (num) {
  this._chatConfigs.setNumOfMessageLoaded(num);
};

/**
 * get the number of message load at first time.
 * @return {Number} 获取会话默认加载的消息条数
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
 * @param {Number} osType 设置操作系统类型，0为IOS，1为ANDROID，2为LINUX，3为mac，4为win，16为其他
 * @return {void}
 */
EMChatConfigs.prototype.setOs = function (osType) {
  this._chatConfigs.setOs(osType);
};

/**
 * get os type.
 * @return {Number} 获取操作系统类型
 */
EMChatConfigs.prototype.getOs = function () {
  return this._chatConfigs.getOs();
};

/**
 * set os version.
 * @param {String} osVersion 设置操作系统版本
 * @return {void}
 */
EMChatConfigs.prototype.setOsVersion = function (osVersion) {
  this._chatConfigs.setOsVersion(osVersion);
};

/**
 * return os version.
 * @return {String} 获取操作系统版本
 */
EMChatConfigs.prototype.getOsVersion = function () {
  return this._chatConfigs.getOsVersion();
};

/**
 * set sdk version.
 * @param {String} version 设置sdk版本
 * @return {void}
 */
EMChatConfigs.prototype.setSdkVersion = function (version) {
  this._chatConfigs.setSdkVersion(version);
};

/**
 * return sdk version.
 * @return {String} 返回sdk版本
 */
EMChatConfigs.prototype.getSdkVersion = function () {
  return this._chatConfigs.getSdkVersion();
};

/**
 * return device unique id.
 * @return {Number} 返回设备ID
 */
EMChatConfigs.prototype.getDeviceID = function () {
  return this._chatConfigs.getDeviceID();
};

/**
 * set client resource.
 * @param {String} resource 设置客户端Resouce
 * @return {void}
 */
EMChatConfigs.prototype.setClientResource = function (resource) {
  this._chatConfigs.setClientResource(resource);
};

/**
 * get client resource.
 * @return {String} 返回客户端Resouce
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
 * @param {Number} level 设置日志输出等级
 * @return {void}
 */
EMChatConfigs.prototype.setLogLevel = function (level) {
  this._chatConfigs.setLogLevel(level);
};

/**
 * get device unique id.
 * @return {String} 返回设备ID
 */
EMChatConfigs.prototype.deviceUuid = function () {
  return this._chatConfigs.deviceUuid();
};

/**
 * set device name.
 * @param {String} name 设置设备名称
 * @return {void}
 */
EMChatConfigs.prototype.setDeviceName = function (name) {
  this._chatConfigs.setDeviceName(name);
};

/**
 * return device name.
 * @return {String} 返回设备名称
 */
EMChatConfigs.prototype.getDeviceName = function () {
  return this._chatConfigs.getDeviceName();
};

//privateConfigs
/**
 * return private config EMChatPrivateConfigs. used for im private deploy.
 * @return {EMChatPrivateConfigs} 返回系统设置
 */
EMChatConfigs.prototype.privateConfigs = function () {
  return new EMChatPrivateConfigs(this._chatConfigs.privateConfigs());
};

/**
 * set delete messages as exit chatroom. default is true.
 * @param {Bool} b 设置退出聊天室时，是否删除消息
 * @return {void}
 */
EMChatConfigs.prototype.setDeleteMessageAsExitChatRoom = function (b) {
  this._chatConfigs.setDeleteMessageAsExitChatRoom(b);
};

/**
 * get delete messages as exit chatroom.
 * @return {Bool} 返回退出聊天室时，是否退出消息
 */
EMChatConfigs.prototype.getDeleteMessageAsExitChatRoom = function () {
  return this._chatConfigs.getDeleteMessageAsExitChatRoom();
};

/**
 * set using https only. default is false.
 * @param {Bool} httpsOnly 设置是否只支持https协议
 * @return {void}
 */
EMChatConfigs.prototype.setUsingHttpsOnly = function (httpsOnly) {
  this._chatConfigs.setUsingHttpsOnly(httpsOnly);
};

/**
 * get using https only.
 * @return {Bool} 返回是否只支持https协议
 */
EMChatConfigs.prototype.getUsingHttpsOnly = function () {
  return this._chatConfigs.getUsingHttpsOnly();
};

/**
 * set dns url.
 * @param {String} url 设置dns地址
 * @return {void}
 */
EMChatConfigs.prototype.setDnsURL = function (url) {
  this._chatConfigs.setDnsURL(url);
};

/**
 * get dns url.
 * @return {String} 返回dns地址
 */
EMChatConfigs.prototype.getDnsURL = function () {
  return this._chatConfigs.getDnsURL();
};

/**
 * set transfer attachments or not. default is true.
 * @param {Bool} transfer 设置是否传输附件
 * @return {void}
 */
EMChatConfigs.prototype.setTransferAttachments = function (transfer) {
  this._chatConfigs.setTransferAttachments(transfer);
};

/**
 * get transfer attachments or not.
 * @return {Bool} 返回是否传输附件
 */
EMChatConfigs.prototype.getTransferAttachments = function () {
  return this._chatConfigs.getTransferAttachments();
};

/**
 * set auto download thumbnail attachments or not. default is true.
 * @param {Bool} autoDownload 设置是否自动下载附件
 * @return {void}
 */
EMChatConfigs.prototype.setAutoDownloadThumbnail = function (autoDownload) {
  this._chatConfigs.setAutoDownloadThumbnail(autoDownload);
};

/**
 * get auto download thumbnail or not.
 * @return {Bool} 返回是否自动下载附件
 */
EMChatConfigs.prototype.getAutoDownloadThumbnail = function () {
  return this._chatConfigs.getAutoDownloadThumbnail();
};

module.exports = EMChatConfigs;