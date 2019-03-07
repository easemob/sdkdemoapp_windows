'use strict';

const easemobNode = require('./../../load');

/**
 * Easemob EMTextMessageBody implementation.
 */
/**
 * Text message body constructor.
 * @constructor
 * @param {String} text
 */
function EMTextMessageBody(text) {
  if (typeof(text) == "object") {
    this._body = text; //this situation used from emmessage.bodies()
  } else {
    this._body = new easemobNode.EMTextMessageBody(text);
  }
}

/**
 * Get message body type.
 * @return {Number}
 */
EMTextMessageBody.prototype.type = function () {
  return this._body.type();
};

/**
 * Get the text.
 * @return {String}
 */
EMTextMessageBody.prototype.text = function () {
  return this._body.text();
};

module.exports = EMTextMessageBody;