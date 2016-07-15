#include "stdafx.h"
#include <windows.h>
#include <shellapi.h>

#include "group_chat_dialog.hpp"

#include <emgroupmanager_interface.h>



const TCHAR* const kMemberListControlName = _T("members");

GroupChatDialog::GroupChatDialog(const CDuiString& bgimage, DWORD bkcolor, const ListItemInfo& myselft_info, const ListItemInfo& friend_info, std::string conversationID) :ChatDialog(bgimage ,bkcolor, myselft_info, friend_info, conversationID)
{}

GroupChatDialog::~GroupChatDialog()
{
	return;
}


LPCTSTR GroupChatDialog::GetWindowClassName() const
{
	return _T("GroupChatDialog");
}

CControlUI* GroupChatDialog::CreateControl(LPCTSTR pstrClass)
{
	if (_tcsicmp(pstrClass, _T("GroupMemberList")) == 0)
	{
		return new CFriendsUI(m_PaintManager, _T("friend_list_item.xml"));
	}

	return NULL;
}

BOOL GroupChatDialog::Receive(MessageEventParam param)
{
	if (param.sTo == friend_.id)
	{
		AddMsgToRecvEdit(param.sBody.GetData(), param.sAttachmentPath.GetData(), param.sFrom,param.timestamp);
	}

	return TRUE;
}
CDuiString GroupChatDialog::GetSkinFile()
{
	return _T("group_chat_dlg.xml");
}

LRESULT GroupChatDialog::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	return __super::HandleMessage(uMsg, wParam, lParam);
}

void GroupChatDialog::InitWindow()
{
	return __super::InitWindow();
}

void GroupChatDialog::OnPrepare(TNotifyUI& msg)
{
	UpdateMemberList();
	return __super::OnPrepare(msg);
}

void GroupChatDialog::SendMsg()
{
	ITextServices * pTextServices = m_pSendEdit->GetTextServices();

	tstring strText;
	RichEdit_GetText(pTextServices, strText, m_FaceList);

	pTextServices->Release();

	if (strText.size() <= 0)
		return;

	m_pSendEdit->SetText(_T(""));
	m_pSendEdit->SetFocus();

	AddMsgToRecvEdit(strText.c_str(), NULL);

	EMTextMessageBodyPtr body = EMTextMessageBodyPtr(new EMTextMessageBody(Unicode_to_UTF8(strText.c_str())));

	EMMessage::EMChatType type = EMMessage::GROUP;
	EMMessagePtr msg = EMMessage::createSendMessage(g_client->getLoginInfo().loginUser(), utils::Unicode_to_UTF8(friend_.id.GetData()),
		body, type);
	g_client->getChatManager().sendMessage(msg);

}

void GroupChatDialog::Notify(TNotifyUI& msg)
{
	return __super::Notify(msg);
}

void GroupChatDialog::UpdateMemberList()
{
	wstring strAppDir = GetAppDataDirW();
	string sID = getJsonValue(strAppDir + _T("\\") + kAccountsFile, "ID");
	size_t s;
	CTextUI* IDCtrl = static_cast<CTextUI*>(m_PaintManager.FindControl(_T("ID")));
	if (IDCtrl != NULL)
	{
		IDCtrl->SetText(UTF8_to_Unicode(sID.c_str(), &s));
	}

	const string strID = g_client->getLoginInfo().loginUser();

	CFriendsUI* pFriendsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kMemberListControlName));
	if (pFriendsList == NULL)
	{
		return;
	}
	if (pFriendsList->GetCount() > 0)
		pFriendsList->RemoveAll();

	ListItemInfo item;

	Node* root_parent = NULL;

	EMError err;
	std::vector<std::string> mContacts;

	EMGroupPtr group = g_client->getGroupManager().fetchGroupSpecification(utils::Unicode_to_UTF8(friend_.id.GetData()), err);
	std::string sOwner = group->groupOwner();
	CDuiString cs(UTF8_to_Unicode(sOwner.c_str(), &s));
	item.id = cs;
	item.folder = false;
	item.logo = _T("default.png");
	item.nick_name = cs;
	item.description = cs;
	pFriendsList->AddNode(item, root_parent);
	members_.push_back(item);

	const EMGroupMemberList *gml = group->groupMembers();
	for (string username : *gml)
	{
		CDuiString cs(UTF8_to_Unicode(username.c_str(), &s));
		item.id = cs;
		item.folder = false;
		item.logo = _T("default.png");
		item.nick_name = cs;
		item.description = cs;
		pFriendsList->AddNode(item, root_parent);
		members_.push_back(item);
	}
	if (pFriendsList->CanExpand(root_parent))
	{
		pFriendsList->SetChildVisible(root_parent, !root_parent->data().child_visible_);
	}
}
