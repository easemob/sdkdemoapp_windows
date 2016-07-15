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
#ifndef EMCORE_LOG_H
#define EMCORE_LOG_H

#include <memory>
#include <iostream>
#include <fstream>
#include <mutex>
#include <chrono>
#include <sstream>

#include "emtaskqueue.h"
#include "emlogcallbackinterface.h"
#include "emstl.h"

namespace easemob {

using std::unique_ptr;
using std::ostringstream;
using std::ofstream;
using std::stringstream;


using easemob::EMTaskQueuePtr;

class EMLog;

class Logstream {
public:
    Logstream() : stream_(new std::ostringstream) {}
    Logstream(bool) {}
    Logstream(Logstream &log_stream);
    ~Logstream();
    template<class T> Logstream &operator<<( T const& input)
    {
        if (stream_.get()) {
            *stream_ << input;
        }
        return *this;
    }
private:
    std::unique_ptr<std::ostringstream> stream_;
};

class EMLog {
public:

    typedef enum
    {
        DEBUG_LEVEL,
        WARNING_LEVEL,
        ERROR_LEVEL
    } EMLogLevel;

    static EMLog& getInstance()
    {
        if (mInstance == nullptr) {
            mInstance = new EMLog();
        }
        return *mInstance;
    }

    /**
     * Weird code explaination:
     *  We have to explicitly destroy EMLog.
     *  EMLog's destructor call EMTaskQueue's destructor, and will call 'lock_guard<recursive_mutex> lock(mMutex);'
     *  mInstance is static variable, if not do it explicitly, will be destroied in the last phase, under Visual studio platform, 
     *  will met exception 'An invalid paramter was passed to a service or function', the root cause is Mutex backend service has be stopped,
     *  it is forbidded to lock(mutex) any more.
     *  Please refer to EMClient::create part.
     */
    static void destroy() {
        if (mInstance != nullptr) {
            delete mInstance;
        }
    }

    Logstream getLogStream();
    Logstream getDebugLogStream();
    Logstream getWarningLogStream();
    Logstream getErrorLogStream();

    void setOutputToConsole(bool b) {mOutputToConsole = b;}
    void setLogPath(const std::string &logPath);
    void setLogLevel(EMLogLevel);
    EMLogLevel getLogLevel() const;
    void addTaskToSave(const std::string message);
    void addLogCallback(EMLogCallbackInterface* aCallback);
    void removeLogCallback(EMLogCallbackInterface* aCallback);
    std::string compress2GZfile(const std::string& gzFileName);

private:
    EMLog();
    ~EMLog();
    EMLog(EMLog const&);
    void operator=(EMLog const&);

    void saveLog(const std::string &message);
    void switchLogFile();
    std::vector<std::string> getLogFiles();
    std::string logPath();
    
    std::unique_ptr<std::ofstream> mLogFile;
    std::recursive_mutex mLogMutex;
    EMTaskQueuePtr mTaskQueue;
    EMTaskQueuePtr mCallbackQueue;
    bool mOutputToConsole;
    long mLogFileSize;
    EMSet<EMLogCallbackInterface*> mLogCallbacks;
    std::string mLogPath;
    EMLogLevel mLogLevel;
	static EMLog *mInstance;
};

}
#endif

