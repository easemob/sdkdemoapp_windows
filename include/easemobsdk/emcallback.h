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
//  EMCallback.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef easemob_EMAsyncCallback_h
#define easemob_EMAsyncCallback_h

#include "embaseobject.h"
#include "emerror.h"

#include <memory>
#include <functional>
#include <emnetworklistener.h>

namespace easemob {

class EMNetCallback;
class EMCallback;
class EMConnectionListener;

class EASEMOB_API EMCallbackObserverHandle
{
public:
    /**
      * \brief Ovserver handle's constructor.
      *
      * @param  NA
      * @return NA
      */
    EMCallbackObserverHandle() : mEnabled(new bool(true)) {}
    
    /**
      * \brief Ovserver handle's destructor.
      *
      * Note: All related callback will not callback observer after handle is destroied.
      * @param  NA
      * @return NA
      */
    virtual ~EMCallbackObserverHandle() { *mEnabled = false;}
    
private:
    EMCallbackObserverHandle(const EMCallbackObserverHandle&);
    EMCallbackObserverHandle& operator=(const EMCallbackObserverHandle&);
    std::shared_ptr<bool> mEnabled;
    friend EMNetCallback;
    friend EMCallback;
    friend EMConnectionListener;
};

class EASEMOB_API EMNetCallback
{
public:
    typedef std::function<int()> _EMNetCallback;

    /**
     * \brief NetCallback's constructor.
     *
     * @param  Callback ovserver handle.
     * @param  NetStatus callback.
     * @return NA
     */
    EMNetCallback(const EMCallbackObserverHandle &handle,
            const _EMNetCallback callback) :
            mEnabled(handle.mEnabled), mNetCallback(callback)
    {
    }

    /**
     * \brief NetCallback's destructor.
     *
     * @param  NA
     * @return NA
     */
    virtual ~EMNetCallback() {}
    
    /**
     * \brief The success callback of async method.
     *
     * Note: SDK usually notify user by a global listener if this method return false.
     * @param  NA
     * @return Whether callback has been completely processed.
     */
    virtual EMNetworkListener::EMNetworkType getNetState()
    {
        if (*mEnabled == true)
        {
            return EMNetworkListener::EMNetworkType(mNetCallback());
        }
        else
        {
            return EMNetworkListener::WIFI;
        }
    }
    
    bool isEnabled()
    {
        return *mEnabled;
    }
    
private:
    EMNetCallback(const EMNetCallback&);
    EMNetCallback& operator=(const EMNetCallback&);
    
    std::shared_ptr<bool> mEnabled;
    _EMNetCallback mNetCallback;
};

typedef std::shared_ptr<EMNetCallback> EMNetCallbackPtr;
    
    
class EASEMOB_API EMCallback
{
public:
    typedef std::function<bool()> EMSuccessCallback;
    typedef std::function<void(int)> EMProgressCallback;
    typedef std::function<bool(const easemob::EMErrorPtr)> EMFailCallback;
    
    /**
      * \brief Callback's constructor.
      *
      * @param  Callback ovserver handle.
      * @param  Success callback.
      * @param  Fail callback.
      * @param  Progress callback.
      * @return NA
      */
    EMCallback(const EMCallbackObserverHandle &handle,
        const EMSuccessCallback success = []()->bool{ return false; },
        const EMFailCallback fail = [](const easemob::EMErrorPtr)->bool{ return false; },
        const EMProgressCallback progress = [](int){}) :
        mEnabled(handle.mEnabled), mSuccessCallback(success), mProgressCallback(progress), mFailCallback(fail)
    {
    }
    
    /**
      * \brief Callback's destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMCallback() {}
    
    /**
      * \brief The success callback of async method.
      *
      * Note: SDK usually notify user by a global listener if this method return false.
      * @param  NA
      * @return Whether callback has been completely processed.
      */
    virtual bool onSuccess()
    {
        if (*mEnabled == true)
        {
            return mSuccessCallback();
        }
        else
        {
            return false;
        }
    }
    
    /**
      * \brief The fail callback of async method.
      *
      * Note: SDK usually notify user by a global listener if this method return false.
      * @param  The error.
      * @return Whether callback has been completely processed.
      */
    virtual bool onFail(const EMErrorPtr error)
    {
        if (*mEnabled == true)
        {
            return mFailCallback(error);
        }
        else
        {
            return false;
        }
    }
    
    /**
      * \brief The progress callback of async method.
      *
      * @param  The progress.
      * @return NA
      */
    virtual void onProgress(int progress)
    {
        if (*mEnabled == true)
        {
            mProgressCallback(progress);
        }
    }
    
private:
    EMCallback(const EMCallback&);
    EMCallback& operator=(const EMCallback&);
    
    std::shared_ptr<bool> mEnabled;
    EMSuccessCallback mSuccessCallback;
    EMProgressCallback mProgressCallback;
    EMFailCallback mFailCallback;
};

typedef std::shared_ptr<EMCallback> EMCallbackPtr;

}
#endif
