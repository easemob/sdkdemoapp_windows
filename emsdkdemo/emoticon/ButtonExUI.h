#pragma once

namespace DuiLib {

class CButtonExUI : public CButtonUI
{
public:
	CButtonExUI(void);

	LPCTSTR GetClass() const;
	LPVOID GetInterface(LPCTSTR pstrName);

	LPCTSTR GetIconImage();
	void SetIconImage(LPCTSTR pStrImage);

	void SetAttribute(LPCTSTR pstrName, LPCTSTR pstrValue);

	void PaintStatusImage(HDC hDC);

protected:
	CDuiString m_strIconImage;
};

} // namespace DuiLib