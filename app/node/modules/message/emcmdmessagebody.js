'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMCmdMessageBody implementation.
 */

/**
 * Command message body constructor.
 * @constructor
 * @param {String} action
 */
function EMCmdMessageBody(action) {
  this._body = new easemobNode.EMCmdMessageBody(action);
}

/**
 * Get message body type.
 * @return {Number} 返回消息类型
 */
EMCmdMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Get command action.
 * @return {String} 返回命令消息类型
 */
EMCmdMessageBody.prototype.action = function () {
  return this._body.action();
};

/**
 * Set command action.
 * @param {String} action
 * @return {void} 设置命令消息类型
 */
EMCmdMessageBody.prototype.setAction = function (action) {
  this._body.setAction(action);
};

/**
 * Get command action.
 * @return {Array} array is a object list. object is like {"key" : "1", "value" : "1"}
 */
EMCmdMessageBody.prototype.params = function () {
  return this._body.params();
};

/**
 * Set command action.
 * @param {Array} params params is a object list. object is a key value object. like {"key" : "1", "value" : "1"}
 * @return {void}
 */
EMCmdMessageBody.prototype.setParams = function (params) {
  this._body.setParams(params);
};

module.exports = EMCmdMessageBody;