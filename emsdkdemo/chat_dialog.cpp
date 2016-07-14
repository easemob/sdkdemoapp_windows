#include "stdafx.h"
#include <windows.h>
#include <shellapi.h>

#include "chat_dialog.hpp"

const TCHAR* const kTitleControlName = _T("apptitle");
const TCHAR* const kCloseButtonControlName = _T("closebtn");
const TCHAR* const kMinButtonControlName = _T("minbtn");
const TCHAR* const kMaxButtonControlName = _T("maxbtn");
const TCHAR* const kRestoreButtonControlName = _T("restorebtn");

const TCHAR* const kBackgroundControlName = _T("bg");

const TCHAR* const kLogoButtonControlName = _T("logo");
const TCHAR* const kNickNameControlName = _T("nickname");
const TCHAR* const kDescriptionControlName = _T("description");

const TCHAR* const kFontButtonControlName = _T("fontbtn");
const TCHAR* const kFontbarControlName = _T("fontbar");
const TCHAR* const kFontTypeControlName = _T("font_type");
const TCHAR* const kFontSizeControlName = _T("font_size");
const TCHAR* const kBoldButtonControlName = _T("boldbtn");
const TCHAR* const kItalicButtonControlName = _T("italicbtn");
const TCHAR* const KUnderlineButtonControlName = _T("underlinebtn");
const TCHAR* const kColorButtonControlName = _T("colorbtn");

const TCHAR* const kInputRichEditControlName = _T("input_richedit");
const TCHAR* const kViewRichEditControlName = _T("view_richedit");

const TCHAR* const kEmotionButtonControlName = _T("emotionbtn");

const TCHAR* const kSendButtonControlName = _T("sendbtn");

const int kEmotionRefreshTimerId = 1001;
const int kEmotionRefreshInterval = 150;


ChatDialog::ChatDialog(const CDuiString& bgimage, DWORD bkcolor, const ListItemInfo& myselft_info, const ListItemInfo& friend_info, std::string conversationID)
: bgimage_(bgimage)
, bkcolor_(bkcolor)
, myselft_(myselft_info)
, friend_(friend_info)
, mConversationID(conversationID)
, emotion_timer_start_(false)
, text_color_(0xFF000000)
, bold_(false)
, italic_(false)
, underline_(false)
, font_size_(12)
, font_face_name_(_T("微软雅黑"))
, m_pSendEdit(NULL)
, m_pRecvEdit(NULL)
{}

ChatDialog::~ChatDialog()
{
	return;
}

LPCTSTR ChatDialog::GetWindowClassName() const
{
	return _T("ChatDialog");
}

CControlUI* ChatDialog::CreateControl(LPCTSTR pstrClass)
{
	return NULL;
}

void ChatDialog::OnFinalMessage(HWND hWnd)
{
	SkinChangedReceiver::RemoveObserver();
	MessageEventReceiver::RemoveObserver();
	g_WndManager->RemoveWnd(this);
	WindowImplBase::OnFinalMessage(hWnd);	
	delete this;
}

BOOL ChatDialog::Receive(SkinChangedParam param)
{
	bgimage_ = param.bgimage;
	bkcolor_ = param.bkcolor;
	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
	{
		if (!param.bgimage.IsEmpty())
		{
			TCHAR szBuf[MAX_PATH] = {0};
#if defined(UNDER_WINCE)
			_stprintf(szBuf, _T("file='%s' corner='600,200,1,1'"), param.bgimage.c_str());
#else
			_stprintf_s(szBuf, MAX_PATH - 1, _T("file='%s' corner='600,200,1,1'"), param.bgimage);
#endif
			background->SetBkImage(szBuf);
		}
		else
			background->SetBkImage(_T(""));

		background->SetBkColor(param.bkcolor);
	}

	return TRUE;
}

