'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMVoiceMessageBody implementation.
 */

function EMVoiceMessageBody (localPath, duration) {
  this._body = new easemobNode.EMVoiceMessageBody(localPath, duration);
}

/**
 * Get message body type.
 * @return {Number}
 */
EMVoiceMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Set display name of the attachment.
 * @param {String} displayName
 * @return {void}
 */
EMVoiceMessageBody.prototype.setDisplayName = function (displayName) {
  this._body.setDisplayName(displayName);
};

/**
 * Get display name of the attachment.
 * @return {String}
 */
EMVoiceMessageBody.prototype.displayName = function () {
  return this._body.displayName();
};

/**
 * Set local path of the attachment.
 * Note: should NOT change the local path of the Received message.
 * @param {String} localPath
 * @return {void}
 */
EMVoiceMessageBody.prototype.setLocalPath = function (localPath) {
  this._body.setLocalPath(localPath);
};

/**
 * Get local path of the attachment.
 * @return {String}
 */
EMVoiceMessageBody.prototype.localPath = function () {
  return this._body.localPath();
};

/**
 * Set remote path of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} remotePath
 * @return {void}
 */
EMVoiceMessageBody.prototype.setRemotePath = function (remotePath) {
  this._body.setRemotePath(remotePath);
};

/**
 * Get remote path of the attachment.
 * @return {String}
 */
EMVoiceMessageBody.prototype.remotePath = function () {
  return this._body.remotePath();
};

/**
 * Set secret key of the attachment.
 * Note: It's internal used, user should never need to call this method.
 * @param {String} secretKey
 * @return {void}
 */
EMVoiceMessageBody.prototype.setSecretKey = function (secretKey) {
  this._body.setSecretKey(secretKey)
};

/**
 * Get secret key of the attachment, it's used to download attachment from server.
 * @return {String}
 */
EMVoiceMessageBody.prototype.secretKey = function () {
  return this._body.secretKey();
};

/**
 * Set file length of the attachment.
 * Note: It's usually not necessary to call this method, will calculate file length automatically when setting local path.
 * @param {Number} fileLength
 * @return {void}
 */
EMVoiceMessageBody.prototype.setFileLength = function (fileLength) {
  this._body.setFileLength(fileLength);
};

/**
 * Get file length of the attachment.
 * @return {Number}
 */
EMVoiceMessageBody.prototype.fileLength = function () {
  return this._body.fileLength();
};

/**
 * Set file downloading status.
 * Note: Usually, user should NOT call this method directly.
 * @param {Number} downloadStatus
 * @return {void}
 */
EMVoiceMessageBody.prototype.setDownloadStatus = function (downloadStatus) {
  this._body.setDownloadStatus(downloadStatus);
};

/**
 * Get file downloading status
 * @return {Number}
 */
EMVoiceMessageBody.prototype.downloadStatus = function () {
  return this._body.downloadStatus();
};

/**
 * Set voice playing duration in seconds.
 * @param {Number} duration
 * @return {void}
 */
EMVoiceMessageBody.prototype.setDuration = function (duration) {
  this._body.setDuration(duration);
};

/**
 * Get voice playing duration in seconds.
 * @return {Number}
 */
EMVoiceMessageBody.prototype.duration = function () {
  return this._body.duration();
};

module.exports = EMVoiceMessageBody;