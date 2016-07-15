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
//  EMCmdMessageBody.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMCmdMessageBody__
#define __easemob__EMCmdMessageBody__

#include <string>
#include <vector>
#include "emmessagebody.h"

namespace easemob {

class EMCmdMessageBodyPrivate;

class EASEMOB_API EMCmdMessageBody : public EMMessageBody
{
public:
    typedef std::pair<std::string, std::string> EMCmdParam;
    typedef std::vector<EMCmdParam> EMCmdParams;
    
    /**
      * \brief Command message body constructor.
      *
      * @param  Command action
      * @param  Command parameters
      * @return NA
      */
    EMCmdMessageBody(const std::string& action);
    
    /**
      * \brief Class destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMCmdMessageBody();
    
    /**
      * \brief Get command action.
      *
      * @param  NA
      * @return The command action.
      */
    const std::string& action() const;
    
    /**
     * \brief Set command action.
     *
     * @param  The command action.
     * @return NA
     */
    void setAction(const std::string &action) { mAction = action; }
    
    /**
      * \brief Get command parameters.
      *
      * @param  NA
      * @return The command parameters.
      */
    const EMCmdParams& params() const;
    
    /**
      * \brief Set command parameters.
      *
      * Note: User should not use command parameters any more, and use EMMessage's attribute instead.
      * @param  The command parameters.
      * @return NA
      */
    void setParams(const EMCmdParams&);
    
protected:
    /**
      * \brief Protected constructor.
      *
      * @param  NA
      * @return NA
      */
    EMCmdMessageBody();
    
private:
    /**
      * \brief Class initializer.
      *
      * @param  NA
      * @return NA
      */
    void init();

private:
    EMCmdMessageBody(const EMCmdMessageBody&);
    EMCmdMessageBody& operator=(const EMCmdMessageBody&);
    virtual void dummy() const{}
    std::string mAction;
    EMCmdParams mParams;
    friend class EMCmdMessageBodyPrivate;
    friend class EMMessageEncoder;
};

typedef std::shared_ptr<EMCmdMessageBody> EMCmdMessageBodyPtr;

}

#endif /* defined(__easemob__EMCmdMessageBody__) */