BOOL ChatDialog::Receive(MessageEventParam param)
{
	if (param.sFrom == friend_.id)
	{
		AddMsgToRecvEdit(param.sBody.GetData(), param.sAttachmentPath.GetData(), param.sFrom,param.timestamp);
	}

	return TRUE;
}
CDuiString ChatDialog::GetSkinFile()
{
	return _T("chatbox.xml");
}

CDuiString ChatDialog::GetSkinFolder()
{
	return CDuiString(CPaintManagerUI::GetInstancePath()) + _T("skin\\EMRes\\");
}

LRESULT ChatDialog::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	::RevokeDragDrop(m_hWnd);
	m_FaceList.Reset();
	bHandled = FALSE;
	return 0;
}

LRESULT ChatDialog::OnSetFocus(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

LRESULT ChatDialog::OnSysCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
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

LRESULT ChatDialog::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	if (uMsg == WM_RBUTTONDOWN)
	{
		LRESULT lRes = __super::HandleMessage(uMsg, wParam, lParam);
		OnRButtonDown(uMsg, wParam, lParam);
		return lRes;
	}

	if (uMsg == WM_LBUTTONDBLCLK)
		OnLButtonDblClk(uMsg, wParam, lParam);

	if ((m_pSendEdit != NULL) && m_pSendEdit->IsFocused()
		&& (uMsg == WM_KEYDOWN) && (wParam == 'V') && (lParam & VK_CONTROL))	// 发送消息框的Ctrl+V消息
	{
		m_pSendEdit->PasteSpecial(CF_TEXT);
		return TRUE;
	}

	if (uMsg == WM_NOTIFY && EN_PASTE == ((LPNMHDR)lParam)->code)
	{
		ITextServices * pTextServices = m_pSendEdit->GetTextServices();
		if ((UINT)pTextServices == ((LPNMHDR)lParam)->idFrom)
		{
			AddMsgToSendEdit(((NMRICHEDITOLECALLBACK *)lParam)->lpszText);
		}
		if (pTextServices != NULL)
			pTextServices->Release();
	}

	if (uMsg == WM_MENU)
	{
		CControlUI * pControl = (CControlUI *)lParam;
		if (pControl != NULL)
			this->m_PaintManager.SendNotify(pControl, _T("menu_msg"), wParam, lParam);
	}

	if (uMsg == FACE_CTRL_SEL)
		return OnFaceCtrlSel(uMsg, wParam, lParam);

	return __super::HandleMessage(uMsg, wParam, lParam);
}

LRESULT ChatDialog::ResponseDefaultKeyEvent(WPARAM wParam)
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

void ChatDialog::OnTimer(TNotifyUI& msg)
{}

void ChatDialog::OnExit(TNotifyUI& msg)
{
	Close();
}

void ChatDialog::InitWindow()
{
	CDuiString strPath = CDuiString(GetSkinFolder() + _T("Face\\FaceConfig.xml"));
	m_FaceList.LoadConfigFile(strPath);
	m_pSendEdit = static_cast<CRichEditUI*>(m_PaintManager.FindControl(kInputRichEditControlName));
	m_pRecvEdit = static_cast<CRichEditUI*>(m_PaintManager.FindControl(kViewRichEditControlName));

	IRichEditOleCallback2* pRichEditOleCallback2 = NULL;
	HRESULT hr = ::CoCreateInstance(CLSID_ImageOle, NULL, CLSCTX_INPROC_SERVER,
		__uuidof(IRichEditOleCallback2), (void**)&pRichEditOleCallback2);
	if (SUCCEEDED(hr))
	{
		pRichEditOleCallback2->SetNotifyHwnd(m_hWnd);
		ITextServices * pTextServices = m_pRecvEdit->GetTextServices();
		pRichEditOleCallback2->SetTextServices(pTextServices);
		pTextServices->Release();
		m_pRecvEdit->SetOleCallback(pRichEditOleCallback2);
		pRichEditOleCallback2->Release();
	}

	pRichEditOleCallback2 = NULL;
	hr = ::CoCreateInstance(CLSID_ImageOle, NULL, CLSCTX_INPROC_SERVER,
		__uuidof(IRichEditOleCallback2), (void**)&pRichEditOleCallback2);
	if (SUCCEEDED(hr))
	{
		pRichEditOleCallback2->SetNotifyHwnd(m_hWnd);
		ITextServices * pTextServices = m_pSendEdit->GetTextServices();
		pRichEditOleCallback2->SetTextServices(pTextServices);
		pTextServices->Release();
		m_pSendEdit->SetOleCallback(pRichEditOleCallback2);
		pRichEditOleCallback2->Release();
	}

	IDropTarget *pdt = m_pSendEdit->GetTxDropTarget();
	hr = ::RegisterDragDrop(m_hWnd, pdt);
	pdt->Release();
}

