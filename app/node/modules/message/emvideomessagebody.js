'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMVideoMessageBody implementation.
 */
/**
 * Video size constructor.
 * @constructor
 * @param {Number} width 视频宽
 * @param {Number} height 视频高
 */
function EMVideoSize (width, height) {
  this._size = new easemobNode.EMVideoSize(width, height);
  Object.defineProperties(this, {
    width: {
      get: function () {
        return this._size.width;
      }, 
      set: function (width) {
        this._size.width = width;
      }
    },
    height: {
      get: function () {
        return this._size.height;
      },
      set: function (height) {
        this._size.height = height;
      }
    }
  });
}

/**
 * Video message body constructor.
 * @constructor
 * @param {String} localPath 视频本地位置
 * @param {String} thumbnailLocalPath 视频缩略图本地位置
 */
function EMVideoMessageBody(localPath, thumbnailLocalPath) {
  this._body = new easemobNode.EMVideoMessageBody(localPath, thumbnailLocalPath);
}

/**
 * Get message body type.
 * @return {Number} 返回消息类型
 */
EMVideoMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Set display name of the attachment.
 * @param {String} displayName 消息展示名
 * @return {void}
 */
EMVideoMessageBody.prototype.setDisplayName = function (displayName) {
  this._body.setDisplayName(displayName);
};

/**
 * Get display name of the attachment.
 * @return {String} 返回消息展示名
 */
EMVideoMessageBody.prototype.displayName = function () {
  return this._body.displayName();
};

/**
 * Set local path of the attachment.
 * Note: should NOT change the local path of the Received message.
 * @param {String} localPath 消息本地存储路径
 * @return {void}
 */
EMVideoMessageBody.prototype.setLocalPath = function (localPath) {
  this._body.setLocalPath(localPath);
};

/**
 * Get local path of the attachment.
 * @return {String} 返回消息本地存储路径
 */
EMVideoMessageBody.prototype.localPath = function () {
  return this._body.localPath();
};

/**
 * Set remote path of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} remotePath 消息在服务器存储路径
 * @return {void}
 */
EMVideoMessageBody.prototype.setRemotePath = function (remotePath) {
  this._body.setRemotePath(remotePath);
};

/**
 * Get remote path of the attachment.
 * @return {String} 返回消息在服务器存储路径
 */
EMVideoMessageBody.prototype.remotePath = function () {
  return this._body.remotePath();
};

/**
 * Set secret key of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} secretKey 消息加密密钥
 * @return {void}
 */
EMVideoMessageBody.prototype.setSecretKey = function (secretKey) {
  this._body.setSecretKey(secretKey)
};

/**
 * Get secret key of the attachment, it's used to download attachment from server.
 * @return {String} 返回消息加密密钥
 */
EMVideoMessageBody.prototype.secretKey = function () {
  return this._body.secretKey();
};

/**
 * Set file length of the attachment.
 * Note: It's usually not necessary to call this method, will calculate file length automatically when setting local path.
 * @param {Number} fileLength 文件长度
 * @return {void}
 */
EMVideoMessageBody.prototype.setFileLength = function (fileLength) {
  this._body.setFileLength(fileLength);
};

/**
 * Get file length of the attachment.
 * @return {Number} 返回文件长度
 */
EMVideoMessageBody.prototype.fileLength = function () {
  return this._body.fileLength();
};

/**
 * Set file downloading status.
 * Note: Usually, user should NOT call this method directly.
 * @param {Number} downloadStatus 文件下载状态
 * @return {void}
 */
EMVideoMessageBody.prototype.setDownloadStatus = function (downloadStatus) {
  this._body.setDownloadStatus(downloadStatus);
};

/**
 * Get file downloading status
 * @return {Number} 返回文件下载状态
 */
EMVideoMessageBody.prototype.downloadStatus = function () {
  return this._body.downloadStatus();
};

/**
 * Set local path of the thumbnail.
 * @param {String} thumbnailLocalPath 缩略图本地存储路径
 * @return {void}
 */
EMVideoMessageBody.prototype.setThumbnailLocalPath = function (thumbnailLocalPath) {
  this._body.setThumbnailLocalPath(thumbnailLocalPath);
};

/**
 * Get local path of the thumbnail.
 * @return {String} 返回缩略图本地存储路径
 */
EMVideoMessageBody.prototype.thumbnailLocalPath = function () {
  return this._body.thumbnailLocalPath();
};

/**
 * Set remote path of the thumbnail.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} thumbnailRemotePath 缩略图在服务器的存储路径
 * @return {void}
 */
EMVideoMessageBody.prototype.setThumbnailRemotePath = function (thumbnailRemotePath) {
  this._body.setThumbnailRemotePath(thumbnailRemotePath);
};

/**
 * Get remote path of the thumbnail.
 * @return {String} 返回缩略图在服务器的存储路径
 */
EMVideoMessageBody.prototype.thumbnailRemotePath = function () {
  return this._body.thumbnailRemotePath();
};

/**
 * Set secret key of the thumbnail.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} thumbnailKey 缩略图加密密钥
 * @return {void}
 */
EMVideoMessageBody.prototype.setThumbnailSecretKey = function (thumbnailKey) {
  this._body.setThumbnailSecretKey(thumbnailKey);
};

/**
 * Get secret key of the thumbnail.
 * @return {String} 返回缩略图加密密钥
 */
EMVideoMessageBody.prototype.thumbnailSecretKey = function () {
  return this._body.thumbnailSecretKey();
};

/**
 * Set download status of the thumbnail.
 * Note: Usually, user should NOT call this method directly.
 * @param {Number} thumbnailDownloadStatus 缩略图下载状态
 * @return {void}
 */
EMVideoMessageBody.prototype.setThumbnailDownloadStatus = function (thumbnailDownloadStatus) {
  this._body.setThumbnailDownloadStatus(thumbnailDownloadStatus);
};

/**
 * Get download status of the thumbnail.
 * @return {Number} 返回缩略图下载状态
 */
EMVideoMessageBody.prototype.thumbnailDownloadStatus = function () {
  return this._body.thumbnailDownloadStatus();
};

/**
 * Set size of the thumbnail.
 * @param {EMVideoSize} size 视频大小
 * @return {void}
 */
EMVideoMessageBody.prototype.setSize = function (size) {
  this._body.setSize(size._size);
};

/**
 * Get size of the thumbnail.
 * @return {EMVideoSize} 返回视频大小
 */
EMVideoMessageBody.prototype.size = function () {
  return new EMVideoSize(this._body.size().width, this._body.size().height);
};

/**
 * Set playing duration of the video.
 * @param {Number} duration 视频持续时间
 * @return {void}
 */
EMVideoMessageBody.prototype.setDuration = function (duration) {
  this._body.setDuration(duration);
};

/**
 * Get playing duration of the video.
 * @return {Number} 返回视频持续时间
 */
EMVideoMessageBody.prototype.duration = function () {
  return this._body.duration();
};

module.exports = {
  EMVideoSize: EMVideoSize,
  EMVideoMessageBody: EMVideoMessageBody
};