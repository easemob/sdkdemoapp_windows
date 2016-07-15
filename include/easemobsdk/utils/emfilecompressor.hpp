//
//  emfilecompressor.hpp
//  easemob
//
//  Created by Neil Cao on 15/12/18.
//
//

#ifndef emfilecompressor_hpp
#define emfilecompressor_hpp

#include <string>
#include <stdio.h>

#include "emdefs.hpp"

#if HAVE_ZLIB
#include <zlib.h>
#endif

namespace easemob
{

class EMFileCompressor
{
public:
    EMFileCompressor();
    virtual ~EMFileCompressor();

    bool createGZFile(const std::string& path);
    void closeGZFile();
    bool addFileToGZ(const std::string& path);

private:
    EMFileCompressor(const EMFileCompressor&);
    EMFileCompressor& operator=(const EMFileCompressor&);
    size_t write(const void*buf, size_t size);
#if HAVE_ZLIB
    gzFile mFile;
#else
    FILE *mFile;
#endif
};

}

#endif /* emfilecompressor_hpp */