void ChatDialog::OnPrepare(TNotifyUI& msg)
{
	TCHAR szBuf[MAX_PATH] = {0};

	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
	{
#if defined(UNDER_WINCE)
		_stprintf(szBuf, _T("file='%s' corner='600,200,1,1'"), bgimage_.c_str());
#else
		_stprintf_s(szBuf, MAX_PATH - 1, _T("file='%s' corner='600,200,1,1'"), bgimage_);
#endif
		background->SetBkImage(szBuf);
		background->SetBkColor(bkcolor_);
	}

	CButtonUI* log_button = static_cast<CButtonUI*>(m_PaintManager.FindControl(kLogoButtonControlName));
	if (log_button != NULL)
	{
#if defined(UNDER_WINCE)
		_stprintf(szBuf, _T("%s"), friend_.logo.c_str());
#else
		_stprintf_s(szBuf, MAX_PATH - 1, _T("%s"), friend_.logo);
#endif
		log_button->SetNormalImage(szBuf);
	}

	CControlUI* nick_name = m_PaintManager.FindControl(kNickNameControlName);
	if (nick_name != NULL)
		nick_name->SetText(friend_.nick_name);

	CControlUI* desciption = m_PaintManager.FindControl(kDescriptionControlName);
	if (desciption != NULL)
		desciption->SetText(friend_.description);

	CContainerUI* pFontbar = static_cast<CContainerUI*>(m_PaintManager.FindControl(kFontbarControlName));
	if (pFontbar != NULL)
		pFontbar->SetVisible(!pFontbar->IsVisible());
}

void ChatDialog::SendMsg()
{
	ITextServices * pTextServices = m_pSendEdit->GetTextServices();

	tstring strText;
	RichEdit_GetText(pTextServices, strText, m_FaceList);

	pTextServices->Release();

	if (strText.size() <= 0)
		return;

	m_pSendEdit->SetText(_T(""));
	m_pSendEdit->SetFocus();

	AddMsgToRecvEdit(strText.c_str(), _T(""));

	tstring sAttach = _T("");
	tstring sStartTag = _T("/c[\"");
	int iStartPos = strText.find(sStartTag);
	if (-1 != iStartPos)
	{
		iStartPos += sStartTag.length();
		int iEndPos = strText.find(_T("\"]"), iStartPos);
		if (-1 != iEndPos)
		{
			sAttach = strText.substr(iStartPos, iEndPos - iStartPos);
		}
	}
	EMMessageBodyPtr body;
	if (sAttach.empty())
	{
		body = EMTextMessageBodyPtr(new EMTextMessageBody(Unicode_to_UTF8(strText.c_str())));
	}
	else
	{
		body = EMImageMessageBodyPtr(new EMImageMessageBody(Unicode_to_UTF8(sAttach.c_str()), ""));
	}

	EMMessage::EMChatType type = EMMessage::SINGLE;
	EMMessagePtr msg = EMMessage::createSendMessage(g_client->getLoginInfo().loginUser(), mConversationID,
		body, type);
	g_client->getChatManager().sendMessage(msg);
}

