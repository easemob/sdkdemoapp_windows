#include "stdafx.h"
#include <windows.h>
#include <shellapi.h>

#include "chatroom_chat_dialog.hpp"

#include <emchatroommanager_interface.h>


const TCHAR* const kMemberListControlName = _T("members");
ChatroomChatDialog::ChatroomChatDialog(const CDuiString& bgimage, DWORD bkcolor, const ListItemInfo& myselft_info, const ListItemInfo& friend_info, std::string conversationID) :ChatDialog(bgimage ,bkcolor, myselft_info, friend_info, conversationID)
{}

ChatroomChatDialog::~ChatroomChatDialog()
{
	return;
}

LPCTSTR ChatroomChatDialog::GetWindowClassName() const
{
	return _T("ChatroomChatDialog");
}

CControlUI* ChatroomChatDialog::CreateControl(LPCTSTR pstrClass)
{
	if (_tcsicmp(pstrClass, _T("GroupMemberList")) == 0)
	{
		return new CFriendsUI(m_PaintManager, _T("friend_list_item.xml"));
	}

	return NULL;
}

BOOL ChatroomChatDialog::Receive(MessageEventParam param)
{
	if (param.sTo == friend_.id)
	{
		AddMsgToRecvEdit(param.sBody.GetData(), param.sAttachmentPath.GetData(), param.sFrom,param.timestamp);
	}

	return TRUE;
}
CDuiString ChatroomChatDialog::GetSkinFile()
{
	return _T("chatroom_chat_dlg.xml");
}


LRESULT ChatroomChatDialog::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	return __super::HandleMessage(uMsg, wParam, lParam);
}

void ChatroomChatDialog::InitWindow()
{
	return __super::InitWindow();
}

void ChatroomChatDialog::OnPrepare(TNotifyUI& msg)
{
	EMError err;
	g_client->getChatroomManager().joinChatroom(utils::Unicode_to_UTF8(friend_.id.GetData()), err);
	return __super::OnPrepare(msg);
}

void ChatroomChatDialog::SendMsg()
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

	EMMessage::EMChatType type = EMMessage::CHATROOM;
	EMMessagePtr msg = EMMessage::createSendMessage(g_client->getLoginInfo().loginUser(), utils::Unicode_to_UTF8(friend_.id.GetData()),
		body, type);
	g_client->getChatManager().sendMessage(msg);

}

void ChatroomChatDialog::Notify(TNotifyUI& msg)
{
	return __super::Notify(msg);
}
