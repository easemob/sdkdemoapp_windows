#ifndef __easemob__emencryptprovider_interface__
#define __easemob__emencryptprovider_interface__

#include <string>
#include "embaseobject.h"

namespace easemob {
    
    /**
     * Application can customize encrypt method through EMEncryptProvider
     *
     * Note: Virtual method encrypt & decrypt need allocate memroy for *out.
     * Encrypt & decrypt caller take responsiblity to release the memory.
     */
    class EASEMOB_API EMEncryptProviderInterface
    {
    public:
        /**
         * \brief Virtual destructor
         */
        virtual ~EMEncryptProviderInterface() {}
        
        /**
         * \brief Customized encrypt method
         *
         * @param  input Plain message to be encrypted
         * @param  input Plain message length
         * @param  out Encrypted msg, implementation need allocate the memory, and assign to *out.
         * @param  outLen Encrypted msg length.
         * @param  toUserName The msg to be sent to.
         */
        virtual void encrypt(const unsigned char *input, int inLen, unsigned char **out, int &outLen,  std::string toUserName) = 0;
        
        /**
         * \brief Customized decrypt method
         *
         * @param  input Encrypted message to be decrypted
         * @param  input Encrypted message length
         * @param  out Plain message, implementation need allocate the memory, and assign to *out.
         * @param  outLen Plain message length.
         * @param  toUserName The message where is come from.
         */
        virtual void decrypt(const unsigned char *input, int inLen, unsigned char **out, int &outLen,  std::string fromUserName) = 0;
    };
}

#endif
