//
//  emticket.h
//  easemob
//
//  Created by dhc on 15/8/19.
//
//

#ifndef __easemob__emticket__
#define __easemob__emticket__

#include <stdio.h>
#include <string>
#include <mutex>
#include <map>
#include <vector>
#include "emdefines.h"

#include "emdefines.h"

namespace easemob {

/*
 <ConferencePacketExtension xmlns='urn:xmpp:media-conference'>
 <username>xcvbnm</username>
 <conferenceId>voicep2p-9ed2533c-a316-4d79-8e1d-ac3b96876b0d</conferenceId>
 <serverIp>123.57.4.213</serverIp>
 <rcode>1341102233</rcode>
 <serverPort>5000</serverPort>
 <channelId>3</channelId>
 </ConferencePacketExtension>
 */
class EASEMOB_API EMTicket
{
public:
    EMTicket();
    EMTicket( const std::string& username);
    virtual ~EMTicket();
    
    std::string mId;
    std::string mIp;
    int mPort;
    std::string mRcode;
    int mChannelId;
    int mVchannelId;
    std::string mUsername;
};
    
class EASEMOB_API EMTicketPair
{
public:
    
    EMTicketPair( int pId);
    virtual ~EMTicketPair();
    
    int mId;
    EMTicket *mLocalTicket;
    EMTicket *mRemoteTicket;
private:
    EMTicketPair(const EMTicketPair&);
    EMTicketPair& operator=(const EMTicketPair&);
};
    
}


#endif /* defined(__easemob__emticket__) */
