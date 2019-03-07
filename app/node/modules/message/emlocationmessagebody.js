'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMLocationMessageBody implementation.
 */
/**
 * Location message body constructor.
 * @constructor
 * @param {Number} latitude
 * @param {Number} longitude
 * @param {String} address
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
 * @return {Number}
 */
EMLocationMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Set latitude.
 * @param {Number} latitude
 * @return {void}
 */
EMLocationMessageBody.prototype.setLatitude = function (latitude) {
  this._body.setLatitude(latitude);
};

/**
 * Get latitude.
 * @return {Number}
 */
EMLocationMessageBody.prototype.latitude = function () {
  return this._body.latitude();
};

/**
 * Set longitude.
 * @param {Number} longitude
 * @return {void}
 */
EMLocationMessageBody.prototype.setLongitude = function (longitude) {
  this._body.setLongitude(longitude);
};

/**
 * Get longitude.
 * @return {Number}
 */
EMLocationMessageBody.prototype.longitude = function () {
  return this._body.longitude();
};

/**
 * Set address.
 * @param {String} address
 * @return {void}
 */
EMLocationMessageBody.prototype.setAddress = function (address) {
  this._body.setAddress(address);
};

/**
 * Get address.
 * @return {String}
 */
EMLocationMessageBody.prototype.address = function () {
  return this._body.address();
};

module.exports = EMLocationMessageBody;