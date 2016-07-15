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
//  EMUtils.h
//  easemob
//
//  Created by Neil Cao on 15/6/25.
//
//

#ifndef __easemob__EMUtils__
#define __easemob__EMUtils__

#include <string>
#include <vector>
#include <vector>
#include <string>
#include <sstream>
#include <memory>
#include <functional>
#include "emdefines.h"


namespace easemob {

class EMMessageBody;
class EMMessage;

class EMUtil
{
public:
    static int getRandom(int max);
};

class EMTimeUtil
{
public:
    static int64_t intTimestamp();
    static int64_t intTimestamp(const std::string&);
    static std::string strTimestamp();
    static std::string strTimestamp(int64_t);
    static int64_t parseDelayTimestamp(const std::string&);
    static std::string localTime();
	static void Sleep(int64_t);
};

class EMStringUtil
{
public:
    static std::string lowercaseString(const std::string&);
    
    template<typename T>
    static std::string convert2String(const T &from)
    {
        std::stringstream stream;
        stream << from;
        return stream.str();
    }
    
    template<typename T>
    static T convertFromString(const std::string& from)
    {
        std::stringstream stream;
        stream << from;
        T to;
        stream >> to;
        return to;
    }
    
    static void split(const std::string& str, const std::string& delim, std::vector<std::string>& ret);
    static std::string trimWhiteSpace(const std::string& str);
    static bool regexUsername(const std::string& username);
    static std::string to_string(int);
};

class EMPathUtil
{
public:
    static std::string lastPathComponent(const std::string &path);
    static std::string filePath(const std::string &path);
    static bool renameFile(const std::string &from, const std::string& to);
    static bool isFileExist(const std::string &path);
    static bool isDirectory(const std::string &path);
    static bool removeFile(const std::string &path);
    static long fileSize(const std::string &path);
    
    std::string userAttachmentsPathForConversation(const std::string &user, const std::string &conversationId);
    std::string dbPath();
    std::string logPath();
    std::string downloadPath();
    std::string dbPathForUser(const std::string &user);
    
    EMPathUtil(const std::string &basePath, const std::string &logPath, const std::string &dlPath);
    virtual ~EMPathUtil() {};
private:
    static void makeDirectory(std::string path);
    std::string mBasePath;
    std::string mLogPath;
    std::string mDownloadPath;
};
typedef std::shared_ptr<EMPathUtil> EMPathUtilPtr;

class EMJidUtil
{
public:
    static std::string userIdFromjid(const std::string &jid, const std::string &appkey);
    static std::string jidFromUserId(const std::string &uid, const std::string &appkey, const std::string& domain);
    static std::string jidFromUserId(const std::string &uid, const std::string &appkey, const std::string& domain, const std::string& resource);
};

class EMMessageIdUtil
{
public:
    static std::string seperateMessageId(const std::string&);
};

}
#endif /* defined(__easemob__EMUtils__) */
