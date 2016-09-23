#include "GroupManagerListener.h"
#include "application.h"

void GroupManagerListener::onReceiveInviteFromGroup(const std::string groupId, const std::string& inviter, const std::string& inviteMessage)
{
	std::stringstream stream;
	stream << "Demo.conn.onRoster('{subscription: \"from\",name : \"";
	stream << groupId;
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onReceiveInviteAcceptionFromGroup(const EMGroupPtr group, const std::string& invitee)
{
}
void GroupManagerListener::onReceiveInviteDeclineFromGroup(const EMGroupPtr group, const std::string& invitee, const std::string &reason)
{
}
void GroupManagerListener::onAutoAcceptInvitationFromGroup(const EMGroupPtr group, const std::string& inviter, const std::string& inviteMessage)
{
}
void GroupManagerListener::onLeaveGroup(const EMGroupPtr group, EMGroup::EMGroupLeaveReason reason)
{
}
void GroupManagerListener::onReceiveJoinGroupApplication(const EMGroupPtr group, const std::string& from, const std::string& message)
{
}
void GroupManagerListener::onReceiveAcceptionFromGroup(const EMGroupPtr group)
{
}
void GroupManagerListener::onReceiveRejectionFromGroup(const std::string &groupId, const std::string &reason)
{
}
void GroupManagerListener::onUpdateMyGroupList(const std::vector<EMGroupPtr> &list)
{
}
