'use strict';

var easemobNode = require('./load');
const EMCmdMessageBody = require('./modules/message/emcmdmessagebody');
const EMFileMessageBody = require('./modules/message/emfilemessagebody');
const {EMImageSize, EMImageMessageBody} = require('./modules/message/emimagemessagebody');
const EMLocationMessageBody = require('./modules/message/emlocationmessagebody');
const EMTextMessageBody = require('./modules/message/emtextmessagebody');
const {EMVideoSize, EMVideoMessageBody} = require('./modules/message/emvideomessagebody');
const EMVoiceMessageBody = require('./modules/message/emvoicemessagebody');
const EMMessage = require('./modules/message/emmessage');
const EMCallback = require('./modules/emcallback');
const EMChatConfig = require('./modules/emchatconfig');
const EMChatManager = require('./modules/emchatmanager');
const EMChatManagerListener = require('./modules/emchatmanagerlistener');
const EMChatroom = require('./modules/emchatroom');
const EMChatroomManager = require('./modules/emchatroommanager');
const EMChatroomManagerListener = require('./modules/emchatroommanagerlistener');
const EMConnectionListener = require('./modules/emconnectionlistener');
const EMContactListener = require('./modules/emcontactlistener');
const EMContactManager = require('./modules/emcontactmanager');
const EMConversation = require('./modules/emconversation');
const {EMStringCursorResult, EMCursorResult, EMPageResult} = require('./modules/emcursorresult');
const EMError = require('./modules/emerror');
const EMGroup = require('./modules/emgroup');
const EMGroupManager = require('./modules/emgroupmanager');
const EMGroupManagerListener = require('./modules/emgroupmanagerlistener');
const EMMucSetting = require('./modules/emmucsetting');
const EMMucSharedFile = require('./modules/emmucsharedfile');
const EMMultiDevicesListener = require('./modules/emmultideviceslistener');
const EMClient = require('./modules/emclient');
const EMLog = require('./modules/emlog');
const EMChatPrivateConfigs = require('./modules/emchatprivateconfigs');

/**chat type.
 * {
 * SINGLE = 0,    // One-to-one chat
 * GROUP = 1,     // Group chat
 * CHATROOM = 2   // Chatroom chat
 * }
 */
function createSendMessage(from, to, body, chatType) {
  return new EMMessage(easemobNode.createSendMessage(from, to, body._body, chatType));
}

function createReceiveMessage(from, to, body, chatType, msgId) {
  return new EMMessage(easemobNode.createReceiveMessage(from, to, body._body, chatType, msgId));
}

module.exports = {
  EMCmdMessageBody: EMCmdMessageBody,
  EMFileMessageBody: EMFileMessageBody,
  EMImageSize: EMImageSize,
  EMImageMessageBody: EMImageMessageBody,
  EMLocationMessageBody: EMLocationMessageBody,
  EMTextMessageBody: EMTextMessageBody,
  EMVideoSize: EMVideoSize,
  EMVideoMessageBody: EMVideoMessageBody,
  EMVoiceMessageBody: EMVoiceMessageBody,
  EMMessage: EMMessage,
  EMCallback: EMCallback,
  EMChatConfig: EMChatConfig,
  EMChatManager: EMChatManager,
  EMChatManagerListener: EMChatManagerListener,
  EMChatroom: EMChatroom,
  EMChatroomManager: EMChatroomManager,
  EMChatroomManagerListener: EMChatroomManagerListener,
  EMConnectionListener: EMConnectionListener,
  EMContactListener: EMContactListener,
  EMContactManager: EMContactManager,
  EMConversation: EMConversation,
  EMStringCursorResult: EMStringCursorResult,
  EMCursorResult: EMCursorResult,
  EMPageResult: EMPageResult,
  EMError: EMError,
  EMGroup: EMGroup,
  EMGroupManager: EMGroupManager,
  EMGroupManagerListener: EMGroupManagerListener,
  EMMucSetting: EMMucSetting,
  EMMucSharedFile: EMMucSharedFile,
  EMMultiDevicesListener: EMMultiDevicesListener,
  EMClient: EMClient,
  createSendMessage: createSendMessage,
  createReceiveMessage: createReceiveMessage,
  EMLog: EMLog,
  EMChatPrivateConfigs: EMChatPrivateConfigs
};