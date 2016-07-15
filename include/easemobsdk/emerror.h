/************************************************************
 *  * EaseMob CONFIDENTIAL
 * __________________
 * Copyright (C) 2015 EaseMob Technologies. All rights reserved.
 * 
 * NOTICE: All information contained herein is, and remains
 * the property of EaseMob Technologies.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from EaseMob Technologies.
 */
//
//  EMError.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMError__
#define __easemob__EMError__

#include "embaseobject.h"

#include <string>

namespace easemob {

class EASEMOB_API EMError : EMBaseObject
{
public:
   
    typedef enum
    {
        EM_NO_ERROR = 0,                    //No error
        
        GENERAL_ERROR,                      //General error
        NETWORK_ERROR,                      //Network isn't avaliable
        
        INVALID_APP_KEY = 100,              //App key is invalid
        INVALID_USER_NAME,                  //User name is illegal
        INVALID_PASSWORD,                   //Password is illegal
        INVALID_URL,                        //URL is invalid
        
        USER_ALREADY_LOGIN = 200,           //User has already login
        USER_NOT_LOGIN,                     //User has not login
        USER_AUTHENTICATION_FAILED,         //User name or password is wrong
        USER_ALREADY_EXIST,                 //User has already exist
        USER_NOT_FOUND,                     //User dosn't exist
        USER_ILLEGAL_ARGUMENT,              //Illegal argument
        USER_LOGIN_ANOTHER_DEVICE,          //User login on another device
        USER_REMOVED,                       //User was removed from server
        USER_REG_FAILED,                    //User register failed
        PUSH_UPDATECONFIGS_FAILED,          //Update push configs failed
        USER_PERMISSION_DENIED,             //User has no right for this operation
        USER_BINDDEVICETOKEN_FAILED,        //Bind device token failed
        USER_UNBIND_DEVICETOKEN_FAILED,     //Unbind device token failed
        
        SERVER_NOT_REACHABLE = 300,         //Server is not reachable
        SERVER_TIMEOUT,                     //Wait server response timeout
        SERVER_BUSY,                        //Server is busy
        SERVER_UNKNOWN_ERROR,               //Unknown server error
        SERVER_GET_DNSLIST_FAILED,          //Can't get dns list
        
        FILE_NOT_FOUND = 400,               //File isn't exist
        FILE_INVALID,                       //File is invalid
        FILE_UPLOAD_FAILED,                 //Failed uploading file to server
        FILE_DOWNLOAD_FAILED,               //Failed donwloading file from server
        
        MESSAGE_INVALID = 500,              //Message is invalid
        MESSAGE_INCLUDE_ILLEGAL_CONTENT,    //Message include illegal content
        MESSAGE_SEND_TRAFFIC_LIMIT,
        MESSAGE_ENCRYPTION_ERROR,
        
        GROUP_INVALID_ID = 600,             //Group id is invalid
        GROUP_ALREADY_JOINED,               //User has already joined the group
        GROUP_NOT_JOINED,                   //User has not joined the group
        GROUP_PERMISSION_DENIED,            //User has no right for this operation
        GROUP_MEMBERS_FULL,                 //Group members is full
        GROUP_NOT_EXIST,                    //Group is not exist
        
        CHATROOM_INVALID_ID = 700,          //Chatroom id is invalid
        CHATROOM_ALREADY_JOINED,            //User has already joined the chatroom
        CHATROOM_NOT_JOINED,                //User has not joined the chatroom
        CHATROOM_PERMISSION_DENIED,         //User has no right for this operation
        CHATROOM_MEMBERS_FULL,              //Chatroom members is full
        CHATROOM_NOT_EXIST,                 //Chatroom is not exist

        CALL_INVALID_ID = 800,              //Call id is invalid
        CALL_BUSY,                          //Call in progress
        CALL_REMOTE_OFFLINE,                //remote offline
        CALL_CONNECTION_FAILED,             //Establish connection failed 
        CALL_INVALID_CAMERA_INDEX,          //Invalid camera index
    }EMErrorCode;
    
    /**
      * \brief EMCallback's constructor.
      *
      * Note: If description is empty, constructor will provide default description accord the error code.
      * @param  Error code
      * @param  Error description
      * @return NA
      */
    EMError(const EMError &e) {
        mErrorCode = e.mErrorCode;
        mDescription = e.mDescription;
    }
    EMError(int errorCode = EM_NO_ERROR, const std::string &description = "");
    void setErrorCode(int errorCode, const std::string &description = "");
    virtual ~EMError() {}
    EMError & operator=(const EMError& e) {
        mErrorCode = e.mErrorCode;
        mDescription = e.mDescription;
        return *this;
    }
    
    int mErrorCode;
    std::string mDescription;
};

typedef std::shared_ptr<EMError> EMErrorPtr;

}

#endif /* defined(__easemob__EMError__) */
