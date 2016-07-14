//
// win_impl_base.hpp
// ~~~~~~~~~~~~~~~~~
//
// Copyright (c) 2011 achellies (achellies at 163 dot com), wangchyz (wangchyz at gmail dot com)
//
// This code may be used in compiled form in any way you desire. This
// source file may be redistributed by any means PROVIDING it is 
// not sold for profit without the authors written consent, and 
// providing that this notice and the authors name is included. 
//
// This file is provided "as is" with no expressed or implied warranty.
// The author accepts no liability if it causes any damage to you or your
// computer whatsoever. It's free, so don't hassle me about it.
//
// Beware of bugs.
//

#include "stdafx.h"
#include "..\DuiLib\Utils\WinImplBase.h"
#include "login_dialog.hpp"

#include <atlbase.h>
CComModule _Module;
#include <atlwin.h>
#include "application.h"

#if defined(WIN32) && !defined(UNDER_CE)
int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE /*hPrevInstance*/, LPSTR /*lpCmdLine*/, int nCmdShow)
#else
int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE /*hPrevInstance*/, LPTSTR lpCmdLine, int nCmdShow)
#endif
{
    CPaintManagerUI::SetInstance(hInstance);
    CPaintManagerUI::SetResourcePath(CPaintManagerUI::GetInstancePath()+_T("skin\\EMRes\\"));

	HINSTANCE hInstRich = ::LoadLibrary(_T("Riched20.dll"));

	::CoInitialize(NULL);
	::OleInitialize(NULL);

	_Module.Init( 0, hInstance );

#if defined(WIN32) && !defined(UNDER_CE)
	HRESULT Hr = ::CoInitialize(NULL);
#else
	HRESULT Hr = ::CoInitializeEx(NULL, COINIT_MULTITHREADED);
#endif
	if( FAILED(Hr) ) return 0;

//	MainFrame* pFrame = new MainFrame();
//	if( pFrame == NULL ) return 0;
//#if defined(WIN32) && !defined(UNDER_CE)
//	pFrame->Create(NULL, _T("Easemob"), UI_WNDSTYLE_FRAME, WS_EX_STATICEDGE | WS_EX_APPWINDOW, 0, 0, 600, 800);
//#else
//	pFrame->Create(NULL, _T("Easemob"), UI_WNDSTYLE_FRAME, WS_EX_TOPMOST, 0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN));
//#endif
//	pFrame->CenterWindow();
//	::ShowWindow(*pFrame, SW_SHOW);

	LoginDialog *pLoginDlg = new LoginDialog();
	if (pLoginDlg == NULL) return 0;
#if defined(WIN32) && !defined(UNDER_CE)
	pLoginDlg->Create(NULL, _T("EaseMob"), WS_POPUPWINDOW, 0, 0, 430, 330);
#else
	pLoginDlg->Create(NULL, _T("EaseMob"), UI_WNDSTYLE_FRAME, WS_EX_TOPMOST, 0, 0, GetSystemMetrics(SM_CXSCREEN), GetSystemMetrics(SM_CYSCREEN));
#endif
	pLoginDlg->CenterWindow();
	::ShowWindow(*pLoginDlg, SW_SHOW);

	CPaintManagerUI::MessageLoop();
	CPaintManagerUI::Term();

	_Module.Term();

	::OleUninitialize();
	::CoUninitialize();
	delete g_client;
	::FreeLibrary(hInstRich);

	return 0;
}