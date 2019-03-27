'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMMucSharedFile implementation.
 */

/**
 * EMMucSetting constructor.
 * @constructor
 * @param {String} fileId 文件ID
 * @param {String} fileName  文件名
 * @param {String} fileOwner 文件所有人
 * @param {Number} create 创建时间
 * @param {Number} fileSize 文件大小
 */
function EMMucSharedFile(fileId, fileName, fileOwner, create, fileSize) {
  if (typeof(fileId) == "object") {
    this._sharedfile = fileId;
  } else {
    this._sharedfile = new easemobNode.EMMucSharedFile(fileId, fileName, fileOwner, create, fileSize);
  }
}

/**
 * Get shared file id.
 * @return {String} 返回文件ID
 */
EMMucSharedFile.prototype.fileId = function () {
  return this._sharedfile.fileId();
};

/**
 * Get shared file name.
 * @return {String} 返回文件名
 */
EMMucSharedFile.prototype.fileName = function () {
  return this._sharedfile.fileName();
};

/**
 * Get shared file owner.
 * @return {String} 返回文件创建人
 */
EMMucSharedFile.prototype.fileOwner = function () {
  return this._sharedfile.fileOwner();
};

/**
 * Get shared file create time.
 * @return {Number} 返回创建时间
 */
EMMucSharedFile.prototype.create = function () {
  return this._sharedfile.create();
};

/**
 * Get shared file size.
 * @return {Number} 返回文件大小
 */
EMMucSharedFile.prototype.fileSize = function () {
  return this._sharedfile.fileSize();
};

module.exports = EMMucSharedFile;