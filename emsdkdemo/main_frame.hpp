#ifndef MAINFRAME_HPP
#define MAINFRAME_HPP

#include "skin_change_event.hpp"
#include "message_event.hpp"
#include "UIFriends.hpp"
#include "emclient.h"
#include "emchatmanager_interface.h"
#include <message/emmessagebody.h>
#include <emgroup.h>
#include <emgroupmanager_interface.h>
#include "emchatroommanager_interface.h"
#include <emcontactlistener.h>

using namespace easemob;
class MainFrame;

class CHideWnd {
public:
	CHideWnd(MainFrame* pOwner) { m_pOwner = pOwner; m_hwnd = NULL; }
	~CHideWnd() { if (m_hwnd != NULL) DestroyWindow(m_hwnd); }

	bool init();
	HWND m_hwnd;

	enum { WM_ASYNC_BROADCAST = (WM_USER + 101), MSG_CLEAR };
	MainFrame* m_pOwner;

	bool OnAsyncBroadcast(WPARAM wParam, LPARAM lParam);
};

class MainFrame : public WindowImplBase
{
public:

	MainFrame(HWND hwndLoginDlg);
	~MainFrame();

public:

	LPCTSTR GetWindowClassName() const;	
	virtual void OnFinalMessage(HWND hWnd);
	virtual void InitWindow();
	virtual LRESULT ResponseDefaultKeyEvent(WPARAM wParam);
	virtual CDuiString GetSkinFile();
	virtual CDuiString GetSkinFolder();
	virtual UILIB_RESOURCETYPE GetResourceType() const;
	virtual CControlUI* CreateControl(LPCTSTR pstrClass);
	virtual LRESULT OnSysCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
	virtual LRESULT HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
	virtual LRESULT OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
	virtual LPCTSTR GetResourceID() const;
	virtual LPCTSTR ShowMsg(CDuiString text) const;
	virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);

	bool BroadCastAsync(WPARAM wParam, LPARAM lParam);

    DWORD GetBkColor();
    void SetBkColor(DWORD dwBackColor);

protected:	

	void Notify(TNotifyUI& msg);
	void OnPrepare(TNotifyUI& msg);
	void OnExit(TNotifyUI& msg);
	void OnTimer(TNotifyUI& msg);

private:

	void UpdateFriendsList();

	void UpdateGroupsList();

	void UpdateChatroomList();

	DWORD getBgColor();
	CDuiString getBgImg();

	void OnMenu_Logout(TNotifyUI& msg);		// “注销”菜单
	void OnMenu_Quit(TNotifyUI& msg);		// “退出”菜单
private:
	int bk_image_index_;

	ListItemInfo myself_info_;
	std::vector<ListItemInfo> friends_;
	std::vector<ListItemInfo> groups_;
	std::vector<ListItemInfo> chatrooms_;

	SkinChangedObserver skin_changed_observer_;
	MessageEventObserver message_event_observer_;
	std::vector<std::string> mContacts;
	std::vector<std::string> mBlackList;
	easemob::EMChatManagerListener *mChatListener;
	easemob::EMContactListener *mContactListener;
	CHideWnd *m_Wnd;
	DWORD bg_color_;
	CDuiString bg_img_;
	std::map<CDuiString, CWindowWnd*> windowsList_;

	easemob::EMChatroomList mChatrooms;
	easemob::EMGroupList mGroups;
	HWND m_hwndLoginDlg;
	bool m_isLogout;//Back to login dialog, not quit this application.
	EMCallbackObserverHandle m_coh;
};

#endif // MAINFRAME_HPP