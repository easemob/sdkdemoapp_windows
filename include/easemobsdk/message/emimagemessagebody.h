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
//  EMImageMessageBody.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMImageMessageBody__
#define __easemob__EMImageMessageBody__

#include "emfilemessagebody.h"

#include <string>

namespace easemob {

class EASEMOB_API EMImageMessageBody : public EMFileMessageBody
{
public:
    
    struct Size
    {
        Size(double width = 0.0, double height = 0.0) : mWidth(width), mHeight(height){}
        double mWidth;
        double mHeight;
    };
    
    /**
      * \brief Image message body constructor.
      *
      * @param  NA
      * @return NA
      */
    EMImageMessageBody();
    
    /**
      * \brief Image message body constructor.
      *
      * @param  Image attachment local path.
      * @param  Image thumbnail local path.
      * @return NA
      */
    EMImageMessageBody(const std::string &localPath, const std::string &thumbnailLocalPath);
    
    /**
      * \brief Class destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMImageMessageBody();
    
    /**
      * \brief Set display name of the thumbnail.
      *
      * @param  The display name.
      * @return NA
      */
    void setThumbnailDisplayName(const std::string &);
    
    /**
      * \brief Get display name of the thumbnail.
      *
      * @param  NA
      * @return The display name.
      */
    const std::string& thumbnailDisplayName() const;
    
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
      * \brief Set size of the thumbnail.
      *
      * @param  The thumbnail size.
      * @return NA
      */
    void setThumbnailSize(const Size &);
    
    /**
      * \brief Get size of the thumbnail.
      *
      * @param  NA
      * @return The thumbnail size.
      */
    const Size& thumbnailSize() const;
    
    /**
      * \brief Set file length of the thumbnail.
      *
      * Note: It's usually not necessary to call this method, will calculate file length automatically when setting local path.
      * @param  The file length.
      * @return NA
      */
    void setThumbnailFileLength(int64_t);
    
    /**
      * \brief Get file length of the thumbnail.
      *
      * @param  NA
      * @return The file length.
      */
    int64_t thumbnailFileLength() const;
    
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
      * \brief Set size of the image.
      *
      * @param  The image's size.
      * @return NA
      */
    void setSize(const Size &);
    
    /**
      * \brief Get size of the image.
      *
      * @param  NA
      * @return The image size.
      */
    const Size& size() const;
private:
    /**
      * \brief Class initializer.
      *
      * @param  NA
      * @return NA
      */
    void init();
    
private:
    EMImageMessageBody(const EMImageMessageBody&);
    EMImageMessageBody& operator=(const EMImageMessageBody&);
    //Thumbnail
    std::string mThumbnailDisplayName;
    std::string mThumbnailLocalPath;
    std::string mThumbnailRemotePath;
    std::string mThumbnailSecretKey;
    Size mThumbnailSize;
    int64_t mThumbnailFileLength;
    EMDownloadStatus mThumbnailDownloadStatus;
    
    //Image size
    Size mSize;
};

typedef std::shared_ptr<EMImageMessageBody> EMImageMessageBodyPtr;

}

#endif /* defined(__easemob__EMImageMessageBody__) */
