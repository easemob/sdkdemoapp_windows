#pragma once
#include <emgroupmanager_interface.h>
#include <emgroupmanager_listener.h>

using namespace easemob;
using namespace std;

class GroupManagerListener : public EMGroupManagerListener {
public:
	GroupManagerListener() {
	}
	virtual void onReceiveInviteFromGroup(const std::string groupId, const std::string& inviter, const std::string& inviteMessage);
	virtual void onReceiveInviteAcceptionFromGroup(const EMGroupPtr group, const std::string& invitee);
	virtual void onReceiveInviteDeclineFromGroup(const EMGroupPtr group, const std::string& invitee, const std::string &reason);
	virtual void onAutoAcceptInvitationFromGroup(const EMGroupPtr group, const std::string& inviter, const std::string& inviteMessage);
	virtual void onLeaveGroup(const EMGroupPtr group, EMGroup::EMGroupLeaveReason reason);
	virtual void onReceiveJoinGroupApplication(const EMGroupPtr group, const std::string& from, const std::string& message);
	virtual void onReceiveAcceptionFromGroup(const EMGroupPtr group);
	virtual void onReceiveRejectionFromGroup(const std::string &groupId, const std::string &reason);
	virtual void onUpdateMyGroupList(const std::vector<EMGroupPtr> &list);
};