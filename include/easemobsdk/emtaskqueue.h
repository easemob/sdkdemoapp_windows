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
#ifndef __easemob__EMTaskQueue__
#define __easemob__EMTaskQueue__

#include <thread>
#include <queue>
#include <functional>
#include <list>
#include <mutex>
#include <memory>
#include <condition_variable>

namespace easemob {

class EMTaskQueue
{
public:

    typedef std::function<void()> Task;

    class EMTaskQueueThread
    {
    public:
        /*!
         @brief
         Constructor.
         */
        EMTaskQueueThread();
        
        /*!
         @brief
         Destructor, all cached tasks will be removed after destruct.
         */
        virtual ~EMTaskQueueThread();
        
        /*!
         @brief
         Add a task to task queue.
         */
        void executeTask(Task);
        
        /*!
         @brief
         Get count of cached tasks.
         @return
         Count of cached tasks.
         */
        size_t taskCount();

        /*
         * Clear the waiting task in the mTasks
        */
        void clearTask();

    private:
        /*!
         @brief
         Forbidden copy construct and assign operator.
         */
        EMTaskQueueThread(const EMTaskQueueThread&);
        EMTaskQueueThread& operator=(const EMTaskQueueThread&);
        void main();

        bool mRunning;
        std::queue<Task> mTaskQueue;
        std::recursive_mutex mQueueMutex;
        std::recursive_mutex mRunningMutex;
        std::mutex mConditionMutex;
        std::condition_variable mCondition;
        std::thread mThread;
    };

    /*!
     @brief
     Constructor, will create a thread pool.
     */
    EMTaskQueue(int capability = 1);
    
    /*!
     @brief
     User can only call this method to destroy the task queue, it's a block operate.
     */
    void destroy();

    /**
     *  Clear the waiting task in the each mRunningPool
     */
    void clearTask();
    
    /*!
     @brief
     Add a task to task queue, the task may execute in different threads.
     */
    void addTask(Task);

private:
    /*!
     @brief
     Forbidden copy construct and assign operator.
     */
    EMTaskQueue(const EMTaskQueue&);
    EMTaskQueue& operator=(const EMTaskQueue&);
    
    /*!
     @brief
     Destructor, all cached tasks will be removed after destruct.
     */
    virtual ~EMTaskQueue();
    EMTaskQueueThread *getThread();

    int mCapability;
    std::recursive_mutex mMutex;
    std::list<EMTaskQueueThread*> mRunningPool;
};

typedef std::shared_ptr<EMTaskQueue::EMTaskQueueThread> EMTaskQueueThreadPtr;
typedef std::shared_ptr<EMTaskQueue> EMTaskQueuePtr;

}

#endif /* defined(__easemob__EMTaskQueue__) */
