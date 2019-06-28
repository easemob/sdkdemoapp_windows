'use strict';

const easemobNode = require('./../load');
const EMError = require('./emerror');
const EMCallSessionStatistics = require('./emcallsessionstatistics');

/**
 * Easemob EMCallSession implementation.
 */

/**
 * EMCallSession constructor.
 * @constructor
 */
function EMCallSession() {
  if (arguments.length == 0) {
    this._callSession = new easemobNode.EMCallSession();
  } else {
    this._callSession = arguments[0];
  }
}

/**
 * get the caller Id of session
 * @return {String} 返回会话的呼叫方ID
 */
EMCallSession.prototype.getCallId = function () {
  return this._callSession.getCallId();
};

/**
 * get the local name of session
 * @return {String} 返回本地会话名称
*/
EMCallSession.prototype.getLocalName = function () {
    return this._callSession.getLocalName();
  };
  
/**
 * get the type of session
 * @return {Number} 返回会话类型，0音频，1视频
*/
EMCallSession.prototype.getType = function () {
    return this._callSession.getType();
  };

/**
 * get the remote name of session
 * @return {Number} 返回对方会话名称
*/
EMCallSession.prototype.getRemoteName = function () {
    return this._callSession.getRemoteName();
  };
  
/**
 * get if user is the caller of session
 * @return {Bool} 返回本地是否呼叫方
*/
EMCallSession.prototype.getIsCaller = function () {
    return this._callSession.getIsCaller();
  };

/**
 * get the call local video fps
 * @return {Number} 返回会话状态，0断开，1振铃，2正在连接，3已连接，4已接听
*/
EMCallSession.prototype.getStatus = function () {
    return this._callSession.getStatus();
  };

/**
 * get the ext info of session
 * @return {String} 返回会话扩展信息
*/
EMCallSession.prototype.getExt = function () {
    return this._callSession.getExt();
  };

/**
 * update the session state
 * @param  {Number} controltype 设置会话状态，0音频暂停，1音频恢复，2视频暂停，3视频恢复
 * @return {Result}
 */
EMCallSession.prototype.update = function (controltype) {
    let err = new EMError();
    this._callSession.update(controltype,err._error);
    return {
      code:err.errorCode,
      description:err.description
    }
  };

  /**
   * @typedef {Object} Result
   * @property {Number} code 返回码.0为正常，其他错误
   * @property {String} description 错误描述信息
   */
  
/**
 * set if enable quality check
 * @param {Bool} enable 是否开启音视频网络质量检查
 * @return {void}
*/
EMCallSession.prototype.enableQualityChecker = function (enable) {
    this._callSession.enableQualityChecker(enable);
  };

module.exports = EMCallSession;