void ChatDialog::Notify(TNotifyUI& msg)
{
	if (_tcsicmp(msg.sType, _T("windowinit")) == 0)
	{
		OnPrepare(msg);
	}
	else if (_tcsicmp(msg.sType, _T("killfocus")) == 0)
	{
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
		else if (_tcsicmp(msg.pSender->GetName(), kFontButtonControlName) == 0)
		{
			CContainerUI* pFontbar = static_cast<CContainerUI*>(m_PaintManager.FindControl(kFontbarControlName));
			if (pFontbar != NULL)
				pFontbar->SetVisible(!pFontbar->IsVisible());
		}
		else if (_tcsicmp(msg.pSender->GetName(), kEmotionButtonControlName) == 0)
		{
			POINT pt = {0};
			CDuiRect rcEmotionBtn = msg.pSender->GetPos();
			CDuiRect rcWindow;
			GetWindowRect(m_hWnd, &rcWindow);

			pt.y = rcWindow.top + rcEmotionBtn.top;
			pt.x = rcWindow.left + rcEmotionBtn.left;


			m_FaceSelDlg.SetFaceList(&m_FaceList);
			if (!::IsWindow((HWND)m_FaceSelDlg))
			{
				m_FaceSelDlg.Create(m_hWnd, NULL, WS_CHILD | WS_POPUP, WS_EX_TOOLWINDOW);

				RECT rcBtn = msg.pSender->GetPos();
				::ClientToScreen(m_hWnd, (LPPOINT)&rcBtn);

				int cx = 432;
				int cy = 236;
				int x = rcBtn.left - cx / 2;
				int y = rcBtn.top - cy;

				::SetWindowPos((HWND)m_FaceSelDlg, NULL, x, y, cx, cy, NULL);
				::ShowWindow((HWND)m_FaceSelDlg, SW_SHOW);
			}

		}
		else if (_tcsicmp(msg.pSender->GetName(), kSendButtonControlName) == 0)
        {
            SendMsg();
		}
	}
    else if( _tcsicmp(msg.sType, _T("return")) == 0 ) 
    {
        if (_tcsicmp(msg.pSender->GetName(), kInputRichEditControlName) == 0)
        {
            SendMsg();
        }
    }
	else if (_tcsicmp(msg.sType, _T("timer")) == 0)
	{
		return OnTimer(msg);
	}
	else if (_tcsicmp(msg.sType, _T("selectchanged")) == 0)
	{
		if (_tcsicmp(msg.pSender->GetName(), kColorButtonControlName) == 0)
		{
			CContainerUI* pFontbar = static_cast<CContainerUI*>(m_PaintManager.FindControl(kFontbarControlName));
			if (pFontbar != NULL)
			{
				POINT pt = {0};
				CDuiRect rcFontbar = pFontbar->GetPos();
				CDuiRect rcColorBtn = msg.pSender->GetPos();
				CDuiRect rcWindow;
				GetWindowRect(m_hWnd, &rcWindow);

				pt.y = rcWindow.top + rcFontbar.top;
				pt.x = rcWindow.left + rcColorBtn.left + static_cast<LONG>(rcColorBtn.right - rcColorBtn.left / 2);
				new CColorPicker(this, pt);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kBoldButtonControlName) == 0)
		{
			COptionUI* bold_button = static_cast<COptionUI*>(msg.pSender);
			if (bold_button != NULL)
			{
				bold_ = bold_button->IsSelected();
				FontStyleChanged();
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kItalicButtonControlName) == 0)
		{
			COptionUI* italic_button = static_cast<COptionUI*>(msg.pSender);
			if (italic_button != NULL)
			{
				italic_ = italic_button->IsSelected();
				FontStyleChanged();
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), KUnderlineButtonControlName) == 0)
		{
			COptionUI* underline_button = static_cast<COptionUI*>(msg.pSender);
			if (underline_button != NULL)
			{
				underline_ = underline_button->IsSelected();
				FontStyleChanged();
			}
		}
	}
	else if (_tcsicmp(msg.sType, _T("itemselect")) == 0)
	{
		if (_tcsicmp(msg.pSender->GetName(), kFontTypeControlName) == 0)
		{
			CComboUI* font_type = static_cast<CComboUI*>(msg.pSender);
			if (font_type != NULL)
			{
				font_face_name_ = font_type->GetText();
				FontStyleChanged();
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kFontSizeControlName) == 0)
		{
			CComboUI* font_size = static_cast<CComboUI*>(msg.pSender);
			if (font_size != NULL)
			{
				font_size_ = _ttoi(font_size->GetText());
				FontStyleChanged();
			}
		}
	}
	else if (msg.sType == _T("menu_msg"))
	{
		CControlUI * pControl = (CControlUI *)msg.lParam;
		tstring strMenuName = (TCHAR *)(LPCTSTR)pControl->GetUserData();
		if (strMenuName == _T("Menu_Cut"))
			OnMenu_Cut(msg);
		else if (strMenuName == _T("Menu_Copy"))
			OnMenu_Copy(msg);
		else if (strMenuName == _T("Menu_Paste"))
			OnMenu_Paste(msg);
		else if (strMenuName == _T("Menu_SelAll"))
			OnMenu_SelAll(msg);
		else if (strMenuName == _T("Menu_Clear"))
			OnMenu_Clear(msg);
	}

}

