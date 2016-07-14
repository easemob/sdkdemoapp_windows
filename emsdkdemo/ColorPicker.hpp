#ifndef COLORPICKER_HPP
#define COLORPICKER_HPP
#include "..\DuiLib\Utils\WinImplBase.h"
#include "ISetTextColor.hpp"

class ChatDialog;
class CColorPicker : public WindowImplBase
{
public:
	CColorPicker(ISetTextColor* chat_dialog, POINT ptMouse);

	LPCTSTR GetWindowClassName() const;

	virtual void OnFinalMessage(HWND hWnd);

	void Notify(TNotifyUI& msg);

	void InitWindow();

	virtual CDuiString GetSkinFile();

	virtual CDuiString GetSkinFolder();

	virtual LRESULT OnKillFocus(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);

private:
	POINT based_point_;
	ISetTextColor* chat_dialog_;
};

#endif // COLORPICKER_HPP