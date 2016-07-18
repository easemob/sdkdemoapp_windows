#include "stdafx.h"
#include <windows.h>
#if !defined(UNDER_CE)
#include <shellapi.h>
#endif

#include "main_frame.hpp"
#include "color_skin.hpp"
#include "chat_dialog.hpp"
#include "group_chat_dialog.hpp"
#include "chatroom_chat_dialog.hpp"
#include "application.h"
#include "emcontactmanager_interface.h"
#include "emchatroommanager_interface.h"
#include "emerror.h"
#include "utils.h"
#include "emlogininfo.h"
#include <emchatmanager_interface.h>
#include <emcontactmanager_interface.h>
#include <message/emtextmessagebody.h>
#include <message/emcmdmessagebody.h>
#include <message/emimagemessagebody.h>
#include <message/emfilemessagebody.h>
#include <message/emlocationmessagebody.h>
#include <message/emvideomessagebody.h>
#include <message/emvoicemessagebody.h>
#include <message/emmessagebody.h>
#include <message/emfilemessagebody.h>
#include "emoticon/UIMenu.h"

#include "FinderDlg.hpp"
#include "ProfileDlg.hpp"

using namespace std;
using namespace easemob;
using namespace utils;

const TCHAR* const kTitleControlName = _T("apptitle");
const TCHAR* const kCloseButtonControlName = _T("closebtn");
const TCHAR* const kMinButtonControlName = _T("minbtn");
const TCHAR* const kMaxButtonControlName = _T("maxbtn");
const TCHAR* const kRestoreButtonControlName = _T("restorebtn");

const TCHAR* const kTabControlName = _T("tabs");

const TCHAR* const kFriendButtonControlName = _T("friendbtn");
const TCHAR* const kGroupButtonControlName = _T("groupbtn");
const TCHAR* const kChatroomButtonControlName = _T("chatroombtn");

const TCHAR* const kFriendsListControlName = _T("friends");
const TCHAR* const kGroupsListControlName = _T("groups");
const TCHAR* const kChatroomListControlName = _T("chatroom");

const TCHAR* const kHideLeftMainPannelControlName = _T("btnleft");
const TCHAR* const kShowLeftMainPannelControlName = _T("btnright");
const TCHAR* const kLeftMainPannelControlName = _T("LeftMainPanel");

const TCHAR* const kSignatureTipsControlName = _T("signaturetip");
const TCHAR* const kSignatureControlName = _T("signature");

const TCHAR* const kSearchEditTipControlName = _T("search_tip");
const TCHAR* const kSearchEditControlName = _T("search_edit");

const TCHAR* const kChangeBkSkinControlName = _T("bkskinbtn");
const TCHAR* const kChangeColorSkinControlName = _T("colorskinbtn");

const TCHAR* const kBackgroundControlName = _T("bg");

const int kBackgroundSkinImageCount = 3;

const TCHAR* const kFinderControlName = _T("finder");
const TCHAR* const kMainMenuButtonName = _T("MainMenu");
const TCHAR* const kAvatarButtonName = _T("avatar");

const char* const kFinderWndName = "finder";
const char* const kProfileWndName = "profile";

typedef struct _tagMessageInfo{
	EMMessageBody::EMMessageBodyType type;
	EMMessage::EMChatType chatType;
	CDuiString sBody;
	CDuiString sFrom;
	CDuiString sTo;
	CDuiString sNickname;
	EMMessage::EMMessageDirection direction;
	CDuiString sAttachmentPath;
	int64_t timestamp;
} MessageInfo;

typedef enum
{
	ASYNC_BROADCAST_MESSAGE,
	ASYNC_BROADCAST_CONTACT_LIST_CHANGED
} ASYNC_BROADCAST_TYPE;


class ChatListener : public EMChatManagerListener {
public:
	ChatListener(HWND hwnd) {
		m_hwndHideWnd = hwnd;
	}
	virtual void onReceiveMessages(const EMMessageList &messages) {
		for (EMMessagePtr msg : messages)
		{
			const vector<EMMessageBodyPtr> &bodies = msg->bodies();
			const EMMessageBodyPtr _body = bodies[0];
			MessageInfo *mi = new MessageInfo();
			switch (_body->type())
			{
				case EMMessageBody::TEXT:
				{
					EMTextMessageBodyPtr body = std::dynamic_pointer_cast<EMTextMessageBody, EMMessageBody>(_body);
					string sBody = body->text();
					size_t s;
					CDuiString csBody(UTF8_to_Unicode(sBody.c_str(), &s));
					mi->sBody = csBody;
					CDuiString csFrom(UTF8_to_Unicode(msg->from().c_str(), &s));
					mi->sFrom = csFrom;
					CDuiString csTo(UTF8_to_Unicode(msg->to().c_str(), &s));
					mi->sTo = csTo;
					mi->type = _body->type();
					mi->direction = msg->msgDirection();
					mi->sAttachmentPath = _T("");
					mi->chatType = msg->chatType();
					mi->timestamp = msg->timestamp()/1000;
					PostMessage(m_hwndHideWnd, CHideWnd::WM_ASYNC_BROADCAST, (WPARAM)ASYNC_BROADCAST_MESSAGE, (LPARAM)mi);
					break;
				}
				case EMMessageBody::COMMAND:
				case EMMessageBody::IMAGE:
				{
					EMImageMessageBodyPtr body = std::dynamic_pointer_cast<EMImageMessageBody, EMMessageBody>(_body);
					string sBody = body->displayName();
					string sLocalPath = body->localPath();
					size_t s;
					CDuiString csBody(UTF8_to_Unicode(sBody.c_str(), &s));
					mi->sBody = csBody;
					CDuiString csFrom(UTF8_to_Unicode(msg->from().c_str(), &s));
					mi->sFrom = csFrom;
					mi->type = _body->type();
					mi->timestamp = msg->timestamp() / 1000;
					mi->direction = msg->msgDirection();
					mi->sAttachmentPath = UTF8_to_Unicode(sLocalPath.c_str(),&s);
					EMCallbackPtr msgCallback(new EMCallback(m_coh,
						[=](void)->bool
							{
								if (EMFileMessageBody::SUCCESSED == body->downloadStatus() && EMFileMessageBody::SUCCESSED == body->thumbnailDownloadStatus())
								{
									PostMessage(m_hwndHideWnd, CHideWnd::WM_ASYNC_BROADCAST, (WPARAM)ASYNC_BROADCAST_MESSAGE, (LPARAM)mi);
								}
								return true;
							}, 
						[=](const easemob::EMErrorPtr)->bool
							{ 
								return false;
							}, 
						[](int){}));
					msg->setCallback(msgCallback);

					g_client->getChatManager().downloadMessageAttachments(msg);

					break;
				}

				case EMMessageBody::VOICE:
				case EMMessageBody::VIDEO:
				case EMMessageBody::LOCATION:
				{
					break;
				}
			}
		}


	}
private:
	HWND m_hwndHideWnd;
	EMCallbackObserverHandle m_coh;

};