void ChatDialog::SetTextColor(DWORD dwColor)
{
	COptionUI* color_button = static_cast<COptionUI*>(m_PaintManager.FindControl(kColorButtonControlName));
	if (color_button != NULL)
	{
		color_button->Selected(false);
		if (dwColor != 0)
		{
			text_color_ = dwColor;
			FontStyleChanged();
		}
	}
}

LRESULT ChatDialog::HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

void ChatDialog::FontStyleChanged()
{}

// “表情”控件选取消息
LRESULT ChatDialog::OnFaceCtrlSel(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	int nFaceId = m_FaceSelDlg.GetSelFaceId();
	int nFaceIndex = m_FaceSelDlg.GetSelFaceIndex();
	tstring strFileName = m_FaceSelDlg.GetSelFaceFileName();
	tstring strEmoticon = m_FaceSelDlg.GetSelEmoticon();
	if (!strFileName.empty())
	{
		_RichEdit_InsertFace(m_pSendEdit, strFileName.c_str(), nFaceId, nFaceIndex, strEmoticon);
		m_pSendEdit->SetFocus();
	}
	COptionUI* faceBtn = static_cast<COptionUI*>(m_PaintManager.FindControl(kEmotionButtonControlName));
	if (faceBtn != NULL)
	{
		faceBtn->Selected(false);
	}
	return 0;
}


void ChatDialog::_RichEdit_ReplaceSel(CRichEditUI * pRichEdit, LPCTSTR lpszNewText)
{
	ITextServices * pTextServices = pRichEdit->GetTextServices();
	RichEdit_ReplaceSel(pTextServices, lpszNewText);
	pTextServices->Release();
}

BOOL ChatDialog::_RichEdit_InsertFace(CRichEditUI * pRichEdit, LPCTSTR lpszFileName, int nFaceId, int nFaceIndex, tstring strEmoticon)
{
	BOOL bRet = FALSE;

	if (NULL == pRichEdit || NULL == lpszFileName || NULL == *lpszFileName)
		return FALSE;

	ITextServices * pTextServices = pRichEdit->GetTextServices();
	ITextHost * pTextHost = pRichEdit->GetTextHost();
	if (pTextServices != NULL && pTextHost != NULL)
	{
		if (pRichEdit == m_pRecvEdit)
			RichEdit_SetStartIndent(pTextServices, 300);
		bRet = RichEdit_InsertFace(pTextServices, pTextHost,
			lpszFileName, nFaceId, nFaceIndex, RGB(255, 255, 255), TRUE, 40);
	}

	if (pTextServices != NULL)
		pTextServices->Release();
	if (pTextHost != NULL)
		pTextHost->Release();

	return bRet;
}


// “剪切”菜单
void ChatDialog::OnMenu_Cut(TNotifyUI& msg)
{
	m_pSendEdit->Cut();
}

