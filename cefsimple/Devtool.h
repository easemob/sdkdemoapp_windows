#pragma once
#include "resource.h"
#include <atlbase.h>
#include <atlwin.h>

class CDevtoolClient;
class CDevtool : public CDialogImpl < CDevtool >
{
public:
	enum { IDD = IDD_DLG_DEV_TOOL };

  BEGIN_MSG_MAP(CDevtool)
    MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
	MESSAGE_HANDLER(WM_SIZE, OnSize)
	MESSAGE_HANDLER(WM_CLOSE,OnClose)
  END_MSG_MAP()

  LRESULT OnInitDialog(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnSize(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnClose(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);

//private:
  CDevtoolClient* m_client = nullptr;
};
