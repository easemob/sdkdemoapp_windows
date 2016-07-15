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
//  EMVideoMessageBody.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMVideoMessageBody__
#define __easemob__EMVideoMessageBody__

#include "emfilemessagebody.h"

#include <string>

namespace easemob {

class EASEMOB_API EMVideoMessageBody : public EMFileMessageBody
{
public:
    
    struct Size
    {
        Size(double width = 0.0, double height = 0.0) : mWidth(width), mHeight(height){}
        double mWidth;
        double mHeight;
    };
    
    /**
      * \brief Video message body constructor.
      *
      * @param  NA
      * @return NA
      */
    EMVideoMessageBody();
    
    /**
      * \brief Video message body constructor.
      *
      * @param  Video attachment local path.
      * @param  Video thumbnail local path.
      * @return NA
      */
    EMVideoMessageBody(const std::string &localPath, const std::string &thumbnailLocalPath);
    
    /**
      * \brief Class destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMVideoMessageBody();
    
    /**
      * \brief Set local path of the thumbnail.
      *
      * @param  The local path.
      * @return NA
      */
    void setThumbnailLocalPath(const std::string &);
    
    /**
      * \brief Get local path of the thumbnail.
      *
      * @param  NA
      * @return The local path.
      */
    const std::string& thumbnailLocalPath() const;
    
    /**
      * \brief Set remote path of the thumbnail.
      *
      * Note: It's internal used, user should never need to call this method.
      * @param  The remote path.
      * @return NA
      */
    void setThumbnailRemotePath(const std::string &);
    
    /**
      * \brief Get remote path of the thumbnail.
      *
      * @param  NA
      * @return The remote path.
      */
    const std::string& thumbnailRemotePath() const;
    
    /**
      * \brief Set secret key of the thumbnail.
      *
      * Note: It's internal used, user should never need to call this method.
      * @param  The secret key.
      * @return NA
      */
    void setThumbnailSecretKey(const std::string &);
    
    /**
      * \brief Get secret key of the thumbnail.
      *
      * @param  NA
      * @return The secret key.
      */
    const std::string& thumbnailSecretKey() const;
    
    /**
      * \brief Set download status of the thumbnail.
      *
      * Note: Usually, user should NOT call this method directly.
      * @param  The download status.
      * @return NA
      */
    void setThumbnailDownloadStatus(EMDownloadStatus);
    
    /**
      * \brief Get download status of the thumbnail.
      *
      * @param  NA
      * @return The download status.
      */
    EMDownloadStatus thumbnailDownloadStatus() const;
    
    /**
      * \brief Set size of the video.
      *
      * @param  The video's size.
      * @return NA
      */
    void setSize(const Size &);
    
    /**
      * \brief Get size of the video.
      *
      * @param  NA
      * @return The video size.
      */
    const Size& size() const;
    
    /**
      * \brief Get playing duration of the video.
      *
      * @param  NA
      * @return The video playing duration.
      */
    int duration() const;
    
    /**
      * \brief Set playing duration of the video.
      *
      * @param  The video's playing duration.
      * @return NA
      */
    void setDuration(int);
private:
    /**
      * \brief Class initializer.
      *
      * @param  NA
      * @return NA
      */
    void init();
    
private:
    EMVideoMessageBody(const EMVideoMessageBody&);
    EMVideoMessageBody& operator=(const EMVideoMessageBody&);
    //Thumbnail
    std::string mThumbnailLocalPath;
    std::string mThumbnailRemotePath;
    std::string mThumbnailSecretKey;
    EMDownloadStatus mThumbnailDownloadStatus;
    
    //Video
    Size mSize;
    int mDuration;
};
typedef std::shared_ptr<EMVideoMessageBody> EMVideoMessageBodyPtr;
}

#endif /* defined(__easemob__EMVideoMessageBody__) */
