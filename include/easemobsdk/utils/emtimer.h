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
//  EMTimer.h
//  easemob
//
//  Created by Neil Cao on 15/7/7.
//
//

#ifndef __easemob__EMTimer__
#define __easemob__EMTimer__

#include "emsemaphoretracker.h"
#include "emtaskqueue.h"

#include <functional>

namespace easemob {

class EMTimer
{
public:
    typedef enum
    { SUCCESS, CANCEL } Result;
    
    EMTimer(int timeInterval = -1, const std::function<void(Result)> &callback = [](Result){});
    ~EMTimer();
    void cancel();
    void start(int timeInterval, const std::function<void(Result)> &callback);
    bool isRunning() const { return mIsRunning; };
    
private:
    EMSemaphoreTracker::EMSemaphore mSepaphore;
    std::function<void(Result)> mCallback;
    EMTaskQueue::EMTaskQueueThread mThread;
    bool mIsRunning;
};

typedef std::function<void(EMTimer::Result)> EMTimerCallback;

}

#endif /* defined(__easemob__EMTimer__) */
