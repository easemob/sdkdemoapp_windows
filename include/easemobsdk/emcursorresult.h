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

#ifndef __easemob__EMCursorResult__
#define __easemob__EMCursorResult__

#include <vector>
#include <string>

#include "embaseobject.h"

namespace easemob
{

class EASEMOB_API EMCursorResult : public EMBaseObject
{
public:
    EMCursorResult(const std::vector<EMBaseObjectPtr> &result, const std::string &nextPageCursor) :
        mResult(result), mNextPageCursor(nextPageCursor) {}
    virtual ~EMCursorResult() {};
    
    EMCursorResult(const EMCursorResult &a) {
        mResult = a.mResult;
        mNextPageCursor = a.mNextPageCursor;
    }
    
    /**
      * \brief Get cursor of next page.
      *
      * @param  NA
      * @return The cursor.
      */
    const std::string& nextPageCursor() const { return mNextPageCursor; }
    
    /**
      * \brief Get the result of current page.
      *
      * @param  NA
      * @return The result.
      */
    const std::vector<EMBaseObjectPtr>& result() const { return mResult; }
    
private:
    std::vector<EMBaseObjectPtr> mResult;
    std::string mNextPageCursor;
};

}

#endif /* defined(__easemob__EMCursorResult__) */