// “复制”菜单
void ChatDialog::OnMenu_Copy(TNotifyUI& msg)
{
	if (msg.pSender == m_pSendEdit)
		m_pSendEdit->Copy();
	else if (msg.pSender == m_pRecvEdit)
		m_pRecvEdit->Copy();
}

// “粘贴”菜单
void ChatDialog::OnMenu_Paste(TNotifyUI& msg)
{
	m_pSendEdit->PasteSpecial(CF_TEXT);
}

// “全部选择”菜单
void ChatDialog::OnMenu_SelAll(TNotifyUI& msg)
{
	if (msg.pSender == m_pSendEdit)
		m_pSendEdit->SetSel(0, -1);
	else if (msg.pSender == m_pRecvEdit)
		m_pRecvEdit->SetSel(0, -1);
}

// “清屏”菜单
void ChatDialog::OnMenu_Clear(TNotifyUI& msg)
{
	m_pRecvEdit->SetText(_T(""));
}

LRESULT ChatDialog::OnRButtonDown(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	POINT pt = { GET_X_LPARAM(lParam), GET_Y_LPARAM(lParam) };
	CControlUI * pControl = this->m_PaintManager.FindControl(pt);
	if (pControl != NULL)
	{
		if (pControl == m_pRecvEdit)
		{
			m_ptRBtnDown = pt;

			CMenuWnd* pMenu = new CMenuWnd(m_hWnd);
			::ClientToScreen(m_hWnd, &pt);
			pMenu->Init(NULL, _T("RecvEditMenu.xml"), _T("xml"), pt, pControl);

			BOOL bSel = (m_pRecvEdit->GetSelectionType() != SEL_EMPTY);
			pMenu->EnableMenuItem(_T("Menu_Copy"), bSel);

			ITextServices * pTextServices = m_pRecvEdit->GetTextServices();

			IImageOle * pImageOle = NULL;
			BOOL bRet = RichEdit_GetImageOle(pTextServices, m_ptRBtnDown, &pImageOle);
			BOOL bSaveAs = (bRet && pImageOle != NULL);
			pMenu->EnableMenuItem(_T("Menu_SaveAs"), bSaveAs);
			if (pImageOle != NULL)
				pImageOle->Release();

			pTextServices->Release();
		}
		else if (pControl == m_pSendEdit)
		{
			m_ptRBtnDown = pt;

			CMenuWnd* pMenu = new CMenuWnd(m_hWnd);
			::ClientToScreen(m_hWnd, &pt);
			pMenu->Init(NULL, _T("SendEditMenu.xml"), _T("xml"), pt, pControl);

			BOOL bSel = (m_pSendEdit->GetSelectionType() != SEL_EMPTY);
			pMenu->EnableMenuItem(_T("Menu_Cut"), bSel);
			pMenu->EnableMenuItem(_T("Menu_Copy"), bSel);

			BOOL bPaste = m_pSendEdit->CanPaste();
			pMenu->EnableMenuItem(_T("Menu_Paste"), bPaste);

			ITextServices * pTextServices = m_pSendEdit->GetTextServices();

			IImageOle * pImageOle = NULL;
			BOOL bRet = RichEdit_GetImageOle(pTextServices, m_ptRBtnDown, &pImageOle);
			BOOL bSaveAs = (bRet && pImageOle != NULL);
			pMenu->EnableMenuItem(_T("Menu_SaveAs"), bSaveAs);
			if (pImageOle != NULL)
				pImageOle->Release();

			pTextServices->Release();
		}
	}
	return 0;
}