class ContactListener : public EMContactListener {
public:
	ContactListener(HWND hwnd) {
		m_hwndHideWnd = hwnd;
	}
	virtual void onContactAdded(const std::string &username)
	{
		size_t sz;
		CDuiString strText = UTF8_to_Unicode(username.c_str(), &sz);
		strText += _T(" added!");
		::MessageBox(NULL, strText, _T("Tip"), MB_OK);
		PostMessage(m_hwndHideWnd, CHideWnd::WM_ASYNC_BROADCAST, (WPARAM)ASYNC_BROADCAST_CONTACT_LIST_CHANGED, (LPARAM)0);
	}
	virtual void onContactDeleted(const std::string &username)
	{
		size_t sz;
		CDuiString strText = UTF8_to_Unicode(username.c_str(), &sz);
		strText += _T(" deleted!");
		::MessageBox(NULL, strText, _T("Tip"), MB_OK);
		PostMessage(m_hwndHideWnd, CHideWnd::WM_ASYNC_BROADCAST, (WPARAM)ASYNC_BROADCAST_CONTACT_LIST_CHANGED, (LPARAM)0);
	}
	virtual void onContactInvited(const std::string &username, std::string &reason)
	{
		size_t sz;
		CDuiString strText = _T("Received invitation from ");
		strText += UTF8_to_Unicode(username.c_str(), &sz);
		strText += _T(" with the reason:");
		strText += UTF8_to_Unicode(reason.c_str(), &sz);
		EMError err;
		int ret = ::MessageBox(NULL, strText, _T("Tip"), MB_YESNO);
		if (ret == IDYES)
		{
			g_client->getContactManager().acceptInvitation(username, err);
		}
		else
		{
			g_client->getContactManager().declineInvitation(username, err);
		}
	}
	virtual void onContactAgreed(const std::string &username)
	{
		size_t sz;
		CDuiString strText = UTF8_to_Unicode(username.c_str(), &sz);
		strText += _T(" has agreed to be your friend!");
		::MessageBox(NULL, strText, _T("Tip"), MB_OK);
	}
	virtual void onContactRefused(const std::string &username)
	{
		size_t sz;
		CDuiString strText = UTF8_to_Unicode(username.c_str(), &sz);
		strText += _T(" has refused to be your friend!");
		::MessageBox(NULL,  strText, _T("Tip"),MB_OK);
	}
private:
	HWND m_hwndHideWnd;
};

long WINAPI WndProc(HWND hWnd, UINT iMessage, UINT wParam, LONG lParam) {
	CHideWnd* pthis = (CHideWnd*)GetWindowLong(hWnd, GWL_USERDATA);

	switch (iMessage)  {
	case CHideWnd::WM_ASYNC_BROADCAST:
		if (pthis != NULL) {
			pthis->OnAsyncBroadcast(wParam, lParam);
		}
		break;

	default:
		return DefWindowProc(hWnd, iMessage, wParam, lParam);
	}
	return 0;
}

bool CHideWnd::init() {
	WNDCLASS wc;
	ZeroMemory(&wc, sizeof(wc));
	wc.lpfnWndProc = WndProc;
	wc.lpszClassName = L"AsyncBroadcastWnd";
	wc.cbWndExtra = sizeof(void*);

	RegisterClass(&wc);
	m_hwnd = CreateWindow(wc.lpszClassName, NULL,
		WS_POPUP, 0, 0, 0, 0, NULL, NULL, wc.hInstance, NULL);

	if (m_hwnd != NULL) {
		SetWindowLong(m_hwnd, GWL_USERDATA, (LONG) this);
		return true;
	}
	else {
		return false;
	}
}

bool CHideWnd::OnAsyncBroadcast(WPARAM wParam, LPARAM lParam) {
	 
	m_pOwner->BroadCastAsync(wParam, lParam);

	return 1;
}

MainFrame::MainFrame(HWND hwndLoginDlg)
: bk_image_index_(0)
{
	m_hwndLoginDlg = hwndLoginDlg;
	m_Wnd = new CHideWnd(this);
	g_WndManager = new CWndManager();
}

MainFrame::~MainFrame()
{
	g_client->getContactManager().removeContactListener(mContactListener);
	if (m_isLogout)
	{
		::ShowWindow(m_hwndLoginDlg, SW_SHOW);
	}
	else
	{
		g_client->logout();
		PostQuitMessage(0);
	}
}

LPCTSTR MainFrame::GetWindowClassName() const
{
	return _T("TXGuiFoundation");
}

CControlUI* MainFrame::CreateControl(LPCTSTR pstrClass)
{
	if (_tcsicmp(pstrClass, _T("FriendList")) == 0)
	{
		return new CFriendsUI(m_PaintManager, _T("friend_list_item.xml"));
	}
	else if (_tcsicmp(pstrClass, _T("GroupList")) == 0)
	{
		return new CFriendsUI(m_PaintManager, _T("group_list_item.xml"));
	}
	else if (_tcsicmp(pstrClass, _T("Chatroom")) == 0)
	{
		return new CFriendsUI(m_PaintManager, _T("chatroom_list_item.xml"));
	}

	return NULL;
}

