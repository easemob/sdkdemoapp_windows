#ifndef __easemob_emencryptprovider_
#define __easemob_emencryptprovider_
#include <emencryptprovider_interface.h>
#include <string>

namespace easemob {
    class EMChatManagerInterface;
    
    class EMEncryptProviderImpl : public EMEncryptProviderInterface
    {
    public:
        ~EMEncryptProviderImpl() {};
        virtual void encrypt(const unsigned char *input, int inLen, unsigned char **out, int &outLen,  std::string toUserName);
        virtual void decrypt(const unsigned char *input, int inLen, unsigned char **out, int &outLen,  std::string fromUserName);
    };

    class EMEncryptUtils
    {
    public:
        typedef unsigned char byte;
        static std::string b64Encode(const byte *in, const int len);
        static void b64Decode(const std::string &encryptedMsg, char **b64Out, int &b64OutLen);
        static std::string encryptMessage(EMChatManagerInterface *manager, const std::string &plainMsg, const std::string &toUserName);
        static std::string decryptMessage(EMChatManagerInterface *manager, const std::string &encryptedMsg, const std::string &fromUserName);
    };
}

#endif
