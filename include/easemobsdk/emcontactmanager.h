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
#ifndef EMCORE_CONTACTMANAGER_H
#define EMCORE_CONTACTMANAGER_H


#include "rostereventhandler.h"
#include "chatclient.hpp"

#include <vector>
#include <string>
#include <memory>
#include <mutex>


#include "emmanager_base.h"
#include "emcontactlistener.h"
#include "emcontactmanager_interface.h"
#include "emdatabase.h"
#include "emsemaphoretracker.h"
#include "emstl.h"
#include "synctrackhandler.hpp"
#include "syncdl.hpp"


namespace easemob {

    class EMContactListener;
    class ContactListenerHandler;
    class EMConfigManager;
	class EMChatManagerInterface;
    class EMSessionManager;

    class EMContactManager : public EMContactManagerInterface , public EMManagerBase, public protocol::RosterEventHandler, public protocol::SyncTrackHandler
    {

    public:
        EMContactManager(std::unique_ptr<protocol::ChatClient> &client, std::shared_ptr<EMConfigManager> configManager, const EMDatabasePtr database, EMChatManagerInterface* chatManager, EMSessionManager *sessionManager) ;
        virtual ~EMContactManager();

        virtual void registerContactListener(EMContactListener* listener);
        virtual void removeContactListener(EMContactListener* listener);

        virtual std::vector<std::string> allContacts(EMError &error);
        virtual std::vector<std::string> getContactsFromServer(EMError &error);
        virtual std::vector<std::string> getContactsFromDB(EMError &error);
        virtual void inviteContact(const std::string& username, const std::string& message, EMError &error);
        virtual void deleteContact(const std::string& username, EMError &error);
        virtual void acceptInvitation(const std::string& username, EMError &error);
        virtual void declineInvitation(const std::string& username, EMError &error);

        // --- black list related operations ---
        virtual std::vector<std::string> blacklist(EMError &error);
        virtual std::vector<std::string> getBlackListFromServer(EMError &error);
        virtual std::vector<std::string> getBlackListFromDB(EMError &error);
        virtual void saveBlackList(const std::vector<std::string> &blacklist, EMError &error);
        virtual void addToBlackList(std::string username, bool both, EMError &error);
        virtual void removeFromBlackList(std::string username, EMError &error);

        // --- EMManagerBase ---
        virtual void onInit();
        virtual void onDestory();

        //override
        virtual void handleRosterEvent(protocol::RosterOperation op, const protocol::JID &, std::string reason, std::string roster_ver);
        virtual void handleSync(const protocol::SyncDL&, int context);
        
    private:
        const int OPER_TIMEOUT = 40000;    // 40s

        bool handleError(EMError &error);
        void doHandleRosterEvent(protocol::RosterOperation op, const protocol::JID &, std::string reason, std::string roster_ver);
        void autoAcceptInvitation(const std::string& username);

        std::unique_ptr<protocol::ChatClient>    &mClient;
        std::unique_ptr<EMSemaphoreTracker> mTracker;
        ContactListenerHandler* mContactListeners;
        std::shared_ptr<EMConfigManager> mConfigManager;
        EMDatabasePtr mDatabase;
        EMChatManagerInterface *mChatManager;
        EMSessionManager *mSessionManager;
        EMVector<std::string> myContacts;
        EMVector<std::string> myBlacklist;
    };


}

#endif
