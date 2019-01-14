'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMMucSharedFile implementation.
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
 * @return {String}
 */
EMMucSharedFile.prototype.fileId = function () {
  return this._sharedfile.fileId();
};

/**
 * Get shared file name.
 * @return {String}
 */
EMMucSharedFile.prototype.fileName = function () {
  return this._sharedfile.fileName();
};

/**
 * Get shared file owner.
 * @return {String}
 */
EMMucSharedFile.prototype.fileOwner = function () {
  return this._sharedfile.fileOwner();
};

/**
 * Get shared file create time.
 * @return {Number}
 */
EMMucSharedFile.prototype.create = function () {
  return this._sharedfile.create();
};

/**
 * Get shared file size.
 * @return {Number}
 */
EMMucSharedFile.prototype.fileSize = function () {
  return this._sharedfile.fileSize();
};

module.exports = EMMucSharedFile;