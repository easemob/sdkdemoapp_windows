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
 ***********************************************************/

#ifndef __easemob__emcollector__
#define __easemob__emcollector__

#include <string>
#include <chrono>
#include <stdio.h>

namespace easemob
{

    class EMTimeTag
    {
    public:
        void start(){
            t1 = std::chrono::system_clock::now();
        }
        
        void stop(){
            t2 = std::chrono::system_clock::now();
        }
        
        std::string timeStr();
        
        long timeSpent() {
            return std::chrono::duration_cast<std::chrono::milliseconds>(t2 - t1).count();
        }
        
    private:
        std::chrono::system_clock::time_point t1;
        std::chrono::system_clock::time_point t2;
    };
    
    class EMCollector
    {
    public:
        EMCollector();
        
        /**
         * \brief Collect login time.
         *
         * @param  tag time spent on login
         * @return NA.
         */
        static void collectLoginTime(EMTimeTag tag);
        
        /**
         * \brief Collect IM login time.
         *
         * @param  tag time spent on IM login
         * @return NA.
         */
        static void collectIMLoginTime(EMTimeTag tag);
        
        /**
         * \brief Collect retrieve token time.
         *
         * @param  tag time spent on retrieve token
         * @return NA.
         */
        static void collectRetrieveTokenTime(EMTimeTag tag);
        
        /**
         * \brief Collect retrieve groups from server time.
         *
         * @param  tag time spent on retrieve groups from server
         * @param  groupCount group count returned from server
         * @return NA.
         */
        static void collectRetrieveGroupsFromServerTime(EMTimeTag tag, int groupCount);
        
        /**
         * \brief Collect retrieve contacts from server time.
         *
         * @param  tag time spent on retrieve contacts from server
         * @param  contactsize contact count returned from server
         * @return NA.
         */
        static void collectRetrieveContactsFromServerTime(EMTimeTag tag, int contactSize);
        
        /**
         * \brief Collect load all conversations time.
         *
         * @param  tag time spent on load all conversations
         * @param  convSize conversation count
         * @param  msgCnt Sum of message count reside in each conversation
         * @return NA.
         */
        static void collectLoadingAllConversations(EMTimeTag tag, int convSize, int msgCnt);
        
        /**
         * \brief Collect load all groups time.
         *
         * @param  tag time spent on load all groups
         * @param  groupCount total group count
         * @return NA.
         */
        static void collectLoadAllLocalGroups(EMTimeTag tag, int groupCount);
        
        /**
         * \brief Collect load all local chat room spent time.
         *
         * @param  tag time spent on load all local chat room
         * @param  roomSize chat room size
         * @return NA.
         */
        static void collectLoadAllLocalChatRooms(EMTimeTag tag, int roomSize);
        
        /**
         * \brief Collect retrieve roster time.
         *
         * @param  tag time spent on retrieve roster
         * @param  size roster item count
         * @return NA.
         */
        static void collectRetrieveRoster(EMTimeTag tag, int size);
        
        /**
         * \brief Collect download file spent time.
         *
         * @param  tag time spent on download file
         * @param  size file length
         * @param  remoteUrl remote URL of download file
         * @return NA.
         */
        static void collectDownloadFileTime(EMTimeTag tag, long size, std::string remoteUrl);
        
        /**
         * \brief Collect upload file spent time
         *
         * @param  tag time spent on upload file
         * @param  size file length
         * @param  mLocalPath upload file local path
         * @return NA.
         */
        static void collectUploadFileTime(EMTimeTag tag, long size, std::string mLocalPath);
        
        /**
         * \brief Collect retrieve group detail spent time.
         *
         * @param  tag time spent on retrieve group detail
         * @param  groupId group id
         * @return NA.
         */
        static void collectRetrieveGroupFromServer(EMTimeTag tag, std::string groupId);
        
    };

}
#endif
