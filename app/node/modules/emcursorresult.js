'use strict';

const EMMessage = require('./message/emmessage');
const EMGroup = require('./emgroup');
const EMChatroom = require('./emchatroom')
/**
 * Easemob EMStringCursorResult implementation.
 */

/**
 * EMStringCursorResult constructor.
 * @constructor
 * @param {Object} cursor
 */
function EMStringCursorResult(cursor) {
  this._cursor = cursor;
}

/**
 * Get cursor of next page.
 * @return {String}
 */
EMStringCursorResult.prototype.nextPageCursor = function () {
  return this._cursor.nextPageCursor();
};

/**
 * Get the result of current page.
 * @return {Array} string array.
 */
EMStringCursorResult.prototype.result = function () {
  return this._cursor.result();
};


/**
 * Easemob EMCursorResult implementation.
 * {
 * GROUP = 0,         //cursor store EMGroup list.
 * CHATROOM = 1,      //cursor store EMChatroom list.
 * MESSAGE = 2,       //cursor store EMMessage list.
 * }
 */
function EMCursorResult (cursor, type) {
  this._cursor = cursor;
  this._type = type;
}

/**
 * Get cursor of next page.
 * @return {String}
 */
EMCursorResult.prototype.nextPageCursor = function () {
  return this._cursor.nextPageCursor();
};

/**
 * Get the result of current page.
 * @return {Array} group or chatroom list.
 */
EMCursorResult.prototype.result = function () {
  var result = this._cursor.result();
  var list = new Array(result.length);
  for (var i = 0; i < result.length; i++) {
    if (this._type == 0) {
      list[i] = new EMGroup(result[i]);
    } else if (this._type == 1) {
      list[i] = new EMChatroom(result[i]);
    } else if (this._type == 2) {
      list[i] = new EMMessage(result[i]);
    }
  }
  return list;
};


/**
 * Easemob EMPageResult implementation.
 * {
 * GROUP = 0,         //
 * CHATROOM = 1,      //
 * }
 */
function EMPageResult (cursor, type) {
  this._cursor = cursor;
  this._type = type;
}

/**
 * Get count.
 * @return {Array}
 */
EMPageResult.prototype.count = function () {
  return this._cursor.count();
};

/**
 * Get the result of current page.
 * @return {Array} group or chatroom list.
 */
EMPageResult.prototype.result = function () {
  var result = this._cursor.result();
  var list = new Array(result.length);
  for (var i = 0; i < result.length; i++) {
    if (this._type == 0) {
      list[i] = new EMGroup(result[i]);
    } else {
      list[i] = new EMChatroom(result[i]);
    }
  }
  return list;
};

module.exports = {
  EMStringCursorResult: EMStringCursorResult,
  EMCursorResult: EMCursorResult,
  EMPageResult: EMPageResult
};