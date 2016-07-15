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
#ifndef EMCORE_CONTACT_MANAGER_H
#define EMCORE_CONTACT_MANAGER_H

#include <string>
#include <vector>
#include "emerror.h"

using namespace std;

namespace easemob {
  
class EMContactListener;

class EASEMOB_API EMContactManagerInterface {
public:
	virtual ~EMContactManagerInterface() { };

    /**
     * \brief register contact status change listener
     *
     * @param  listener contact status change listener
     */
    virtual void registerContactListener(EMContactListener* listener) = 0;
    
    /**
     * \brief remove registration of contact status change listener
     *
     * @param  listener contact status change listener
     */
    virtual void removeContactListener(EMContactListener* listener) = 0;

    /**
     * \brief retrieve current user's friend list from server.
     *
     * @return  contact list
     */
    virtual std::vector<std::string> allContacts(EMError &error) = 0;

    /**
     * \brief retrieve current user's friend list from server.
     *
     * @return  contact list
     */
    virtual std::vector<std::string> getContactsFromServer(EMError &error) = 0;

    /**
     * \brief retrieve current user's friend list from local database.
     *
     * @return  contact list
     */
    virtual std::vector<std::string> getContactsFromDB(EMError &error) = 0;

    /**
     * \brief invite contact to be friend, need contact accept.
     *
     * @param  username contact to be invited.
     * @param  message contact will receive the message when got invitation.
     */
    virtual void inviteContact(const std::string& username, const std::string& message, EMError &error) = 0;

    /**
     * \brief delete contact from contact list.
     * contact part will auto be removed friend relationship.
     *
     * @param  username contact to be invited.
     */
    virtual void deleteContact(const std::string& username, EMError &error) = 0;
    
    /**
     * \brief accept contact's invitation
     *
     * @param  username contact who initiate invitation.
     */
    virtual void acceptInvitation(const std::string& username, EMError &error) = 0;
    
    /**
     * \brief decline contact's invitation
     *
     * @param  username contact who initiate invitation.
     */
    virtual void declineInvitation(const std::string& username, EMError &error) = 0;

    // -------------------------- blacklist --------------------------
    /**
     * \brief retrieve black list from memory
     *
     * @return  black list of current user, contacts in the block list can not send message or
     * inviation to user
     */
    virtual std::vector<std::string> blacklist(EMError &error) = 0;

    /**
     * \brief retrieve black list from server
     *
     * Note: sync operation.
     * returned result will also be updated in database.
     * @return  black list of current user, contacts in the block list can not send message or
     * inviation to user
     */
    virtual std::vector<std::string> getBlackListFromServer(EMError &error) = 0;

    /**
     * \brief retrieve black list from local database
     *
     * @return  black list of current user which stored in local database.
     */
    virtual std::vector<std::string> getBlackListFromDB(EMError &error) = 0;

    /**
     * \brief save black list.
     *
     * Note: sync operation.
     * black list will be sent to server and local database will also updated.
     * @param  blacklist contacts in the block list can not send message
     * inviation to user
     */
    virtual void saveBlackList(const std::vector<std::string> &blacklist, EMError &error) = 0;

    /**
     * \brief add contact to blacklist
     *
     * Note: sync operation
     * new item will updated to remote server, and also update local database.
     * @param  username contact to be added to blacklist
     * @param  both whether both side will be blocked, if true user also can not subscribe contact's presense. both = false is not work yet, current behaviour is both side conmunication will be blocded.
     */
    virtual void addToBlackList(std::string username, bool both, EMError &error) = 0;

    /**
     * \brief remove contact from black list
     *
     * Note: sync operation
     * new item will updated to remote server, and also update local database.
     * @param  username contact to be removed from blacklist
     */
    virtual void removeFromBlackList(std::string username, EMError &error) = 0;
};

}
#endif
