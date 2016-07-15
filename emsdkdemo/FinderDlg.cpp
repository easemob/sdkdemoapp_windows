#include "stdafx.h"
#include <windows.h>
#include <shellapi.h>

#include "FinderDlg.hpp"
#include "application.h"
#include "utils.h"
#include "emcontactmanager_interface.h"

using namespace std;
using namespace easemob;
using namespace utils;

const TCHAR* const kTitleControlName = _T("apptitle");
const TCHAR* const kCloseButtonControlName = _T("closebtn");
const TCHAR* const kMinButtonControlName = _T("minbtn");
const TCHAR* const kMaxButtonControlName = _T("maxbtn");
const TCHAR* const kRestoreButtonControlName = _T("restorebtn");

const TCHAR* const kBackgroundControlName = _T("bg");

const TCHAR* const kInputRichEditControlName = _T("input_richedit");
const TCHAR* const kFindButtonControlName = _T("findbtn");

const TCHAR* const kAccountEditControlName = _T("accountedit");
const TCHAR* const kInviteMsgEditControlName = _T("invite_msg");

const TCHAR* const kResultButtonName = _T("result");
const TCHAR* const kAddButtonControlName = _T("addbtn");
const TCHAR* const kResultNameLayoutName = _T("result_add");

const int kEmotionRefreshTimerId = 1001;
const int kEmotionRefreshInterval = 150;

FinderDlg::FinderDlg()
: emotion_timer_start_(false)
, text_color_(0xFF000000)
, bold_(false)
, italic_(false)
, underline_(false)
, font_size_(12)
, font_face_name_(_T("Î¢ÈíÑÅºÚ"))
{
	bgimage_ = CDuiString(_T(""));
	bkcolor_ = 0;
}

FinderDlg::~FinderDlg()
{
}

LPCTSTR FinderDlg::GetWindowClassName() const
{
	return _T("FinderDlg");
}

CControlUI* FinderDlg::CreateControl(LPCTSTR pstrClass)
{
	return NULL;
}

void FinderDlg::OnFinalMessage(HWND hWnd)
{
	RemoveObserver();
	g_WndManager->RemoveWnd(this);

	WindowImplBase::OnFinalMessage(hWnd);	
	delete this;
}

BOOL FinderDlg::Receive(SkinChangedParam param)
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

CDuiString FinderDlg::GetSkinFile()
{
	return _T("finder.xml");
}

CDuiString FinderDlg::GetSkinFolder()
{
	return CDuiString(CPaintManagerUI::GetInstancePath()) + _T("skin\\");
}

LRESULT FinderDlg::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

LRESULT FinderDlg::OnSetFocus(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

LRESULT FinderDlg::OnSysCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
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

LRESULT FinderDlg::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	return __super::HandleMessage(uMsg, wParam, lParam);
}

LRESULT FinderDlg::ResponseDefaultKeyEvent(WPARAM wParam)
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

void FinderDlg::OnTimer(TNotifyUI& msg)
{}

void FinderDlg::OnExit(TNotifyUI& msg)
{
	Close();
}

void FinderDlg::InitWindow()
{
	static const string WORK_PATH = ".";
	easemob::EMChatConfigsPtr configs(new easemob::EMChatConfigs(WORK_PATH, WORK_PATH, "easemob-demo#chatdemoui"));
	configs->setEnableConsoleLog(false);
}

void FinderDlg::OnPrepare(TNotifyUI& msg)
{
	TCHAR szBuf[MAX_PATH] = {0};

	CControlUI* background = m_PaintManager.FindControl(kBackgroundControlName);
	if (background != NULL)
	{
#if defined(UNDER_WINCE)
		_stprintf(szBuf, _T("file='bg%d.png' corner='600,200,1,1'"), 0);
#else
		_stprintf_s(szBuf, MAX_PATH - 1, _T("file='bg%d.png' corner='600,200,1,1'"), 0);
#endif
		background->SetBkImage(szBuf);
		background->SetBkColor(bkcolor_);
	}
}

void FinderDlg::Find()
{
	CEditUI* pEdit = static_cast<CEditUI*>(m_PaintManager.FindControl(kAccountEditControlName));
	CDuiString strID = pEdit->GetText();
	if (strID.IsEmpty())
	{
		pEdit->SetFocus();
	}
	else
	{
		CControlUI* pControl = static_cast<CControlUI*>(m_PaintManager.FindControl(kResultNameLayoutName));
		if (pControl)
		{
			pControl->SetVisible(true);
			CButtonUI* pResultBtn = static_cast<CButtonUI*>(m_PaintManager.FindControl(kResultButtonName));
			if (pResultBtn)
			{
				pResultBtn->SetText(strID);
			}
		}

	}

}

void FinderDlg::Add()
{
	CButtonUI* pResultBtn = static_cast<CButtonUI*>(m_PaintManager.FindControl(kResultButtonName));
	if (pResultBtn)
	{
		CDuiString strID = pResultBtn->GetText();
		if (!strID.IsEmpty())
		{
			CEditUI* pEdit = static_cast<CEditUI*>(m_PaintManager.FindControl(kInviteMsgEditControlName));
			if (pEdit)
			{
				CDuiString strInviteMsg = pEdit->GetText();
				EMErrorPtr error(new EMError);
				g_client->getContactManager().inviteContact(std::string(Unicode_to_UTF8(strID)), std::string(Unicode_to_UTF8(strInviteMsg)), *error);
				cout << "mErrorCode address:" << &error->mErrorCode << " val" << error->mErrorCode << endl;
				long addr = (long)&error->mErrorCode;
				cout << addr << endl;
				if (error->mErrorCode == EMError::EM_NO_ERROR) {
					::MessageBoxA(0, "Invite message sent!", "LOGIN", MB_OK);
				}
				else {
					::MessageBoxA(0, "Failed!", "LOGIN", MB_OK);
				}
			}
		}
	}

}

void FinderDlg::Notify(TNotifyUI& msg)
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
		else if (_tcsicmp(msg.pSender->GetName(), kFindButtonControlName) == 0)
		{
			Find();
		}
		else if (_tcsicmp(msg.pSender->GetName(), kAddButtonControlName) == 0)
		{
			Add();
		}
	}
    else if( _tcsicmp(msg.sType, _T("return")) == 0 ) 
    {
        if (_tcsicmp(msg.pSender->GetName(), kInputRichEditControlName) == 0)
        {
			Find();
        }
    }
	else if (_tcsicmp(msg.sType, _T("timer")) == 0)
	{
		return OnTimer(msg);
	}

}


LRESULT FinderDlg::HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

void FinderDlg::FontStyleChanged()
{}