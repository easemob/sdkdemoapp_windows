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
//  emhttprequest.h
//  easemob
//
//  Created by Neil Cao on 15/7/9.
//
//

#ifndef __easemob__EMHttpRequest__
#define __easemob__EMHttpRequest__

#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/document.h"
#include "emattributevalue.h"
#include "emstl.h"

#include <string>
#include <functional>

namespace easemob
{

#define VALIDATE_HTTPSTATUS_CODE(x) ((x) >= 200 && (x) <= 299)

typedef EMVector<std::string> EMHttpHeaders;
typedef EMMap<std::string, EMAttributeValue> EMHttpParameters;
typedef std::function<void(double total, double now)> EMHttpCallback;
typedef std::shared_ptr<EMHttpCallback> EMHttpCallbackPtr;
    
class EMHttpRequest
{
public:

    static const long INVALID_PARAM  = -1;
    static const long HTTP_FAILED    = -2;
    static const long CONNECT_FAILED = -3;
    static const long HTTP_TIMEOUT   = -4;
    static const long NEXT_HOST      = -5;
    static const long RETRY_HOST     = -6;
    static const int  DEFUALT_OPT_TIMEOUT = 40;

    /*!
     @brief
     This constructor is used to create a normal http request.
     */
    EMHttpRequest(const std::string &url, const EMHttpHeaders &headers, const EMHttpParameters &params, long timeout = DEFUALT_OPT_TIMEOUT);
    
    /*!
     @brief
     This constructor is used to create a file upload/download http request.
     */
    EMHttpRequest(const std::string &url, const EMHttpHeaders &headers, const std::string &localPath, long timeout = DEFUALT_OPT_TIMEOUT);
    virtual ~EMHttpRequest() {}
    
    /*!
     @brief
     Set http request retry times, default is 3.
     */
    void setRetryTimes(int retryTimes);
    
    /*!
     @brief
     Perform normal http request.
     */
    long perform(std::string &response);
    
    long performWithMethod(std::string &response, const std::string &method);
    
    /*!
     @brief
     Perform file upload request.
     */
    long upload(std::string &response, const EMHttpCallback &callback = [](double, double){});
    
    /*!
     @brief
     Perform file download request.
     */
    long download(const EMHttpCallback &callback = [](double, double){});
    
    /*!
     @brief
     Get http failure description.
     */
     const std::string& getErrorDesc();
private:
    std::string mUrl;
    std::string mLocalPath;
    std::string mErrorDesc;
    EMHttpHeaders mHeaders;
    EMHttpParameters mParams;
    long mTimeout;
    long mConnectionTimeout;
    int mRetryTimes;
};

}

#endif /* defined(__easemob__EMHttpRequest__) */
