#include "stdafx.h"
#include <windows.h>
#include <shellapi.h>

#include "login_dialog.hpp"
#include "ColorPicker.hpp"
#include "application.h"
#include "main_frame.hpp"
#include "utils.h"

using namespace std;
using namespace easemob;
using namespace utils;

const TCHAR* const kTitleControlName = _T("apptitle");
const TCHAR* const kCloseButtonControlName = _T("closebtn");
const TCHAR* const kMinButtonControlName = _T("minbtn");
const TCHAR* const kMaxButtonControlName = _T("maxbtn");
const TCHAR* const kRestoreButtonControlName = _T("restorebtn");

const TCHAR* const kBackgroundControlName = _T("bg");

const TCHAR* const kLogoButtonControlName = _T("logo");
const TCHAR* const kInputRichEditControlName = _T("input_richedit");
const TCHAR* const kLoginButtonControlName = _T("loginbtn");
const TCHAR* const kSignupButtonControlName = _T("signupbtn");

const TCHAR* const kAccountEditControlName = _T("accountedit");
const TCHAR* const kPWEditControlName = _T("pwedit");

const TCHAR* const kOptionSavePassword = _T("save_password");
const TCHAR* const kOptionAutoLogin = _T("auto_login");

const int kEmotionRefreshTimerId = 1001;
const int kEmotionRefreshInterval = 150;

LoginDialog::LoginDialog()
: emotion_timer_start_(false)
, text_color_(0xFF000000)
, bold_(false)
, italic_(false)
, underline_(false)
, font_size_(12)
, font_face_name_(_T("Î¢ÈíÑÅºÚ"))
{
	bgimage_ = CDuiString(_T("bg_login.png"));
	bkcolor_ = 0;
}

LoginDialog::~LoginDialog()
{
	if (g_client) {
		delete g_client;
		g_client = nullptr;
	}

	PostQuitMessage(0);
}

LPCTSTR LoginDialog::GetWindowClassName() const
{
	return _T("LoginDialog");
}

CControlUI* LoginDialog::CreateControl(LPCTSTR pstrClass)
{
	return NULL;
}

void LoginDialog::OnFinalMessage(HWND hWnd)
{
	RemoveObserver();
	WindowImplBase::OnFinalMessage(hWnd);	
	delete this;
}

BOOL LoginDialog::Receive(SkinChangedParam param)
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

CDuiString LoginDialog::GetSkinFile()
{
	return _T("login.xml");
}

CDuiString LoginDialog::GetSkinFolder()
{
	return CDuiString(CPaintManagerUI::GetInstancePath()) + _T("skin\\");
}

LRESULT LoginDialog::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	g_client->logout();
	bHandled = FALSE;
	return 0;
}

LRESULT LoginDialog::OnSetFocus(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

LRESULT LoginDialog::OnSysCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
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

LRESULT LoginDialog::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	return __super::HandleMessage(uMsg, wParam, lParam);
}

LRESULT LoginDialog::ResponseDefaultKeyEvent(WPARAM wParam)
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

void LoginDialog::OnTimer(TNotifyUI& msg)
{}

void LoginDialog::OnExit(TNotifyUI& msg)
{
	Close();
}

void LoginDialog::InitWindow()
{
	string strAppDir = GetAppDataDir();

	static const string WORK_PATH = ".";
	easemob::EMChatConfigsPtr configs(new easemob::EMChatConfigs(strAppDir, strAppDir, "easemob-demo#chatdemoui"));
	configs->setEnableConsoleLog(false);
	EMClient *client = EMClient::create(configs);
	g_client = client;

}

