#include "StdAfx.h"
#include "ButtonExUI.h"

namespace DuiLib {

CButtonExUI::CButtonExUI(void)
{
}

LPCTSTR CButtonExUI::GetClass() const
{
	return _T("ButtonExUI");
}

LPVOID CButtonExUI::GetInterface(LPCTSTR pstrName)
{
	if( _tcscmp(pstrName, _T("ButtonEx")) == 0 ) return static_cast<CButtonExUI*>(this);
	return CButtonUI::GetInterface(pstrName);
}

LPCTSTR CButtonExUI::GetIconImage()
{
	return m_strIconImage;
}

void CButtonExUI::SetIconImage(LPCTSTR pStrImage)
{
	m_strIconImage = pStrImage;
	Invalidate();
}

void CButtonExUI::SetAttribute(LPCTSTR pstrName, LPCTSTR pstrValue)
{
	if( _tcscmp(pstrName, _T("iconimage")) == 0 ) SetIconImage(pstrValue);
	else CButtonUI::SetAttribute(pstrName, pstrValue);
}

void CButtonExUI::PaintStatusImage(HDC hDC)
{
	CButtonUI::PaintStatusImage(hDC);

	RECT rcItem = m_rcItem;

	if( (m_uButtonState & UISTATE_PUSHED) != 0 )
		::OffsetRect(&m_rcItem, 1, 1);

	if( !m_strIconImage.IsEmpty() ) {
		if( !DrawImage(hDC, (LPCTSTR)m_strIconImage) ) 
			m_strIconImage.Empty();
	}

	m_rcItem = rcItem;
}

} // namespace DuiLib