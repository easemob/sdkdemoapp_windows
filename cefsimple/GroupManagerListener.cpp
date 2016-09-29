#include "GroupManagerListener.h"
#include "application.h"

void GroupManagerListener::onReceiveInviteFromGroup(const std::string groupId, const std::string& inviter, const std::string& inviteMessage)
{
	std::stringstream stream;
	stream << "Demo.conn._onReceiveInviteFromGroup('{user: \"";
	stream << inviter;
	stream << "\",group_id:\"";
	stream << groupId;
	stream << "\",group_name:\"";
	stream << "";
	stream << "\",msg:\"";
	stream << Utils::URLEncode(inviteMessage);
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onReceiveInviteAcceptionFromGroup(const EMGroupPtr group, const std::string& invitee)
{
	std::stringstream stream;
	stream << "Demo.conn._onReceiveInviteAcceptionFromGroup('{user: \"";
	stream << invitee;
	stream << "\",group_id:\"";
	stream << group->groupId();
	stream << "\",group_name:\"";
	stream << "";
	stream << "\",msg:\"";
	stream << "";
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onReceiveInviteDeclineFromGroup(const EMGroupPtr group, const std::string& invitee, const std::string &reason)
{
	std::stringstream stream;
	stream << "Demo.conn._onReceiveInviteDeclineFromGroup('{user: \"";
	stream << invitee;
	stream << "\",group_id:\"";
	stream << group->groupId();
	stream << "\",group_name:\"";
	stream << "";
	stream << "\",msg:\"";
	stream << reason;
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onAutoAcceptInvitationFromGroup(const EMGroupPtr group, const std::string& inviter, const std::string& inviteMessage)
{
	std::stringstream stream;
	stream << "Demo.conn._onAutoAcceptInvitationFromGroup('{user: \"";
	stream << inviter;
	stream << "\",group_id:\"";
	stream << group->groupId();
	stream << "\",group_name:\"";
	stream << group->groupSubject();
	stream << "\",msg:\"";
	stream << Utils::URLEncode(inviteMessage);
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onLeaveGroup(const EMGroupPtr group, EMGroup::EMGroupLeaveReason reason)
{
	std::stringstream stream;
	stream << "Demo.conn._onLeaveGroup('{user: \"";
	stream << "";
	stream << "\",group_id:\"";
	stream << group->groupId();
	stream << "\",group_name:\"";
	stream << "";
	stream << "\",msg:\"";
	switch (reason){
	case EMGroup::BE_KICKED:
	{
		stream << "BE_KICKED";
		break;
	}
	case EMGroup::DESTROYED:
	{
		stream << "DESTROYED";
		break;
	}
	default:
		stream << "BE_KICKED";
	}
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onReceiveJoinGroupApplication(const EMGroupPtr group, const std::string& from, const std::string& message)
{
	std::stringstream stream;
	stream << "Demo.conn._onReceiveJoinGroupApplication('{user: \"";
	stream << from;
	stream << "\",group_id:\"";
	stream << group->groupId();
	stream << "\",group_name:\"";
	stream << "";
	stream << "\",msg:\"";
	stream << message;
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onReceiveAcceptionFromGroup(const EMGroupPtr group)
{
	std::stringstream stream;
	stream << "Demo.conn._onReceiveAcceptionFromGroup('{user: \"";
	stream << "";
	stream << "\",group_id:\"";
	stream << group->groupId();
	stream << "\",group_name:\"";
	stream << group->groupSubject();
	stream << "\",msg:\"";
	stream << "";
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onReceiveRejectionFromGroup(const std::string &groupId, const std::string &reason)
{
	std::stringstream stream;
	stream << "Demo.conn._onReceiveRejectionFromGroup('{user: \"";
	stream << "";
	stream << "\",group_id:\"";
	stream << groupId;
	stream << "\",group_name:\"";
	stream << "";
	stream << "\",msg:\"";
	stream << reason;
	stream << "\"}');";
	Utils::CallJS(stream);
}
void GroupManagerListener::onUpdateMyGroupList(const std::vector<EMGroupPtr> &list)
{
	string ret;
	for (EMGroupPtr group : list)
	{
		ret += "{\"jid\":\"blahblah\",\"name\":\"";
		ret += group->groupSubject();
		ret += "\",\"roomId\":\"";
		ret += group->groupId();
		ret += "\"},";
	}
	if (!ret.empty())
	{
		string tmp = ret.substr(0, ret.length() - 1);
		ret = "Demo.conn._onUpdateMyGroupList('[" + tmp + "]')";
	}
	std::stringstream stream;
	stream << ret;
	Utils::CallJS(stream);
}