void LoginDialog::OnPrepare(TNotifyUI& msg)
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


	wstring strAppDir = GetAppDataDirW();
	string sID = getJsonValue(strAppDir + _T("\\") + kAccountsFile, "ID");
	CEditUI* pEdit = static_cast<CEditUI*>(m_PaintManager.FindControl(kAccountEditControlName));
	size_t s;
	pEdit->SetText(UTF8_to_Unicode(sID.c_str(),&s));

	string sPW = getJsonValue(strAppDir + _T("\\") + kAccountsFile, "Password");
	if (sPW != "")
	{
		COptionUI* pOptionSavePassword = static_cast<COptionUI*>(m_PaintManager.FindControl(kOptionSavePassword));
		if (pOptionSavePassword != NULL)
		{
			pOptionSavePassword->Selected(true);
		}

		CEditUI* pEditPW = static_cast<CEditUI*>(m_PaintManager.FindControl(kPWEditControlName));
		size_t s;
		pEditPW->SetText(UTF8_to_Unicode(sPW.c_str(), &s));

		string sAutoLogin = getJsonValue(strAppDir + _T("\\") + kAccountsFile, "AutoLogin");
		if (!sAutoLogin.compare("true"))
		{
			COptionUI* pOptionAutoLogin = static_cast<COptionUI*>(m_PaintManager.FindControl(kOptionAutoLogin));
			if (pOptionAutoLogin != NULL)
			{
				pOptionAutoLogin->Selected(true);
			}

			Login();
		}
	}
}
void LoginDialog::Signup()
{
	CEditUI* pEdit = static_cast<CEditUI*>(m_PaintManager.FindControl(kAccountEditControlName));
	CDuiString strID = pEdit->GetText();
	if (strID.IsEmpty())
	{
		pEdit->SetFocus();
	}
	else
	{
		pEdit = static_cast<CEditUI*>(m_PaintManager.FindControl(kPWEditControlName));
		CDuiString strPW = pEdit->GetText();
		if (strPW.IsEmpty())
		{
			pEdit->SetFocus();
		}
		else
		{
			EMErrorPtr error = g_client->createAccount(std::string(Unicode_to_UTF8(strID)), std::string(Unicode_to_UTF8(strPW)));
			cout << "mErrorCode address:" << &error->mErrorCode << " val" << error->mErrorCode << endl;
			long addr = (long)&error->mErrorCode;
			cout << addr << endl;
			if (error->mErrorCode == EMError::EM_NO_ERROR) 
			{
				Login();
			}
			else
			{
				::MessageBoxA(0, "Sing up failed!", "LOGIN", MB_OK);
			}
		}
	}

}
void LoginDialog::Login()
{
	CEditUI* pEdit = static_cast<CEditUI*>(m_PaintManager.FindControl(kAccountEditControlName));
	CDuiString strID = pEdit->GetText();
	if (strID.IsEmpty())
	{
		pEdit->SetFocus();
	}
	else
	{
		pEdit = static_cast<CEditUI*>(m_PaintManager.FindControl(kPWEditControlName));
		CDuiString strPW = pEdit->GetText();
		if (strPW.IsEmpty())
		{
			pEdit->SetFocus();
		}
		else
		{
			//EMErrorPtr error(new EMError);
			EMErrorPtr error = g_client->login(std::string(Unicode_to_UTF8(strID)), std::string(Unicode_to_UTF8(strPW)));
			cout << "mErrorCode address:" << &error->mErrorCode << " val" << error->mErrorCode << endl;
			long addr = (long)&error->mErrorCode;
			cout << addr << endl;
			if (error->mErrorCode == EMError::EM_NO_ERROR) {
				MainFrame* pFrame = new MainFrame(m_hWnd);
				if( pFrame == NULL ) return;
#if defined(WIN32) && !defined(UNDER_CE)
				pFrame->Create(NULL, _T("Easemob"), UI_WNDSTYLE_FRAME, WS_EX_STATICEDGE | WS_EX_APPWINDOW, 0, 0, 600, 800);
#else
				pFrame->Create(NULL, _T("Easemob"), UI_WNDSTYLE_FRAME, WS_EX_TOPMOST, 0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN));
#endif
				pFrame->CenterWindow();
				::ShowWindow(*pFrame, SW_SHOW);
				::ShowWindow(m_hWnd, SW_HIDE);

				wstring strAppDir = GetAppDataDirW();
				setJsonValue(strAppDir + _T("\\") + kAccountsFile, "ID", std::string(Unicode_to_UTF8(strID)));	

				COptionUI* pOptionSavePassword = static_cast<COptionUI*>(m_PaintManager.FindControl(kOptionSavePassword));
				if (pOptionSavePassword != NULL)
				{
					CDuiString sPW = pOptionSavePassword->IsSelected() ? strPW : _T("");
					setJsonValue(strAppDir + _T("\\") + kAccountsFile, "Password", std::string(Unicode_to_UTF8(sPW)));
				}
				COptionUI* pOptionAutoLogin = static_cast<COptionUI*>(m_PaintManager.FindControl(kOptionAutoLogin));
				if (pOptionAutoLogin != NULL)
				{
					CDuiString sAutoLogin = pOptionAutoLogin->IsSelected() ? _T("true") : _T("false");
					setJsonValue(strAppDir + _T("\\") + kAccountsFile, "AutoLogin", std::string(Unicode_to_UTF8(sAutoLogin)));
				}

			}
			else {
				::MessageBoxA(0, "Failed!", "LOGIN", MB_OK);
			}
		}
	}

}


void LoginDialog::Notify(TNotifyUI& msg)
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
		else if (_tcsicmp(msg.pSender->GetName(), kLoginButtonControlName) == 0)
		{
			Login();
		}
		else if (_tcsicmp(msg.pSender->GetName(), kSignupButtonControlName) == 0)
		{
			Signup();
		}
	}
    else if( _tcsicmp(msg.sType, _T("return")) == 0 ) 
    {
        if (_tcsicmp(msg.pSender->GetName(), kInputRichEditControlName) == 0)
        {
			Login();
        }
    }
	else if (_tcsicmp(msg.sType, _T("timer")) == 0)
	{
		return OnTimer(msg);
	}
	else if (_tcsicmp(msg.sType, _T("selectchanged")) == 0)
	{
		COptionUI* pOptionSavePassword = static_cast<COptionUI*>(m_PaintManager.FindControl(kOptionSavePassword));
		COptionUI* pOptionAutoLogin = static_cast<COptionUI*>(m_PaintManager.FindControl(kOptionAutoLogin));
		if (_tcsicmp(msg.pSender->GetName(), kOptionSavePassword) == 0)
		{
			if (pOptionAutoLogin != NULL && !pOptionSavePassword->IsSelected())
			{
				pOptionAutoLogin->Selected(false);
			}
		}
		else if (_tcsicmp(msg.pSender->GetName(), kOptionAutoLogin) == 0)
		{
			if (pOptionSavePassword != NULL && pOptionAutoLogin->IsSelected())
			{
				pOptionSavePassword->Selected(true);
			}
		}	
	}
}


LRESULT LoginDialog::HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = FALSE;
	return 0;
}

void LoginDialog::FontStyleChanged()
{}