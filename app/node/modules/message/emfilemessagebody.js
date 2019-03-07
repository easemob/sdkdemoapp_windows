'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMFileMessageBody implementation.
 * {
 * DOWNLOADING = 0, Downloading in progress
 * SUCCESSED = 1,   Succeed
 * FAILED = 2,      Failed
 * PENDING = 3,     Download has not begun
 * }
 */

/**
 * File message body constructor.
 * @constructor
 * @param {String} localPath The file path
 */
function EMFileMessageBody(localPath) {
  if (typeof(localPath) == "object") {
    this._body = localPath; //this situation used from emmessage.bodies()
  } else
    this._body = new easemobNode.EMFileMessageBody(localPath);
}

/**
 * Get message body type.
 * @return {Number}
 */
EMFileMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Set display name of the attachment.
 * @param {String} displayName
 * @return {void}
 */
EMFileMessageBody.prototype.setDisplayName = function (displayName) {
  this._body.setDisplayName(displayName);
};

/**
 * Get display name of the attachment.
 * @return {String}
 */
EMFileMessageBody.prototype.displayName = function () {
  return this._body.displayName();
};

/**
 * Set local path of the attachment.
 * Note: should NOT change the local path of the Received message.
 * @param {String} localPath
 * @return {void}
 */
EMFileMessageBody.prototype.setLocalPath = function (localPath) {
  this._body.setLocalPath(localPath);
};

/**
 * Get local path of the attachment.
 * @return {String}
 */
EMFileMessageBody.prototype.localPath = function () {
  return this._body.localPath();
};

/**
 * Set remote path of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} remotePath
 * @return {void}
 */
EMFileMessageBody.prototype.setRemotePath = function (remotePath) {
  this._body.setRemotePath(remotePath);
};

/**
 * Get remote path of the attachment.
 * @return {String}
 */
EMFileMessageBody.prototype.remotePath = function () {
  return this._body.remotePath();
};

/**
 * Set secret key of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} secretKey
 * @return {void}
 */
EMFileMessageBody.prototype.setSecretKey = function (secretKey) {
  this._body.setSecretKey(secretKey)
};

/**
 * Get secret key of the attachment, it's used to download attachment from server.
 * @return {String}
 */
EMFileMessageBody.prototype.secretKey = function () {
  return this._body.secretKey();
};

/**
 * Set file length of the attachment.
 * Note: It's usually not necessary to call this method, will calculate file length automatically when setting local path.
 * @param {Number} fileLength
 * @return {void}
 */
EMFileMessageBody.prototype.setFileLength = function (fileLength) {
  this._body.setFileLength(fileLength);
};

/**
 * Get file length of the attachment.
 * @return {Number}
 */
EMFileMessageBody.prototype.fileLength = function () {
  return this._body.fileLength();
};

/**
 * Set file downloading status.
 * Note: Usually, user should NOT call this method directly.
 * @param {Number} downloadStatus
 * @return {void}
 */
EMFileMessageBody.prototype.setDownloadStatus = function (downloadStatus) {
  this._body.setDownloadStatus(downloadStatus);
};

/**
 * Get file downloading status
 * @return {Number}
 */
EMFileMessageBody.prototype.downloadStatus = function () {
  return this._body.downloadStatus();
};

module.exports = EMFileMessageBody;