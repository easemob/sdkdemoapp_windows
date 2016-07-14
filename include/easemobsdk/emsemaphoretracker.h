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
#ifndef __easemob__EMSemaphoreTracker__
#define __easemob__EMSemaphoreTracker__

#include <condition_variable>
#include <mutex>
#include <string>
#include <memory>
#include "emstl.h"

namespace easemob {
    
class EMSemaphoreTracker
{
public:

    typedef enum
    {
        INVALID = -1,
        SUCCESS,
        TIMEOUT,
        CANCEL
    } Result;

    class EMSemaphore
    {
    public:
        /*!
         @brief
         Constructor.
         */
        EMSemaphore() : mResult(INVALID), mFlag(0) {}
        
        /*!
         @brief
         Destructor, wait will return Cancel after destruct.
         */
        virtual ~EMSemaphore();
        
        /*!
         @brief
         Block the caller threads, until timeout or another thread notify or cancel this semaphore.
         */
        Result wait(long milliseconds = -1);
        
        /*!
         @brief
         Block the caller threads, until timeout or another thread notify or cancel this semaphore.
         */
        Result wait(int& flag, long milliseconds = -1);
        
        /*!
         @brief
         Wake up the blocked threads which called wait, wait return Success.
         */
        void notify();
        
        /*!
         @brief
         Wake up the blocked threads which called wait, wait return Success.
         */
        void notify(int flag);
        
        /*!
         @brief
         Cancel the semaphore, the blocked threads will be waked up, and wait will return Cancel.
         */
        void cancel();
        
        /*!
         @brief
         Cancel the semaphore, the blocked threads will be waked up, and wait will return Cancel.
         */
        void cancel(int flag);

    private:
        EMSemaphore(const EMSemaphore&);
        EMSemaphore& operator=(const EMSemaphore&);
        std::mutex mMutex;
        std::condition_variable mCondition;
        Result mResult;
        int mFlag;
    };

    /*!
     @brief
     Constructor.
     */
    EMSemaphoreTracker() {}
    
    /*!
     @brief
     Destructor, all wait semaphores will return Cancel after destruct.
     */
    virtual ~EMSemaphoreTracker() { removeAll(); }

    /*!
     @brief
     Block the caller threads, until timeout or another thread notify or cancel this semaphore.
     @return
     Wait result, Sucess, Timeout or Cancel.
     */
    Result wait(const std::string &identifier, long milliseconds = -1);
    
    /*!
     @brief
     Block the caller threads, until timeout or another thread notify or cancel this semaphore.
     @return
     Wait result, Sucess, Timeout or Cancel.
     */
    Result wait(const std::string &identifier, int& flag, long milliseconds = -1);
    
    /*!
     @brief
     Check if a semaphore with identifier is waiting.
     @return
     true if the identifier is waiting.
     */
    bool isWaiting(const std::string &identifier);
    
    /*!
     @brief
     Wake up the blocked threads which called wait, wait return Success.
     @return
     Return false if the tracker doesn't contain a semaphore named the identifier, otherwise will return true.
     */
    bool notify(const std::string &identifier);
    
    /*!
     @brief
     Wake up the blocked threads which called wait, wait return Success.
     @return
     Return false if the tracker doesn't contain a semaphore named the identifier, otherwise will return true.
     */
    bool notify(const std::string &identifier, int flag);
    
    /*!
     @brief
     Cancel the semaphore, the blocked threads will be waked up, and wait will return Cancel.
     @return
     Return false if the tracker doesn't contain a semaphore named the identifier, otherwise will return true.
     */
    bool cancel(const std::string &identifier);
    
    /*!
     @brief
     Cancel the semaphore, the blocked threads will be waked up, and wait will return Cancel.
     @return
     Return false if the tracker doesn't contain a semaphore named the identifier, otherwise will return true.
     */
    bool cancel(const std::string &identifier, int flag);
    
    /*!
     @brief
     Notify the semaphore if filter contains semaphore's identifier.
     @return
     Return false if the tracker doesn't contain a semaphore, otherwise will return true.
     */
    bool filter(const std::string &filter);
    
    /*!
     @brief
     Get the count of semaphores.
     @return
     The count of semaphores
     */
    size_t count();
    
    /*!
     @brief
     Cancel and remove all semaphores, wait will return Cancel.
     */
    void removeAll();
    
    /*!
     @brief
     Cancel and remove all semaphores, wait will return Cancel.
     */
    void removeAll(int flag);

private:
    EMSemaphoreTracker(const EMSemaphoreTracker&);
    EMSemaphoreTracker& operator=(const EMSemaphoreTracker&);
    EMMap<std::string, std::shared_ptr<EMSemaphore> > mSemaphoreMap;
};

typedef std::shared_ptr<EMSemaphoreTracker::EMSemaphore> EMSemaphorePtr;
typedef std::shared_ptr<EMSemaphoreTracker> EMSemaphoreTrackerPtr;

}

#endif /* defined(__Easemob__EMSemaphoreTracker__) */
