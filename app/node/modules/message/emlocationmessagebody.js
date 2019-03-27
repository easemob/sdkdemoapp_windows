'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMLocationMessageBody implementation.
 */
/**
 * Location message body constructor.
 * @constructor
 * @param {Number} latitude 纬度
 * @param {Number} longitude 经度
 * @param {String} address 地址
 */
function EMLocationMessageBody(latitude, longitude, address) {
  if (typeof(latitude) == "object") {
    this._body = latitude; //this situation used from emmessage.bodies()
  } else {
    this._body = new easemobNode.EMLocationMessageBody(latitude, longitude, address);
  }
  
}

/**
 * Get message body type.
 * @return {Number} 消息类型
 */
EMLocationMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Set latitude.
 * @param {Number} latitude 纬度
 * @return {void}
 */
EMLocationMessageBody.prototype.setLatitude = function (latitude) {
  this._body.setLatitude(latitude);
};

/**
 * Get latitude.
 * @return {Number} 返回纬度
 */
EMLocationMessageBody.prototype.latitude = function () {
  return this._body.latitude();
};

/**
 * Set longitude.
 * @param {Number} longitude 经度
 * @return {void}
 */
EMLocationMessageBody.prototype.setLongitude = function (longitude) {
  this._body.setLongitude(longitude);
};

/**
 * Get longitude.
 * @return {Number} 返回经度
 */
EMLocationMessageBody.prototype.longitude = function () {
  return this._body.longitude();
};

/**
 * Set address.
 * @param {String} address 地址信息
 * @return {void}
 */
EMLocationMessageBody.prototype.setAddress = function (address) {
  this._body.setAddress(address);
};

/**
 * Get address.
 * @return {String} 返回地址信息
 */
EMLocationMessageBody.prototype.address = function () {
  return this._body.address();
};

module.exports = EMLocationMessageBody;