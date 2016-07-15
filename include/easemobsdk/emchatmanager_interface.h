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
//  EMChatManagerInterface.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMChatManagerInterface__
#define __easemob__EMChatManagerInterface__

#include "message/emmessage.h"
#include "emcallback.h"
#include "emchatmanager_listener.h"
#include "emconversation.h"
#include "emencryptprovider_interface.h"

namespace easemob {

class EASEMOB_API EMChatManagerInterface
{
public:
    /**
      * \brief Destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMChatManagerInterface() { };
    
    /**
      * \brief Send a message.
      *
      * Note: Will callback user by EMChatManagerListener if user doesn't provide a callback in the message or callback return false.
      * @param  The message to send.
      * @return NA
      */
    virtual void sendMessage(const EMMessagePtr) = 0;
    
    /**
      * \brief Send read ask for a message.
      *
      * @param  The message to send read ack.
      * @return NA
      */
    virtual void sendReadAckForMessage(const EMMessagePtr) = 0;
    
    /**
      * \brief Resend a message.
      *
      * Note: Will callback user by EMChatManagerListener if user doesn't provide a callback in the message or callback return false.
      * @param  The message to resend.
      * @return NA
      */
    virtual void resendMessage(const EMMessagePtr) = 0;
    
    /**
      * \brief Download thumbnail for image or video message.
      *
      * Note: Image or video message thumbnail is downloaded automatically, 
        so user should NOT call this method except automatic download failed.
        And too, SDK will callback the user by EMChatManagerListener if user doesn't provide a callback in the message or callback return false.
      * @param  The message to download thumbnail.
      * @return NA
      */
    virtual void downloadMessageThumbnail(const EMMessagePtr) = 0;
    
    /**
      * \brief Download attachment of a message.
      *
      * Note: User should call this method to download file, voice, image, video.
        And too, SDK will callback the user by EMChatManagerListener if user doesn't provide a callback or callback return false.
      * @param  The message to download attachment.
      * @return NA
      */
    virtual void downloadMessageAttachments(const EMMessagePtr) = 0;
    
    /**
      * \brief Remove a conversation from DB and the memory.
      *
      * Note: Before remove a conversation, all conversations must have loaded from DB.
      * @param  The conversation id.
      * @param  The flag of whether remove the messages belongs to this conversation.
      * @return NA
      */
    virtual void removeConversation(const std::string &conversationId, bool isRemoveMessages = true) = 0;
    
    /**
      * \brief Get a conversation.
      *
      * Note: All conversations must have loaded from DB.
      * @param  The conversation id.
      * @param  The conversation type.
      * @param  The flag of whether created a conversation if it isn't exist.
      * @return The conversation
      */
    virtual EMConversationPtr conversationWithType(const std::string &conversationId, EMConversation::EMConversationType type, bool createIfNotExist = true) = 0;
    
    /**
      * \brief Get all conversations from memory.
      *
      * Note: All conversations must have loaded from DB.
      * @param  NA
      * @return The conversation list
      */
    virtual EMConversationList getConversations() = 0;
    
    /**
      * \brief Get all conversations from DB.
      *
      * @param  NA
      * @return The conversation list
      */
    virtual EMConversationList loadAllConversationsFromDB() = 0;
    
    /**
      * \brief Add a listener to chat manager.
      *
      * @param  NA
      * @return NA
      */
    virtual void addListener(EMChatManagerListener*) = 0;
    
    /**
      * \brief Remove a listener.
      *
      * @param  NA
      * @return NA
      */
    virtual void removeListener(EMChatManagerListener*) = 0;
    
    /**
      * \brief Remove all the listeners.
      *
      * @param  NA
      * @return NA
      */
    virtual void clearListeners() = 0;
    
    /**
     * \brief Application can customize encrypt method through EMEncryptProvider
     *
     * Note: If EMConfigManager#KEY_USE_ENCRYPTION is true, but don't provider encryptprovider,
     * SDK will use default encrypt method.
     * @param  EMEncryptProvider Customized encrypt method provider.
     * @return NA
     */
    virtual void setEncryptProvider(EMEncryptProviderInterface *provider) = 0;
    
    /**
     * \brief Get encrypt method being used.
     *
     * @param createIfNotExist If true, SDK will create a default encryptProvider, when there is no encryptProvider exists.
     * @return Encrypt method being used.
     */
    virtual EMEncryptProviderInterface *getEncryptProvider(bool createIfNotExist = false) = 0;
    
    /**
     * \brief Insert messages.
     * @param  The messages to insert.
     * @return NA
     */
    virtual bool insertMessages(const EMMessageList& list) = 0;
    
    /**
     * \brief Get message by message Id.
     *
     * @param messageId
     * @return EMMessagePtr
     */
    virtual EMMessagePtr getMessage(const std::string &messageId) = 0;
    
    /**
     * \brief Upload log to server.
     */
    virtual void uploadLog() = 0;
};

}

#endif /* defined(__easemob__EMChatManagerInterface__) */