void MainFrame::OnFinalMessage(HWND hWnd)
{
	WindowImplBase::OnFinalMessage(hWnd);
	delete this;
}

CDuiString MainFrame::GetSkinFile()
{
	return _T("main_frame.xml");
}

CDuiString MainFrame::GetSkinFolder()
{
	return  _T("skin\\EMRes\\");
}

LRESULT MainFrame::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	if (uMsg == WM_MENU)
	{
		CControlUI * pControl = (CControlUI *)lParam;
		if (pControl != NULL)
			this->m_PaintManager.SendNotify(pControl, _T("menu_msg"), wParam, lParam);
	}
	return __super::HandleMessage(uMsg, wParam, lParam);

}

LRESULT MainFrame::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

LRESULT MainFrame::OnSysCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
#if defined(WIN32) && !defined(UNDER_CE)
	BOOL bZoomed = ::IsZoomed(m_hWnd);
	LRESULT lRes = CWindowWnd::HandleMessage(uMsg, wParam, lParam);
	if (::IsZoomed(m_hWnd) != bZoomed)
	{
		if (!bZoomed)
		{
			CControlUI* pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kMaxButtonControlName));
			if( pControl ) pControl->SetVisible(false);
			pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kRestoreButtonControlName));
			if( pControl ) pControl->SetVisible(true);
		}
		else 
		{
			CControlUI* pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kMaxButtonControlName));
			if( pControl ) pControl->SetVisible(true);
			pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kRestoreButtonControlName));
			if( pControl ) pControl->SetVisible(false);
		}
	}
#else
	return __super::OnSysCommand(uMsg, wParam, lParam, bHandled);
#endif

	return 0;
}

LRESULT MainFrame::ResponseDefaultKeyEvent(WPARAM wParam)
{
	if (wParam == VK_RETURN)
	{
		return FALSE;
	}
	else if (wParam == VK_ESCAPE)
	{
		return TRUE;
	}
	return FALSE;
}

void MainFrame::OnTimer(TNotifyUI& msg)
{
}

void MainFrame::OnExit(TNotifyUI& msg)
{
	Close();
}

void MainFrame::InitWindow()
{
	bg_color_ = getBgColor();
	bg_img_ = getBgImg();
}

DWORD MainFrame::GetBkColor()
{
	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
		return background->GetBkColor();

	return 0;
}

void MainFrame::SetBkColor(DWORD dwBackColor)
{
	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
	{
		background->SetBkImage(_T(""));
		background->SetBkColor(dwBackColor);
		background->NeedUpdate();

		SkinChangedParam param;
		param.bkcolor = background->GetBkColor();
		param.bgimage = background->GetBkImage();
		skin_changed_observer_.Broadcast(param);
	}
}

void MainFrame::UpdateFriendsList()
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

	CFriendsUI* pFriendsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kFriendsListControlName));
	if (pFriendsList == NULL)
	{
		return;
	}
	if (!friends_.empty())
		friends_.clear();
	if (pFriendsList->GetCount() > 0)
		pFriendsList->RemoveAll();

	ListItemInfo item;

	item.id = _T("0");
	item.folder = true;
	item.empty = false;
	item.nick_name = _T("我的好友");

	Node* root_parent = pFriendsList->AddNode(item, NULL);
	friends_.push_back(item);

	item.id = _T("1");
	item.folder = false;
	item.logo = _T("man.png");
	item.nick_name = UTF8_to_Unicode(sID.c_str(), &s);
	item.description = _T("tojen.me@gmail.com");

	myself_info_ = item;

	pFriendsList->AddNode(item, root_parent);
	friends_.push_back(item);

	item.id = _T("6");
	item.folder = true;
	item.empty = false;
	item.nick_name = _T("黑名单");
	Node* blacklistFolder = pFriendsList->AddNode(item, NULL);
	friends_.push_back(item);


	EMError err;
	mContacts = g_client->getContactManager().getContactsFromServer(err);
	mBlackList = g_client->getContactManager().getBlackListFromServer(err);

	for (string username : mContacts) 
	{
		auto it = std::find(mBlackList.begin(), mBlackList.end(), username);
		if (it != mBlackList.end())
		{
			continue;
		}
		CDuiString cs(UTF8_to_Unicode(username.c_str(), &s));
		item.id = cs;
		item.folder = false;
		item.logo = _T("default.png");
		item.nick_name = cs;
		item.description = _T("user@easemob.com");
		pFriendsList->AddNode(item, root_parent);
		friends_.push_back(item);
	}

	for (string username : mBlackList) 
	{
		CDuiString cs(UTF8_to_Unicode(username.c_str(), &s));
		item.id = cs;
		item.folder = false;
		item.logo = _T("default.png");
		item.nick_name = cs;
		item.description = _T("user@easemob.com");
		pFriendsList->AddNode(item, blacklistFolder);
		friends_.push_back(item);
	}

	if (pFriendsList->CanExpand(root_parent))
	{
		pFriendsList->SetChildVisible(root_parent, !root_parent->data().child_visible_);
	}
}

void MainFrame::UpdateGroupsList()
{
	if (!groups_.empty())
		groups_.clear();

	CFriendsUI* pGroupsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kGroupsListControlName));
	if (pGroupsList != NULL)
	{
		if (pGroupsList->GetCount() > 0)
			pGroupsList->RemoveAll();

		ListItemInfo item;

		EMError error;
		EMGroupList groupList = g_client->getGroupManager().fetchAllMyGroups(error);
		if (error.mErrorCode != EMError::EM_NO_ERROR) {
			::MessageBox(NULL,_T("Tip"),_T("Fetch group failed"),MB_OK);
		}

		mGroups.clear();
		mGroups.assign(groupList.begin(), groupList.end());

		//mGroups = g_client->getGroupManager().loadAllMyGroupsFromDB();
		int index = 0;
		for (EMGroupPtr group : mGroups) {
			size_t sz;
			item.folder = false;
			item.logo = _T("duilib.png");
			item.nick_name = CDuiString (UTF8_to_Unicode(group->groupSubject().c_str(), &sz));
			item.description = CDuiString (UTF8_to_Unicode(group->groupId().c_str(), &sz));
			item.id = CDuiString(UTF8_to_Unicode(group->groupId().c_str(), &sz));
			pGroupsList->AddNode(item, NULL);
			groups_.push_back(item);
		}
	}
}

