'use strict';

const easemobNode = require('../load');

/**
 * Easemob EMChatPrivateconfigs implementation.
 */

/**
 * EMChatPrivateconfigs constructor.
 * @constructor
 * @param {Object} PrivateConfigs 私有部署对象
 * @property {Bool} enableDns 是否启用dns
 * @property {String} chatServer IM Server IP
 * @property {Number} chatPort IM Server port
 * @property {String} restServer rest Server ip and port
 * @property {String} resolverServer resolver Server address
 * @property {String} chatDomain chat domain
 * @property {String} groupDomain group domain
 */
function EMChatPrivateConfigs(PrivateConfigs) {
  this._privateConfigs = PrivateConfigs;
  Object.defineProperties(this, {
    enableDns: {
      get: function () {
        return this._privateConfigs.enableDns;
      }, 
      set: function (enableDns) {
        this._privateConfigs.enableDns = enableDns;
      }
    },
    chatServer: {
      get: function () {
        return this._privateConfigs.chatServer;
      }, 
      set: function (chatServer) {
        this._privateConfigs.chatServer = chatServer;
      }
    },
    chatPort: {
      get: function () {
        return this._privateConfigs.chatPort;
      }, 
      set: function (chatPort) {
        this._privateConfigs.chatPort = chatPort;
      }
    },
    restServer: {
      get: function () {
        return this._privateConfigs.restServer;
      }, 
      set: function (restServer) {
        this._privateConfigs.restServer = restServer;
      }
    },
    resolverServer: {
      get: function () {
        return this._privateConfigs.resolverServer;
      }, 
      set: function (resolverServer) {
        this._privateConfigs.resolverServer = resolverServer;
      }
    },
    chatDomain: {
      get: function () {
        return this._privateConfigs.chatDomain;
      }, 
      set: function (chatDomain) {
        this._privateConfigs.chatDomain = chatDomain;
      }
    },
    groupDomain: {
      get: function () {
        return this._privateConfigs.groupDomain;
      }, 
      set: function (groupDomain) {
        this._privateConfigs.groupDomain = groupDomain;
      }
    }
  });
}
module.exports = EMChatPrivateConfigs;