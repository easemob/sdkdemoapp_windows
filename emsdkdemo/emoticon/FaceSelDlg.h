#pragma once

#include "..\DuiLib\Utils\WinImplBase.h"
#include "FaceCtrl.h"

#define		FACE_CTRL_SEL		WM_USER + 1

class CFaceSelDlg : public WindowImplBase
{
public:
	CFaceSelDlg(void);
	~CFaceSelDlg(void);

public:
	LPCTSTR GetWindowClassName() const;	
	virtual void Init();
	virtual CDuiString GetSkinFile();
	virtual CDuiString GetSkinFolder();
	virtual CControlUI* CreateControl(LPCTSTR pstrClass);
	virtual LRESULT ResponseDefaultKeyEvent(WPARAM wParam);
	virtual void OnFinalMessage(HWND hWnd);
	virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);
	virtual LRESULT HandleCustomMessage(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
	virtual void InitWindow();

public:
	void SetFaceList(CFaceList * lpFaceList);
	int GetSelFaceId();
	int GetSelFaceIndex();
	tstring GetSelFaceFileName();
	tstring GetSelEmoticon();
protected:
	void Notify(TNotifyUI& msg);

private:
	CFaceCtrl * m_pFaceCtrl;
	CFaceList * m_lpFaceList;
	int m_nSelFaceId;
	int m_nSelFaceIndex;
	tstring m_strSelFaceFileName;
	tstring m_strSelEmoticon;
};