LRESULT ChatDialog::OnLButtonDblClk(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	POINT pt = { GET_X_LPARAM(lParam), GET_Y_LPARAM(lParam) };
	CControlUI * pControl = this->m_PaintManager.FindControl(pt);
	if (pControl != NULL)
	{
		if (pControl == m_pSendEdit || pControl == m_pRecvEdit)
		{
			ITextServices * pTextServices = ((CRichEditUI *)pControl)->GetTextServices();

			IImageOle * pImageOle = NULL;
			BOOL bRet = RichEdit_GetImageOle(pTextServices, pt, &pImageOle);
			if (bRet && pImageOle != NULL)
			{
				BSTR bstrFileName = NULL;
				HRESULT hr = pImageOle->GetFileName(&bstrFileName);
				if (SUCCEEDED(hr))
					::ShellExecute(NULL, _T("open"), bstrFileName, NULL, NULL, SW_SHOWNORMAL);
				if (bstrFileName != NULL)
					::SysFreeString(bstrFileName);
			}
			if (pImageOle != NULL)
				pImageOle->Release();

			pTextServices->Release();
		}
	}
	return 0;
}

BOOL ChatDialog::HandleEMFaceId(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText, tstring& strEMFace)
{
	int nFaceId = GetBetweenInt(p, _T("["), _T("]"), -1);
	tstring strMatched = GetBetweenString(p, _T("["), _T("]"));

	tstring strEmoticon = _T("[");
	strEmoticon += strMatched;
	strEmoticon += _T("]");
	CFaceInfo * lpFaceInfo = m_FaceList.GetFaceInfoByEmoticon(strEmoticon.c_str());
	if (lpFaceInfo != NULL)
	{
		if (!strText.empty())
		{
			_RichEdit_ReplaceSel(pRichEdit, strText.c_str());
			strText = _T("");
		}

		_RichEdit_InsertFace(pRichEdit, lpFaceInfo->m_strFileName.c_str(),
			lpFaceInfo->m_nId, lpFaceInfo->m_nIndex, lpFaceInfo->m_strEmoticon);
		strEMFace = lpFaceInfo->m_strEmoticon;
		p = _tcsstr(p, _T("]"));
		return TRUE;
	}
	return FALSE;
}

BOOL ChatDialog::HandleSysFaceId(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText, tstring& strEMFace)
{
	int nFaceId = GetBetweenInt(p + 2, _T("[\""), _T("\"]"), -1);
	CFaceInfo * lpFaceInfo = m_FaceList.GetFaceInfoById(nFaceId);
	if (lpFaceInfo != NULL)
	{
		if (!strText.empty())
		{
			_RichEdit_ReplaceSel(pRichEdit, strText.c_str());
			strText = _T("");
		}

		_RichEdit_InsertFace(pRichEdit, lpFaceInfo->m_strFileName.c_str(),
			lpFaceInfo->m_nId, lpFaceInfo->m_nIndex, lpFaceInfo->m_strEmoticon);
		strEMFace = lpFaceInfo->m_strTip;
		p = _tcsstr(p + 2, _T("\"]"));
		p++;
		return TRUE;
	}
	return FALSE;
}

BOOL ChatDialog::HandleSysFaceIndex(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText)
{
	int nFaceIndex = GetBetweenInt(p + 2, _T("[\""), _T("\"]"), -1);
	CFaceInfo * lpFaceInfo = m_FaceList.GetFaceInfoByIndex(nFaceIndex);
	if (lpFaceInfo != NULL)
	{
		if (!strText.empty())
		{
			_RichEdit_ReplaceSel(pRichEdit, strText.c_str());
			strText = _T("");
		}

		_RichEdit_InsertFace(pRichEdit, lpFaceInfo->m_strFileName.c_str(),
			lpFaceInfo->m_nId, lpFaceInfo->m_nIndex, lpFaceInfo->m_strEmoticon);

		p = _tcsstr(p + 2, _T("\"]"));
		p++;
		return TRUE;
	}
	return FALSE;
}

BOOL ChatDialog::HandleCustomPic(CRichEditUI * pRichEdit, LPCTSTR& p, tstring& strText)
{
	tstring strFileName = GetBetweenString(p + 2, _T("[\""), _T("\"]"));
	if (!strFileName.empty())
	{
		if (!strText.empty())
		{
			_RichEdit_ReplaceSel(pRichEdit, strText.c_str());
			strText = _T("");
		}

		_RichEdit_InsertFace(pRichEdit, strFileName.c_str(), -1, -1,_T(""));

		p = _tcsstr(p + 2, _T("\"]"));
		p++;
		return TRUE;
	}
	return FALSE;
}

