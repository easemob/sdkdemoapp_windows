
#include "resource.h"
#include "Devtool.h"
#include "DevtoolClient.h"

LRESULT CDevtool::OnInitDialog(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/)
{
  CenterWindow(GetParent());

  return TRUE;
}

LRESULT CDevtool::OnSize(UINT /*uMsg*/, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	SIZE size;
	size.cx = LOWORD(lParam);
	size.cy = HIWORD(lParam);
  if (!m_client)
    return S_FALSE;

  if (m_client->GetBrowser()) {
    // Retrieve the window handle (parent window with off-screen rendering).
    CefWindowHandle hwnd =
      m_client->GetBrowser()->GetHost()->GetWindowHandle();
    if (hwnd) {
      ::SetWindowPos(hwnd, NULL,
        0, 0, size.cx, size.cy, SWP_NOZORDER | SWP_NOMOVE | SWP_NOACTIVATE);
    }
  }
  return S_OK;
}

LRESULT CDevtool::OnClose(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/)
{
  SetMsgHandled(FALSE);
  if (!m_client)
    return S_FALSE;

  if (m_client->GetBrowser()) {
    // Retrieve the window handle (parent window with off-screen rendering).
    m_client->GetBrowser()->GetHost()->CloseBrowser(true);
  }
  m_client = NULL;
  DestroyWindow();
  return S_OK;
}