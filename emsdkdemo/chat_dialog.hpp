#ifndef CHATDIALOG_HPP
#define CHATDIALOG_HPP

#include "skin_change_event.hpp"
#include "message_event.hpp"
#include "UIFriends.hpp"
#include "emoticon\FaceList.h"
#include "emoticon\FaceSelDlg.h"
#include "ISetTextColor.hpp"

#include "ColorPicker.hpp"
#include <message/emtextmessagebody.h>
#include <message/emcmdmessagebody.h>
#include <message/emimagemessagebody.h>
#include <message/emfilemessagebody.h>
#include <message/emlocationmessagebody.h>
#include <message/emvideomessagebody.h>
#include <message/emvoicemessagebody.h>
#include <message/emmessagebody.h>
#include <message/emmessage.h>
#include <emconversation.h>
#include <emclient.h>
#include <emlogininfo.h>
#include <emchatmanager_interface.h>
#include <emcontactmanager_interface.h>
#include "utils.h"
#include "application.h"
#include "emoticon\Path.h"
#include "emoticon\IImageOle.h"
#include "emoticon\RichEditUtil.h"
#include "emoticon\UIMenu.h"

using namespace easemob;
using namespace utils;

class ChatDialog : public WindowImplBase, public SkinChangedReceiver, public MessageEventReceiver, public ISetTextColor
{
public:

	ChatDialog(const CDuiString& bgimage, DWORD bkcolor, const ListItemInfo& myselft_info, const ListItemInfo& friend_info, std::string conversationID);
	~ChatDialog();

public:

	virtual LPCTSTR GetWindowClassName() const;	
	virtual void OnFinalMessage(HWND hWnd);

	virtual void InitWindow();

	virtual LRESULT ResponseDefaultKeyEvent(WPARAM wParam);

	virtual CDuiString GetSkinFile();

	virtual CDuiString GetSkinFolder();

	virtual CControlUI* CreateControl(LPCTSTR pstrClass);

	virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);

	virtual LRESULT OnSysCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);

	virtual LRESULT OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);

	virtual LRESULT OnSetFocus(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);

	virtual BOOL Receive(SkinChangedParam param);

	virtual BOOL Receive(MessageEventParam param);

	virtual LRESULT HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);

	virtual void SetTextColor(DWORD dwColor);

    void SendMsg();

	void OnMenu_Cut(TNotifyUI& msg);		// “剪切”菜单
	void OnMenu_Copy(TNotifyUI& msg);		// “复制”菜单
	void OnMenu_Paste(TNotifyUI& msg);		// “粘贴”菜单
	void OnMenu_SelAll(TNotifyUI& msg);		// “全部选择”菜单
	void OnMenu_Clear(TNotifyUI& msg);		// “清屏”菜单
	LRESULT OnRButtonDown(UINT uMsg, WPARAM wParam, LPARAM lParam);
	LRESULT OnLButtonDblClk(UINT uMsg, WPARAM wParam, LPARAM lParam);
	LRESULT OnFaceCtrlSel(UINT uMsg, WPARAM wParam, LPARAM lParam);	// “表情”控件选取消息

	void _RichEdit_ReplaceSel(CRichEditUI * pRichEdit, LPCTSTR lpszNewText);
	BOOL _RichEdit_InsertFace(CRichEditUI * pRichEdit, LPCTSTR lpszFileName, int nFaceId, int nFaceIndex, tstring strEmoticon);
	BOOL HandleSysFaceId(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText, tstring& strEMFace);
	BOOL HandleEMFaceId(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText, tstring& strEMFace);
	BOOL HandleSysFaceIndex(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText);
	BOOL HandleCustomPic(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText);
	void AddMsg(CRichEditUI * pRichEdit, LPCTSTR lpText);
	void AddMsgToSendEdit(LPCTSTR lpText);
	void AddMsgToRecvEdit(LPCTSTR lpText, LPCTSTR lpAttach, LPCTSTR lpFrom=NULL, LPCTSTR lpTimestamp=NULL);

protected:	

	void Notify(TNotifyUI& msg);
	void OnPrepare(TNotifyUI& msg);
	void OnExit(TNotifyUI& msg);
	void OnTimer(TNotifyUI& msg);

protected:
	void FontStyleChanged();

protected:
	bool emotion_timer_start_;

	bool bold_;
	bool italic_;
	bool underline_;
	DWORD text_color_;
	DWORD font_size_;
	CDuiString font_face_name_;

	CDuiString bgimage_;
	DWORD bkcolor_;
	ListItemInfo myselft_;
	ListItemInfo friend_;
	std::string mConversationID;
	CFaceSelDlg m_FaceSelDlg;
	CFaceList m_FaceList;
	CRichEditUI* m_pSendEdit, *m_pRecvEdit;
	POINT m_ptRBtnDown;
};

#endif // CHARTDIALOG_HPP