'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMCallRtcListener implementation.
 */

/**
 * EMCallRtcListener constructor.
 * @constructor
 */
function EMCallRtcListener(callRtclistener) {
  this._manager = callRtclistener;
}

/**
 * Call user when user receive local sdp
 * @param {String} localsdp sdp描述
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveLocalSdp = function (localsdp) {
  this._manager.onReceiveLocalSdp(localsdp);
};

/**
 * Call user when user receive local Candidate
 * @param {String} localCandidate 支持的媒体能力
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveLocalCandidate = function (localCandidate) {
  this._manager.onReceiveLocalCandidate(localCandidate);
};

/**
 * Call user when user receive local Candidate complete
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveLocalCandidateCompleted = function () {
  this._manager.onReceiveLocalCandidateCompleted();
};

/**
 * Call user when user receive rtc setup
 * @param {String} reason setup原因
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveSetup = function (reason) {
  this._manager.onReceiveSetup(reason);
};

/**
 * Call user when user receive rtc close
 * @param {String} reason close原因
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveClose = function (reason) {
  this._manager.onReceiveClose(reason);
};

/**
 * Call user when user receive rtc error
 * @param {EMNError} error 出错情况
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveError = function (error) {
  this._manager.onReceiveError(error);
};

/**
 * Call user when user receive rtc Statistics
 * @param {EMNCallStatisticsCallback} callStatistics 回调函数
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveCallStatistics = function (callStatistics) {
  this._manager.onReceiveCallStatistics(callStatistics);
};

/**
 * Call user when user receive rtc connected
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveNetworkConnected = function () {
  this._manager.onReceiveNetworkConnected();
};

/**
 * Call user when user receive rtc disconnected
 * @return {void}
 */
EMCallRtcListener.prototype.onReceiveNetworkDisconnected = function () {
  this._manager.onReceiveNetworkDisconnected();
};

module.exports = EMCallRtcListener;