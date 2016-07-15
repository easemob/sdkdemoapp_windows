#include "StdAfx.h"
#include "FaceSelDlg.h"

CFaceSelDlg::CFaceSelDlg(void)
{
	m_lpFaceList = NULL;
	m_nSelFaceId = -1;
	m_nSelFaceIndex = -1;
	m_strSelFaceFileName = _T("");
	m_strSelEmoticon = _T("");
}

CFaceSelDlg::~CFaceSelDlg(void)
{
}

LPCTSTR CFaceSelDlg::GetWindowClassName() const
{
	return _T("DUI_WINDOW");
}

void CFaceSelDlg::Init()
{
	m_pFaceCtrl = static_cast<CFaceCtrl*>(m_PaintManager.FindControl(_T("FaceCtrl1")));

	//m_pFaceCtrl->SetBgColor(RGB(255, 255, 255));
	m_pFaceCtrl->SetLineColor(RGB(223, 230, 246));
	m_pFaceCtrl->SetFocusBorderColor(RGB(0, 0, 255));
	m_pFaceCtrl->SetZoomBorderColor(RGB(0, 138, 255));
	m_pFaceCtrl->SetRowAndCol(8, 15);
	m_pFaceCtrl->SetItemSize(28, 28);
	m_pFaceCtrl->SetZoomSize(84, 84);
	m_pFaceCtrl->SetFaceList(m_lpFaceList);
	m_pFaceCtrl->SetCurPage(0);

	m_nSelFaceId = -1;
	m_nSelFaceIndex = -1;
	m_strSelFaceFileName = _T("");
	m_strSelEmoticon = _T("");
}

void CFaceSelDlg::InitWindow()
{
	m_pFaceCtrl = static_cast<CFaceCtrl*>(m_PaintManager.FindControl(_T("FaceCtrl1")));

	//m_pFaceCtrl->SetBgColor(RGB(255, 255, 255));
	m_pFaceCtrl->SetLineColor(RGB(223, 230, 246));
	m_pFaceCtrl->SetFocusBorderColor(RGB(0, 0, 255));
	m_pFaceCtrl->SetZoomBorderColor(RGB(0, 138, 255));
	m_pFaceCtrl->SetRowAndCol(8, 15);
	m_pFaceCtrl->SetItemSize(28, 28);
	m_pFaceCtrl->SetZoomSize(84, 84);
	m_pFaceCtrl->SetFaceList(m_lpFaceList);
	m_pFaceCtrl->SetCurPage(0);

	m_nSelFaceId = -1;
	m_nSelFaceIndex = -1;
	m_strSelFaceFileName = _T("");
	m_strSelEmoticon = _T("");
}

CDuiString CFaceSelDlg::GetSkinFile()
{
	return _T("FaceSelDlg.xml");
}

CDuiString CFaceSelDlg::GetSkinFolder()
{
	return CDuiString(CPaintManagerUI::GetInstancePath()) + _T("skin\\");
}

CControlUI* CFaceSelDlg::CreateControl(LPCTSTR pstrClass)
{
	if (_tcsicmp(pstrClass, _T("FaceCtrl")) == 0)
		return new CFaceCtrl;
	return NULL;
}

LRESULT CFaceSelDlg::ResponseDefaultKeyEvent(WPARAM wParam)
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

void CFaceSelDlg::OnFinalMessage(HWND hWnd)
{
	WindowImplBase::OnFinalMessage(hWnd);
}

LRESULT CFaceSelDlg::HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	if (uMsg == WM_ACTIVATE)
	{
		if (WA_INACTIVE == (UINT)LOWORD(wParam))
			::PostMessage(m_hWnd, WM_CLOSE, NULL, NULL);
	}
	else if (uMsg == WM_CLOSE)
	{
		::PostMessage(::GetParent(m_hWnd), FACE_CTRL_SEL, NULL, NULL);
		::DestroyWindow(m_hWnd);
		return 0;
	}
	return __super::HandleMessage(uMsg, wParam, lParam);
}

LRESULT CFaceSelDlg::HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	return 0;
}

void CFaceSelDlg::SetFaceList(CFaceList * lpFaceList)
{
	m_lpFaceList = lpFaceList;
}

int CFaceSelDlg::GetSelFaceId()
{
	return m_nSelFaceId;
}

int CFaceSelDlg::GetSelFaceIndex()
{
	return m_nSelFaceIndex;
}

tstring CFaceSelDlg::GetSelFaceFileName()
{
	return m_strSelFaceFileName;
}

tstring CFaceSelDlg::GetSelEmoticon()
{
	return m_strSelEmoticon;
}

void CFaceSelDlg::Notify(TNotifyUI& msg)
{
	if (msg.sType == _T("click"))
	{
		if (msg.pSender == m_pFaceCtrl)
		{
			int nSelIndex = (int)msg.lParam;
			CFaceInfo * lpFaceInfo = m_pFaceCtrl->GetFaceInfo(nSelIndex);
			if (lpFaceInfo != NULL)
			{
				m_nSelFaceId = lpFaceInfo->m_nId;
				m_nSelFaceIndex = lpFaceInfo->m_nIndex;
				m_strSelFaceFileName = lpFaceInfo->m_strFileName;
				m_strSelEmoticon = lpFaceInfo->m_strEmoticon;
			}
			::PostMessage(m_hWnd, WM_CLOSE, NULL, NULL);
		}
	}
}