void MainFrame::UpdateChatroomList()
{
	if (!chatrooms_.empty())
		chatrooms_.clear();

	CFriendsUI* pChatroomList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kChatroomListControlName));
	if (pChatroomList != NULL)
	{
		if (pChatroomList->GetCount() > 0)
			pChatroomList->RemoveAll();

		ListItemInfo item;

		EMError error;
		EMChatroomList chatroomList = g_client->getChatroomManager().fetchAllChatrooms(error);
		if (error.mErrorCode != EMError::EM_NO_ERROR) {
			::MessageBox(NULL, _T("Tip"), _T("Fetch chatrooms list failed"), MB_OK);
		}

		mChatrooms.clear();
		mChatrooms.assign(chatroomList.begin(), chatroomList.end());

		//mChatrooms = g_client->getChatroomManager().loadAllChatroomsFromDB();
		int index = 0;
		for (EMChatroomPtr chatroom : mChatrooms) {
			size_t sz;
			item.folder = false;
			item.logo = _T("duilib.png");
			item.nick_name = CDuiString(UTF8_to_Unicode(chatroom->chatroomSubject().c_str(), &sz));
			item.description = CDuiString(UTF8_to_Unicode(chatroom->chatroomId().c_str(), &sz));
			item.id = CDuiString(UTF8_to_Unicode(chatroom->chatroomId().c_str(), &sz));
			pChatroomList->AddNode(item, NULL);
			chatrooms_.push_back(item);
		}
	}
}

void MainFrame::OnPrepare(TNotifyUI& msg)
{
	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
	{
		TCHAR szBuf[MAX_PATH] = {0};
#if defined(UNDER_WINCE)
		_stprintf(szBuf, _T("file='bg%d.png' corner='600,200,1,1'"), bk_image_index_);
#else
		_stprintf_s(szBuf, MAX_PATH - 1, _T("file='bg%d.png' corner='600,200,1,1'"), bk_image_index_);
#endif
		background->SetBkImage(szBuf);
	}

	UpdateFriendsList();

	UpdateGroupsList();

	UpdateChatroomList();

	if (!m_Wnd->init()) {
		ASSERT(FALSE);
	}
	mChatListener = new ChatListener(m_Wnd->m_hwnd);
	g_client->getChatManager().addListener(mChatListener);

	mContactListener = new ContactListener(m_Wnd->m_hwnd);
	g_client->getContactManager().registerContactListener(mContactListener);
}

void MainFrame::Notify(TNotifyUI& msg)
{
	if (_tcsicmp(msg.sType, _T("windowinit")) == 0)
	{
		OnPrepare(msg);
	}
	else if (_tcsicmp(msg.sType, _T("killfocus")) == 0)
	{
		if (_tcsicmp(msg.pSender->GetName(), kSignatureControlName) == 0)
		{
			msg.pSender->SetVisible(false);
			CControlUI* signature_tip = m_PaintManager.FindControl(kSignatureTipsControlName);
			if (signature_tip != NULL)
			{
				CRichEditUI* signature = static_cast<CRichEditUI*>(msg.pSender);
				if (signature != NULL)
					signature_tip->SetText(signature->GetText());
				signature_tip->SetVisible(true);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kSearchEditControlName) == 0)
		{
			msg.pSender->SetVisible(false);
			CControlUI* search_tip = static_cast<CRichEditUI*>(m_PaintManager.FindControl(kSearchEditTipControlName));
			if (search_tip != NULL)
			{
				CRichEditUI* search_edit = static_cast<CRichEditUI*>(msg.pSender);
				if (search_edit != NULL)
					search_tip->SetText(search_edit->GetText());
				search_tip->SetVisible(true);
			}
		}
	}
	else if (_tcsicmp(msg.sType, _T("click")) == 0)
	{
		if (_tcsicmp(msg.pSender->GetName(), kCloseButtonControlName) == 0)
		{
			OnExit(msg);
		}
		else if (_tcsicmp(msg.pSender->GetName(), kMinButtonControlName) == 0)
		{
#if defined(UNDER_CE)
			::ShowWindow(m_hWnd, SW_MINIMIZE);
#else
			SendMessage(WM_SYSCOMMAND, SC_MINIMIZE, 0);
#endif
		}
		else if (_tcsicmp(msg.pSender->GetName(), kMaxButtonControlName) == 0)
		{
#if defined(UNDER_CE)
			::ShowWindow(m_hWnd, SW_MAXIMIZE);
			CControlUI* pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kMaxButtonControlName));
			if( pControl ) pControl->SetVisible(false);
			pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kRestoreButtonControlName));
			if( pControl ) pControl->SetVisible(true);
#else
			SendMessage(WM_SYSCOMMAND, SC_MAXIMIZE, 0);
#endif
		}
		else if (_tcsicmp(msg.pSender->GetName(), kRestoreButtonControlName) == 0)
		{
#if defined(UNDER_CE)
			::ShowWindow(m_hWnd, SW_RESTORE);
			CControlUI* pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kMaxButtonControlName));
			if( pControl ) pControl->SetVisible(true);
			pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kRestoreButtonControlName));
			if( pControl ) pControl->SetVisible(false);
#else
			SendMessage(WM_SYSCOMMAND, SC_RESTORE, 0);
