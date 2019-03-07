'use strict';

const easemobNode = require('./../load');

/**
 * Easemob EMError implementation.
 * {
 * EM_NO_ERROR = 0,                    //No error     
 * GENERAL_ERROR,                      //General error
 * NETWORK_ERROR,                      //Network isn't avaliable
 * DATABASE_ERROR,                     //Database operation failed
 * EXCEED_SERVICE_LIMIT,               //Exceed service limit
 * 
 * NVALID_APP_KEY = 100,              //App key is invalid
 * INVALID_USER_NAME,                  //User name is illegal
 * INVALID_PASSWORD,                   //Password is illegal
 * INVALID_URL,                        //URL is invalid
 * INVALID_TOKEN,                      //Token is invalid
 * 
 * USER_ALREADY_LOGIN = 200,           //User has already login
 * USER_NOT_LOGIN,                     //User has not login
 * USER_AUTHENTICATION_FAILED,         //User name or password is wrong
 * USER_ALREADY_EXIST,                 //User has already exist
 * USER_NOT_FOUND,                     //User dosn't exist
 * USER_ILLEGAL_ARGUMENT,              //Illegal argument
 * USER_LOGIN_ANOTHER_DEVICE,          //User login on another device
 * USER_REMOVED,                       //User was removed from server
 * USER_REG_FAILED,                    //User register failed
 * PUSH_UPDATECONFIGS_FAILED,          //Update push configs failed
 * USER_PERMISSION_DENIED,             //User has no right for this operation
 * USER_BINDDEVICETOKEN_FAILED,        //Bind device token failed
 * USER_UNBIND_DEVICETOKEN_FAILED,     //Unbind device token failed
 * USER_BIND_ANOTHER_DEVICE,           //Bind another device and do not allow auto login
 * USER_LOGIN_TOO_MANY_DEVICES,        //User login on too many devices
 * USER_MUTED,                         //User mutes in groups or chatrooms
 * USER_KICKED_BY_CHANGE_PASSWORD,     //User has changed the password
 * USER_KICKED_BY_OTHER_DEVICE,        //User was kicked by other device or console backend
 * 
 * SERVER_NOT_REACHABLE = 300,         //Server is not reachable
 * SERVER_TIMEOUT,                     //Wait server response timeout
 * SERVER_BUSY,                        //Server is busy
 * SERVER_UNKNOWN_ERROR,               //Unknown server error
 * SERVER_GET_DNSLIST_FAILED,          //Can't get dns list
 * SERVER_SERVING_DISABLED,            //Serving is disabled
 * SERVER_DECRYPTION_FAILED,           //Server transfer decryption failure.
 * 
 * FILE_NOT_FOUND = 400,               //File isn't exist
 * FILE_INVALID,                       //File is invalid
 * FILE_UPLOAD_FAILED,                 //Failed uploading file to server
 * FILE_DOWNLOAD_FAILED,               //Failed donwloading file from server
 * FILE_DELETE_FAILED,                 //Failed delete file
 * FILE_TOO_LARGE,                     //file too large to upload
 * 
 * MESSAGE_INVALID = 500,              //Message is invalid
 * MESSAGE_INCLUDE_ILLEGAL_CONTENT,    //Message include illegal content
 * MESSAGE_SEND_TRAFFIC_LIMIT,
 * MESSAGE_ENCRYPTION_ERROR,
 * MESSAGE_RECALL_TIME_LIMIT,          //Message recall exceed time limit
 * SERVICE_NOT_ENABLED,
 * 
 * GROUP_INVALID_ID = 600,             //Group id is invalid
 * GROUP_ALREADY_JOINED,               //User has already joined the group
 * GROUP_NOT_JOINED,                   //User has not joined the group
 * GROUP_PERMISSION_DENIED,            //User has no right for this operation
 * GROUP_MEMBERS_FULL,                 //Group members is full
 * GROUP_NOT_EXIST,                    //Group is not exist
 * 
 * CHATROOM_INVALID_ID = 700,          //Chatroom id is invalid
 * CHATROOM_ALREADY_JOINED,            //User has already joined the chatroom
 * CHATROOM_NOT_JOINED,                //User has not joined the chatroom
 * CHATROOM_PERMISSION_DENIED,         //User has no right for this operation
 * CHATROOM_MEMBERS_FULL,              //Chatroom members is full
 * CHATROOM_NOT_EXIST,                 //Chatroom is not exist
 * 
 * CALL_INVALID_ID = 800,              //Call id is invalid
 * CALL_BUSY,                          //Call in progress
 * CALL_REMOTE_OFFLINE,                //remote offline
 * CALL_CONNECTION_FAILED,             //Establish connection failed
 * CALL_INVALID_CAMERA_INDEX,          //Invalid camera index
 * CALL_OPERATION_CANCEL,              //Call cancel operation
 * CALL_PERMISSION_DENIED,             //Call permission denied
 * CALL_NOT_JOINED,                    //Call not joined
 * CALL_JOIN_FAILED,                   //Call join failed
 * CALL_CREATE_FAILED,                 //Call create failed
 * CALL_UNSUB_FAILED,                  //Call unsub failed
 * }
 */

/**
 * EMError constructor.
 * @constructor
 * @param {Number} errorCode
 * @param {String} description
 */
function EMError(errorCode, description) {
  if (arguments.length == 2) {
    this._error = new easemobNode.EMError(errorCode, description);
  } else if (arguments.length == 1) {
    if (typeof(errorCode) == "object") {
      this._error = errorCode;
    } else {
      this._error = new easemobNode.EMError(errorCode);
    }
  } else {
    this._error = new easemobNode.EMError();
  }
  Object.defineProperties(this, {
    errorCode: {
      get: function() {
        return this._error.errorCode;
      },
      set: function(errorCode) {
        this._error.errorCode = errorCode;
      }
    },
    description: {
      get: function() {
        return this._error.description;
      },
      set: function(description) {
        this._error.description = description;
      }
    }
  });
}

/**
 * set error code and error description.
 * @param {Number} errorCode
 * @param {String} description
 * @return {void}
 */
EMError.prototype.setErrorCode = function (errorCode, description) {
  this._error.setErrorCode(errorCode, description);
};

module.exports = EMError;