// "/f["系统表情id"]/s["系统表情index"]/c["自定义图片路径"]"
void ChatDialog::AddMsg(CRichEditUI * pRichEdit, LPCTSTR lpText)
{
	if (NULL == pRichEdit || NULL == lpText || NULL == *lpText)
		return;

	tstring strText;
	tstring strRet;
	for (LPCTSTR p = lpText; *p != _T('\0'); p++)
	{
		if (*p == _T('/'))
		{
			if (*(p + 1) == _T('/'))
			{
				strText += *p;
				strRet += *p;
				p++;
				continue;
			}
			else if (*(p + 1) == _T('f'))
			{
				tstring strEMFace;
				if (HandleSysFaceId(pRichEdit, p, strText, strEMFace))
				{
					strRet += strEMFace;
					continue;
				}
			}
			else if (*(p + 1) == _T('s'))
			{
				if (HandleSysFaceIndex(pRichEdit, p, strText))
					continue;
			}
			else if (*(p + 1) == _T('c'))
			{
				if (HandleCustomPic(pRichEdit, p, strText))
					continue;
			}
		}
		else if (*p == _T('['))
		{
			tstring strEMFace;
			if (HandleEMFaceId(pRichEdit, p, strText, strEMFace))
			{
				strRet += strEMFace;
				continue;
			}
		}
		strText += *p;
		strRet += strText;
	}

	if (!strText.empty())
	{
		_RichEdit_ReplaceSel(pRichEdit, strText.c_str());
	}
}

void ChatDialog::AddMsgToSendEdit(LPCTSTR lpText)
{
	AddMsg(m_pSendEdit, lpText);
	m_pSendEdit->EndDown();
}

void ChatDialog::AddMsgToRecvEdit(LPCTSTR lpText, LPCTSTR lpAttach, LPCTSTR lpFrom, LPCTSTR lpTimestamp)
{
	if (NULL == lpText || NULL == *lpText)
		return;

	m_pRecvEdit->SetAutoURLDetect(true);

	tstring strTime;
	strTime = GetLocalTime().c_str();

	ITextServices * pTextServices = m_pRecvEdit->GetTextServices();
	RichEdit_SetSel(pTextServices, -1, -1);

	TCHAR cText[2048] = { 0 };
	wsprintf(cText, _T("%s("), lpFrom==NULL? _T("我"):lpFrom);


	RichEdit_ReplaceSel(pTextServices, cText,
		_T("宋体"), 9, RGB(0, 0, 255), FALSE, FALSE, FALSE, FALSE, 0);

	wsprintf(cText, _T("%u"), 43156150);
	RichEdit_ReplaceSel(pTextServices, cText,
		_T("宋体"), 9, RGB(0, 114, 193), FALSE, FALSE, TRUE, TRUE, 0);

	wsprintf(cText, _T(")  %s\r\n"), lpTimestamp == NULL?strTime.c_str():lpTimestamp);
	RichEdit_ReplaceSel(pTextServices, cText,
		_T("宋体"), 9, RGB(0, 0, 255), FALSE, FALSE, FALSE, FALSE, 0);

	m_pRecvEdit->SetAutoURLDetect(true);

	if (lpAttach != NULL && lpAttach[0] != '\0')
	{
		_RichEdit_InsertFace(m_pRecvEdit, lpAttach, -1, -1, _T(""));
	}
	else
	{
		AddMsg(m_pRecvEdit, lpText);
	}

	RichEdit_ReplaceSel(pTextServices, _T("\r\n"));
	RichEdit_SetStartIndent(pTextServices, 0);
	m_pRecvEdit->EndDown();

	pTextServices->Release();
}
