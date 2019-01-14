'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMImageMessageBody implementation.
 */

function EMImageSize(width, height) {
  this._size = new easemobNode.EMImageSize(width, height);
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

function EMImageMessageBody(localPath, thumbnailLocalPath) {
  if (typeof(localPath) == "object") {
    this._body = localPath; //this situation used from emmessage.bodies()
  } else {
    this._body = new easemobNode.EMImageMessageBody(localPath, thumbnailLocalPath);
  }
}

/**
 * Get message body type.
 * @return {Number}
 */
EMImageMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Set display name of the attachment.
 * @param {String} displayName
 * @return {void}
 */
EMImageMessageBody.prototype.setDisplayName = function (displayName) {
  this._body.setDisplayName(displayName);
};

/**
 * Get display name of the attachment.
 * @return {String}
 */
EMImageMessageBody.prototype.displayName = function () {
  return this._body.displayName();
};

/**
 * Set local path of the attachment.
 * Note: should NOT change the local path of the Received message.
 * @param {String} localPath
 * @return {void}
 */
EMImageMessageBody.prototype.setLocalPath = function (localPath) {
  this._body.setLocalPath(localPath);
};

/**
 * Get local path of the attachment.
 * @return {String}
 */
EMImageMessageBody.prototype.localPath = function () {
  return this._body.localPath();
};

/**
 * Set remote path of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} remotePath
 * @return {void}
 */
EMImageMessageBody.prototype.setRemotePath = function (remotePath) {
  this._body.setRemotePath(remotePath);
};

/**
 * Get remote path of the attachment.
 * @return {String}
 */
EMImageMessageBody.prototype.remotePath = function () {
  return this._body.remotePath();
};

/**
 * Set secret key of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} secretKey
 * @return {void}
 */
EMImageMessageBody.prototype.setSecretKey = function (secretKey) {
  this._body.setSecretKey(secretKey)
};

/**
 * Get secret key of the attachment, it's used to download attachment from server.
 * @return {String}
 */
EMImageMessageBody.prototype.secretKey = function () {
  return this._body.secretKey();
};

/**
 * Set file length of the attachment.
 * Note: It's usually not necessary to call this method, will calculate file length automatically when setting local path.
 * @param {Number} fileLength
 * @return {void}
 */
EMImageMessageBody.prototype.setFileLength = function (fileLength) {
  this._body.setFileLength(fileLength);
};

/**
 * Get file length of the attachment.
 * @return {Number}
 */
EMImageMessageBody.prototype.fileLength = function () {
  return this._body.fileLength();
};

/**
 * Set file downloading status.
 * Note: Usually, user should NOT call this method directly.
 * @param {Number} downloadStatus
 * @return {void}
 */
EMImageMessageBody.prototype.setDownloadStatus = function (downloadStatus) {
  this._body.setDownloadStatus(downloadStatus);
};

/**
 * Get file downloading status
 * @return {Number}
 */
EMImageMessageBody.prototype.downloadStatus = function () {
  return this._body.downloadStatus();
};

/**
 * Set display name of the thumbnail.
 * @param {String} thumbnailDisplayName
 * @return {void}
 */
EMImageMessageBody.prototype.setThumbnailDisplayName = function (thumbnailDisplayName) {
  this._body.setThumbnailDisplayName(thumbnailDisplayName);
};

/**
 * Get display name of the thumbnail.
 * @return {String}
 */
EMImageMessageBody.prototype.thumbnailDisplayName = function () {
  return this._body.thumbnailDisplayName();
};

/**
 * Set local path of the thumbnail.
 * @param {String} thumbnailLocalPath
 * @return {void}
 */
EMImageMessageBody.prototype.setThumbnailLocalPath = function (thumbnailLocalPath) {
  this._body.setThumbnailLocalPath(thumbnailLocalPath);
};

/**
 * Get local path of the thumbnail.
 * @return {String}
 */
EMImageMessageBody.prototype.thumbnailLocalPath = function () {
  return this._body.thumbnailLocalPath();
};

/**
 * Set remote path of the thumbnail.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} thumbnailRemotePath
 * @return {void}
 */
EMImageMessageBody.prototype.setThumbnailRemotePath = function (thumbnailRemotePath) {
  this._body.setThumbnailRemotePath(thumbnailRemotePath);
};

/**
 * Get remote path of the thumbnail.
 * @return {String}
 */
EMImageMessageBody.prototype.thumbnailRemotePath = function () {
  return this._body.thumbnailRemotePath();
};

/**
 * Set secret key of the thumbnail.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} thumbnailRemotePath
 * @return {void}
 */
EMImageMessageBody.prototype.setThumbnailSecretKey = function (thumbnailRemotePath) {
  this._body.setThumbnailSecretKey(thumbnailRemotePath);
};

/**
 * Get secret key of the thumbnail.
 * @return {String}
 */
EMImageMessageBody.prototype.thumbnailSecretKey = function () {
  return this._body.thumbnailSecretKey();
};

/**
 * Set size of the thumbnail.
 * @param {EMImageSize} size
 * @return {void}
 */
EMImageMessageBody.prototype.setThumbnailSize = function (size) {
  this._body.setThumbnailSize(size._size);
};

/**
 * Get size of the thumbnail.
 * @return {EMImageSize}
 */
EMImageMessageBody.prototype.thumbnailSize = function () {
  return new EMImageSize(this._body.thumbnailSize().width, this._body.thumbnailSize().height);
};

/**
 * Set file length of the thumbnail.
 * Note: It's usually not necessary to call this method, will calculate file length automatically when setting local path.
 * @param {Number} thumbnailFileLength
 * @return {void}
 */
EMImageMessageBody.prototype.setThumbnailFileLength = function (thumbnailFileLength) {
  this._body.setThumbnailFileLength(thumbnailFileLength)
};

/**
 * Get file length of the thumbnail.
 * @return {Number}
 */
EMImageMessageBody.prototype.thumbnailFileLength = function () {
  return this._body.thumbnailFileLength();
};

/**
 * Set download status of the thumbnail.
 * Note: Usually, user should NOT call this method directly.
 * @param {Number} thumbnailDownloadStatus
 * @return {void}
 */
EMImageMessageBody.prototype.setThumbnailDownloadStatus = function (thumbnailDownloadStatus) {
  this._body.setThumbnailDownloadStatus(thumbnailDownloadStatus);
};

/**
 * Get download status of the thumbnail.
 * @return {Number}
 */
EMImageMessageBody.prototype.thumbnailDownloadStatus = function () {
  return this._body.thumbnailDownloadStatus();
};

/**
 * Set size of the thumbnail.
 * @param {EMImageSize} size
 * @return {void}
 */
EMImageMessageBody.prototype.setSize = function (size) {
  this._body.setSize(size._size);
};

/**
 * Get size of the thumbnail.
 * @return {EMImageSize}
 */
EMImageMessageBody.prototype.size = function () {
  return new EMImageSize(this._body.size().width, this._body.size().height);
};

module.exports = {
  EMImageSize: EMImageSize,
  EMImageMessageBody: EMImageMessageBody
};