'use strict';

const easemobNode = require('../../load');

/**
 * Easemob EMCustomMessageBody implementation.
 */

/**
 * Command message body constructor.
 * @constructor
 * @param {String} event
 */
function EMCustomMessageBody(event) {
  if(typeof event == "object"){
    this._body = event;
  }else{
    this._body = new easemobNode.EMCustomMessageBody(event);
  }
  
}

/**
 * Get message body type.
 * @return {Number} 返回消息类型
 */
EMCustomMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Get command action.
 * @return {String} 返回消息event名称
 */
EMCustomMessageBody.prototype.event = function () {
  return this._body.event();
};

/**
 * Set custommsg event.
 * @param {String} event 设置消息event名称
 * @return {void} 
 */
EMCustomMessageBody.prototype.setEvent = function (event) {
  this._body.setEvent(event);
};

/**
 * Get command exts.
 * @return {Object} return an object like {"key1" : "val1", "key2" : "val2"}
 */
EMCustomMessageBody.prototype.exts = function () {
  return this._body.exts();
};

/**
 * Set command exts.
 * @param {Object} exts exts is an object like {"key1" : "val1", "key2" : "val2"}
 * @return {void}
 */
EMCustomMessageBody.prototype.setExts = function (exts) {
  this._body.setExts(exts);
};

module.exports = EMCustomMessageBody;