#endif
		}
		else if (_tcsicmp(msg.pSender->GetName(), kHideLeftMainPannelControlName) == 0)
		{
			CControlUI* left_main_pannel = m_PaintManager.FindControl(kLeftMainPannelControlName);
			CControlUI* hide_left_main_pannel = m_PaintManager.FindControl(kHideLeftMainPannelControlName);
			CControlUI* show_left_main_pannel = m_PaintManager.FindControl(kShowLeftMainPannelControlName);
			if ((left_main_pannel != NULL) && (show_left_main_pannel != NULL) && (hide_left_main_pannel != NULL))
			{
				hide_left_main_pannel->SetVisible(false);
				left_main_pannel->SetVisible(false);
				show_left_main_pannel->SetVisible(true);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kShowLeftMainPannelControlName) == 0)
		{
			CControlUI* left_main_pannel = m_PaintManager.FindControl(kLeftMainPannelControlName);
			CControlUI* hide_left_main_pannel = m_PaintManager.FindControl(kHideLeftMainPannelControlName);
			CControlUI* show_left_main_pannel = m_PaintManager.FindControl(kShowLeftMainPannelControlName);
			if ((left_main_pannel != NULL) && (show_left_main_pannel != NULL) && (hide_left_main_pannel != NULL))
			{
				hide_left_main_pannel->SetVisible(true);
				left_main_pannel->SetVisible(true);
				show_left_main_pannel->SetVisible(false);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kSignatureTipsControlName) == 0)
		{
			msg.pSender->SetVisible(false);
			CRichEditUI* signature = static_cast<CRichEditUI*>(m_PaintManager.FindControl(kSignatureControlName));
			if (signature != NULL)
			{
				signature->SetText(msg.pSender->GetText());
				signature->SetVisible(true);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kSearchEditTipControlName) == 0)
		{
			msg.pSender->SetVisible(false);
			CRichEditUI* search_edit = static_cast<CRichEditUI*>(m_PaintManager.FindControl(kSearchEditControlName));
			if (search_edit != NULL)
			{
				search_edit->SetText(msg.pSender->GetText());
				search_edit->SetVisible(true);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kChangeBkSkinControlName) == 0)
		{
			CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
			if (background != NULL)
			{
				TCHAR szBuf[MAX_PATH] = {0};
				++bk_image_index_;
				if (kBackgroundSkinImageCount < bk_image_index_)
					bk_image_index_ = 0;

#if defined(UNDER_WINCE)
				_stprintf(szBuf, _T("file='bg%d.png' corner='600,200,1,1'"), bk_image_index_);
#else
				_stprintf_s(szBuf, MAX_PATH - 1, _T("file='bg%d.png' corner='600,200,1,1'"), bk_image_index_);
#endif
				background->SetBkImage(szBuf);

				SkinChangedParam param;
				CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
				if (background != NULL)
				{
					param.bkcolor = background->GetBkColor();
					if (_tcslen(background->GetBkImage()) > 0)
					{
#if defined(UNDER_WINCE)
						_stprintf(szBuf, _T("bg%d.png"), bk_image_index_);
#else
						_stprintf_s(szBuf, MAX_PATH - 1, _T("bg%d.png"), bk_image_index_);
#endif
					}

					param.bgimage = szBuf;
				}
				skin_changed_observer_.Broadcast(param);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kChangeColorSkinControlName) == 0)
		{
			CDuiRect rcWindow;
			GetWindowRect(m_hWnd, &rcWindow);
			rcWindow.top = rcWindow.top + msg.pSender->GetPos().bottom;
			new ColorSkinWindow(this, rcWindow);
		}
		else if (_tcsicmp(msg.pSender->GetName(), kFinderControlName) == 0)
		{
			if (g_WndManager->HasWnd(kFinderWndName))//The chat dialog exists.
			{
				return;
			}
			FinderDlg* pFinderDlg = new FinderDlg();
			if (pFinderDlg == NULL)
				return;
#if defined(WIN32) && !defined(UNDER_CE)
			pFinderDlg->Create(NULL, _T("FinderDlg"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#else
			pFinderDlg->Create(NULL, _T("FinderDlg"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#endif
			skin_changed_observer_.AddReceiver(pFinderDlg);
			g_WndManager->AddWnd(kFinderWndName, pFinderDlg);

			pFinderDlg->CenterWindow();
			::ShowWindow(*pFinderDlg, SW_SHOW);

		}
		else if (_tcsicmp(msg.pSender->GetName(), kAvatarButtonName) == 0)
		{
			if (g_WndManager->HasWnd(kProfileWndName))//The chat dialog exists.
			{
				return;
			}
			ProfileDlg* pProfileDlg = new ProfileDlg();
			if (pProfileDlg == NULL)
				return;
#if defined(WIN32) && !defined(UNDER_CE)
			pProfileDlg->Create(NULL, _T("ProfileDlg"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#else
			pProfileDlg->Create(NULL, _T("ProfileDlg"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#endif
			skin_changed_observer_.AddReceiver(pProfileDlg);
			g_WndManager->AddWnd(kProfileWndName, pProfileDlg);

			pProfileDlg->CenterWindow();
			::ShowWindow(*pProfileDlg, SW_SHOW);

		}
		else if (_tcsicmp(msg.pSender->GetName(), kMainMenuButtonName) == 0)
		{
			RECT rcBtn = msg.pSender->GetPos();

			int iMenuHeight = 50;
			int x = rcBtn.left;
			int y = rcBtn.top - iMenuHeight;

			POINT pt = { x, y};
			CMenuWnd* pMenu = new CMenuWnd(m_hWnd);
			::ClientToScreen(m_hWnd, &pt);
			pMenu->Init(NULL, _T("MainMenu.xml"), _T("xml"), pt, msg.pSender);
		}
	}
	else if (_tcsicmp(msg.sType, _T("timer")) == 0)
	{
		return OnTimer(msg);
	}
	else if (_tcsicmp(msg.sType, _T("selectchanged")) == 0)
	{
		CTabLayoutUI* pTabControl = static_cast<CTabLayoutUI*>(m_PaintManager.FindControl(kTabControlName));
		if (_tcsicmp(msg.pSender->GetName(), kFriendButtonControlName) == 0)
		{
			if (pTabControl && pTabControl->GetCurSel() != 0)
			{
				pTabControl->SelectItem(0);
				UpdateFriendsList();
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kGroupButtonControlName) == 0)
		{
			if (pTabControl && pTabControl->GetCurSel() != 1)
			{
				pTabControl->SelectItem(1);
				UpdateGroupsList();
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kChatroomButtonControlName) == 0)
		{
			if (pTabControl && pTabControl->GetCurSel() != 2)
			{
				pTabControl->SelectItem(2);
				UpdateChatroomList();
			}
		}
	}
	else if (_tcsicmp(msg.sType, _T("itemactivate")) == 0)
	{
		CTabLayoutUI* pTabControl = static_cast<CTabLayoutUI*>(m_PaintManager.FindControl(kTabControlName));
		if (pTabControl != NULL)
		{
			if (pTabControl->GetCurSel() == 0)
			{
				CFriendsUI* pFriendsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kFriendsListControlName));
				if ((pFriendsList != NULL) &&  pFriendsList->GetItemIndex(msg.pSender) != -1)
				{
					if (_tcsicmp(msg.pSender->GetClass(), DUI_CTR_LISTCONTAINERELEMENT) == 0)
					{
						Node* node = (Node*)msg.pSender->GetTag();

						CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
						if (!pFriendsList->CanExpand(node) && (background != NULL))
						{
							ListItemInfo friend_info;

							for (std::vector<ListItemInfo>::const_iterator citer = friends_.begin(); citer != friends_.end(); ++citer)
							{
								if (_tcsicmp(citer->id, node->data().value) == 0)
								{
									friend_info = *citer;
									break;
								}
							}
							TCHAR szBuf[MAX_PATH] = {0};
							if (_tcslen(background->GetBkImage()) > 0)
							{
#if defined(UNDER_WINCE)
								_stprintf(szBuf, _T("bg%d.png"), bk_image_index_);
#else
								_stprintf_s(szBuf, MAX_PATH - 1, _T("bg%d.png"), bk_image_index_);
#endif
							}
							if (g_WndManager->HasWnd(utils::Unicode_to_UTF8(friend_info.nick_name)))//The chat dialog exists.
							{
								return;
							}
							ChatDialog* pChatDialog = new ChatDialog(szBuf, background->GetBkColor(), myself_info_, friend_info, utils::Unicode_to_UTF8(friend_info.nick_name));
							if( pChatDialog == NULL )
								return;
#if defined(WIN32) && !defined(UNDER_CE)
							pChatDialog->Create(NULL, _T("ChatDialog"), UI_WNDSTYLE_FRAME | WS_POPUP,  NULL, 0, 0, 0, 0);
#else
							pChatDialog->Create(NULL, _T("ChatDialog"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#endif
							skin_changed_observer_.AddReceiver(pChatDialog);
							message_event_observer_.AddReceiver(pChatDialog);
							g_WndManager->AddWnd(utils::Unicode_to_UTF8(friend_info.nick_name), pChatDialog);

							pChatDialog->CenterWindow();
							::ShowWindow(*pChatDialog, SW_SHOW);
						}
					}
				}
			}
			else if (pTabControl->GetCurSel() == 1)
			{
				CFriendsUI* pGroupsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kGroupsListControlName));
				if ((pGroupsList != NULL) && pGroupsList->GetItemIndex(msg.pSender) != -1)
				{
					if (_tcsicmp(msg.pSender->GetClass(), DUI_CTR_LISTCONTAINERELEMENT) == 0)
					{
						Node* node = (Node*)msg.pSender->GetTag();

						CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
						if (!pGroupsList->CanExpand(node) && (background != NULL))
						{
							ListItemInfo group_info;

							for (std::vector<ListItemInfo>::const_iterator citer = groups_.begin(); citer != groups_.end(); ++citer)
							{
								if (_tcsicmp(citer->id, node->data().value) == 0)
								{
									group_info = *citer;
									break;
								}
							}
							TCHAR szBuf[MAX_PATH] = { 0 };
							if (_tcslen(background->GetBkImage()) > 0)
							{
#if defined(UNDER_WINCE)
								_stprintf(szBuf, _T("bg%d.png"), bk_image_index_);
#else
								_stprintf_s(szBuf, MAX_PATH - 1, _T("bg%d.png"), bk_image_index_);
#endif
							}
							std::string sWndID = "group_";
							sWndID += utils::Unicode_to_UTF8(group_info.id);
							if (g_WndManager->HasWnd(sWndID))//The chat dialog exists.
							{
								return;
							}
							GroupChatDialog* pChatDialog = new GroupChatDialog(szBuf, background->GetBkColor(), myself_info_, group_info, sWndID);
							if (pChatDialog == NULL)
								return;
							CDuiString sTitle = _T("群聊-");
							sTitle += group_info.nick_name;

#if defined(WIN32) && !defined(UNDER_CE)
							pChatDialog->Create(NULL, sTitle, UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#else
							pChatDialog->Create(NULL, sTitle, UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#endif
							skin_changed_observer_.AddReceiver(pChatDialog);
							message_event_observer_.AddReceiver(pChatDialog);
							g_WndManager->AddWnd(sWndID, pChatDialog);

							pChatDialog->CenterWindow();
							::ShowWindow(*pChatDialog, SW_SHOW);
						}
					}
				}
			}
			else if (pTabControl->GetCurSel() == 2)
			{
				CFriendsUI* pChatroomList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kChatroomListControlName));
				if ((pChatroomList != NULL) && pChatroomList->GetItemIndex(msg.pSender) != -1)
				{
					if (_tcsicmp(msg.pSender->GetClass(), DUI_CTR_LISTCONTAINERELEMENT) == 0)
					{
						Node* node = (Node*)msg.pSender->GetTag();

						CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
						if (!pChatroomList->CanExpand(node) && (background != NULL))
						{
							ListItemInfo chatroom_info;

							for (std::vector<ListItemInfo>::const_iterator citer = chatrooms_.begin(); citer != chatrooms_.end(); ++citer)
							{
								if (_tcsicmp(citer->id, node->data().value) == 0)
								{
									chatroom_info = *citer;
									break;
								}
							}
							TCHAR szBuf[MAX_PATH] = { 0 };
							if (_tcslen(background->GetBkImage()) > 0)
							{
#if defined(UNDER_WINCE)
								_stprintf(szBuf, _T("bg%d.png"), bk_image_index_);
#else
								_stprintf_s(szBuf, MAX_PATH - 1, _T("bg%d.png"), bk_image_index_);
#endif
							}
							std::string sWndID = "chatroom_";
							sWndID += utils::Unicode_to_UTF8(chatroom_info.nick_name);
							if (g_WndManager->HasWnd(sWndID))//The chat dialog exists.
							{
								return;
							}
							ChatroomChatDialog* pChatDialog = new ChatroomChatDialog(szBuf, background->GetBkColor(), myself_info_, chatroom_info, utils::Unicode_to_UTF8(chatroom_info.nick_name));
							if (pChatDialog == NULL)
								return;
#if defined(WIN32) && !defined(UNDER_CE)
							pChatDialog->Create(NULL, _T("ChatDialog"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#else
							pChatDialog->Create(NULL, _T("ChatDialog"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#endif
							skin_changed_observer_.AddReceiver(pChatDialog);
							message_event_observer_.AddReceiver(pChatDialog);
							g_WndManager->AddWnd(sWndID, pChatDialog);

							pChatDialog->CenterWindow();
							::ShowWindow(*pChatDialog, SW_SHOW);
						}
					}
				}
			}

		}
	}
	else if (_tcsicmp(msg.sType, _T("itemclick")) == 0 || _tcsicmp(msg.sType, _T("itemrightclick")) == 0)
	{
		CTabLayoutUI* pTabControl = static_cast<CTabLayoutUI*>(m_PaintManager.FindControl(kTabControlName));
		if (pTabControl != NULL)
		{
			if (pTabControl->GetCurSel() == 0)
			{
				CFriendsUI* pFriendsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kFriendsListControlName));
				if ((pFriendsList != NULL) &&  pFriendsList->GetItemIndex(msg.pSender) != -1)
				{
					if (_tcsicmp(msg.pSender->GetClass(), DUI_CTR_LISTCONTAINERELEMENT) == 0)
					{
						Node* node = (Node*)msg.pSender->GetTag();

						if (pFriendsList->CanExpand(node))
						{
							pFriendsList->SetChildVisible(node, !node->data().child_visible_);
						}
						else
						{
							pFriendsList->SelectItem(pFriendsList->GetItemIndex(msg.pSender), true);
							if (_tcsicmp(msg.sType, _T("itemrightclick")) == 0)
							{
								POINT pt = { GET_X_LPARAM(msg.lParam), GET_Y_LPARAM(msg.lParam) };
								CMenuWnd* pMenu = new CMenuWnd(m_hWnd);
								::ClientToScreen(m_hWnd, &pt);
								pMenu->Init(NULL, _T("FriendContextMenu.xml"), _T("xml"), pt, msg.pSender);
								NodeData data = node->data();
								std::vector<std::string>::iterator result = find(mBlackList.begin(), mBlackList.end(), utils::Unicode_to_UTF8(data.value.GetData()));
								bool bInBlackList = (result != mBlackList.end());
								pMenu->EnableMenuItem(_T("Menu_Ban"), !bInBlackList);
								pMenu->EnableMenuItem(_T("Menu_UnBan"), bInBlackList);
							}

						}
					}
				}
			}
			else if (pTabControl->GetCurSel() == 1)
			{
				CFriendsUI* pGroupsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kGroupsListControlName));
				if ((pGroupsList != NULL) &&  pGroupsList->GetItemIndex(msg.pSender) != -1)
				{
					if (_tcsicmp(msg.pSender->GetClass(), DUI_CTR_LISTCONTAINERELEMENT) == 0)
					{
						Node* node = (Node*)msg.pSender->GetTag();

						if (pGroupsList->CanExpand(node))
						{
							pGroupsList->SetChildVisible(node, !node->data().child_visible_);
						}
					}
				}
			}

		}
	}
	else if (msg.sType == _T("menu_msg"))
	{
		CControlUI * pControl = (CControlUI *)msg.lParam;
		tstring strMenuName = (TCHAR *)(LPCTSTR)pControl->GetUserData();
		if (strMenuName == _T("Menu_Delete") || strMenuName == _T("Menu_Ban") || strMenuName == _T("Menu_UnBan"))
		{
			ListItemInfo friend_info;

			CTabLayoutUI* pTabControl = static_cast<CTabLayoutUI*>(m_PaintManager.FindControl(kTabControlName));
			if (pTabControl != NULL)
			{
				if (pTabControl->GetCurSel() == 0)
				{
					CFriendsUI* pFriendsList = static_cast<CFriendsUI*>(m_PaintManager.FindControl(kFriendsListControlName));
					if ((pFriendsList != NULL) && pFriendsList->GetItemIndex(msg.pSender) != -1)
					{
						if (_tcsicmp(msg.pSender->GetClass(), DUI_CTR_LISTCONTAINERELEMENT) == 0)
						{
							Node* node = (Node*)msg.pSender->GetTag();

							CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
							if (!pFriendsList->CanExpand(node) && (background != NULL))
							{
								for (std::vector<ListItemInfo>::const_iterator citer = friends_.begin(); citer != friends_.end(); ++citer)
								{
									if (_tcsicmp(citer->id, node->data().value) == 0)
									{
										friend_info = *citer;
										break;
									}
								}
								EMError err;
								if (strMenuName == _T("Menu_Delete"))
								{
									g_client->getContactManager().deleteContact(utils::Unicode_to_UTF8(friend_info.nick_name),err);
								}
								else if (strMenuName == _T("Menu_Ban"))
								{
									g_client->getContactManager().addToBlackList(utils::Unicode_to_UTF8(friend_info.nick_name),true, err);
								}
								else if (strMenuName == _T("Menu_UnBan"))
								{
									g_client->getContactManager().removeFromBlackList(utils::Unicode_to_UTF8(friend_info.nick_name), err);
								}
							}
						}
					}
				}
			}

		}
		if (strMenuName == _T("Menu_Logout"))
			OnMenu_Logout(msg);
		else if (strMenuName == _T("Menu_Quit"))
			OnMenu_Quit(msg);
	}
}

LRESULT MainFrame::HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	return 0;
}

UILIB_RESOURCETYPE MainFrame::GetResourceType() const
{
	// return UILIB_ZIPRESOURCE;
	return UILIB_FILE;
}

LPCTSTR MainFrame::GetResourceID() const
{
	return MAKEINTRESOURCE(101);
}


LPCTSTR MainFrame::ShowMsg(CDuiString text) const
{
	CTextUI* IDCtrl = static_cast<CTextUI*>(m_PaintManager.FindControl(_T("signaturetip")));
	if (IDCtrl != NULL)
	{
		IDCtrl->SetText(text);
	}
	return text;
}

DWORD MainFrame::getBgColor()
{
	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
	{
		TCHAR szBuf[MAX_PATH] = { 0 };
		if (_tcslen(background->GetBkImage()) > 0)
		{
#if defined(UNDER_WINCE)
			_stprintf(szBuf, _T("bg%d.png"), bk_image_index_);
#else
			_stprintf_s(szBuf, MAX_PATH - 1, _T("bg%d.png"), bk_image_index_);
#endif
		}
		return background->GetBkColor();
	}
}
CDuiString MainFrame::getBgImg()
{
	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
	{
		TCHAR szBuf[MAX_PATH] = { 0 };
		if (_tcslen(background->GetBkImage()) > 0)
		{
#if defined(UNDER_WINCE)
			_stprintf(szBuf, _T("bg%d.png"), bk_image_index_);
#else
			_stprintf_s(szBuf, MAX_PATH - 1, _T("bg%d.png"), bk_image_index_);
#endif
			return szBuf;
		}
	}
	return CDuiString(_T(""));
}

bool MainFrame::BroadCastAsync(WPARAM wParam, LPARAM lParam)
{
	switch ((int)wParam)
	{
		case ASYNC_BROADCAST_MESSAGE:
		{
			MessageInfo * mi = (MessageInfo*)lParam;
			if (mi->type == EMMessageBody::TEXT || mi->type == EMMessageBody::IMAGE)
			{
				if (mi->chatType == EMMessage::SINGLE)
				{
					if (!g_WndManager->HasWnd(utils::Unicode_to_UTF8(mi->sFrom)))
					{
						ListItemInfo friend_info;
						for (std::vector<ListItemInfo>::const_iterator citer = friends_.begin(); citer != friends_.end(); ++citer)
						{
							if (!_tcsicmp(citer->nick_name, mi->sFrom))
							{
								friend_info = *citer;
								break;
							}
						}

						ChatDialog* pChatDialog = new ChatDialog(bg_img_, bg_color_, myself_info_, friend_info, utils::Unicode_to_UTF8(mi->sFrom));
						if (pChatDialog == NULL)
							return false;
						CDuiString sTitle = _T("聊天-");
						sTitle += mi->sFrom;

#if defined(WIN32) && !defined(UNDER_CE)
						pChatDialog->Create(NULL, _T("ChatDialog"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#else
						pChatDialog->Create(NULL, _T("ChatDialog"), UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#endif
						skin_changed_observer_.AddReceiver(pChatDialog);
						message_event_observer_.AddReceiver(pChatDialog);
						g_WndManager->AddWnd(utils::Unicode_to_UTF8(mi->sFrom), pChatDialog);
						pChatDialog->CenterWindow();
						::ShowWindow(*pChatDialog, SW_SHOW);
					}
				}
				else if (mi->chatType == EMMessage::GROUP)
				{
					std::string sWndID = "group_";
					sWndID += utils::Unicode_to_UTF8(mi->sTo);

					if (!g_WndManager->HasWnd(sWndID))
					{
						ListItemInfo group_info;
						for (std::vector<ListItemInfo>::const_iterator citer = groups_.begin(); citer != groups_.end(); ++citer)
						{
							if (!_tcsicmp(citer->id, mi->sTo))
							{
								group_info = *citer;
								break;
							}
						}

						GroupChatDialog* pChatDialog = new GroupChatDialog(bg_img_, bg_color_, myself_info_, group_info, sWndID);
						if (pChatDialog == NULL)
							return false;
						CDuiString sTitle = _T("群聊-");
						sTitle += group_info.nick_name;
#if defined(WIN32) && !defined(UNDER_CE)
						pChatDialog->Create(NULL, sTitle, UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#else
						pChatDialog->Create(NULL, sTitle, UI_WNDSTYLE_FRAME | WS_POPUP, NULL, 0, 0, 0, 0);
#endif
						skin_changed_observer_.AddReceiver(pChatDialog);
						message_event_observer_.AddReceiver(pChatDialog);
						g_WndManager->AddWnd(sWndID, pChatDialog);
						pChatDialog->CenterWindow();
						::ShowWindow(*pChatDialog, SW_SHOW);
					}
				}
				MessageEventParam param;
				param.sBody = mi->sBody;
				param.sFrom = mi->sFrom;
				param.sTo = mi->sTo;
				param.sAttachmentPath = mi->sAttachmentPath;
				TCHAR szTimestamp[100];
				utils::unixTime2Str(mi->timestamp, szTimestamp, 100);
				param.timestamp = szTimestamp;
				message_event_observer_.Broadcast(param);

				delete mi;
				break;
			}
		}
		case ASYNC_BROADCAST_CONTACT_LIST_CHANGED:
		{
			this->UpdateFriendsList();
			break;
		}
	}

	return true;
}

void MainFrame::OnMenu_Logout(TNotifyUI& msg)
{
	m_isLogout = true;
	Close();
}
void MainFrame::OnMenu_Quit(TNotifyUI& msg)
{
	m_isLogout = false;
	Close();
}