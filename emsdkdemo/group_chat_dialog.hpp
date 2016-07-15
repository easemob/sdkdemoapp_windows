#ifndef GroupChatDialog_HPP
#define GroupChatDialog_HPP

#include "chat_dialog.hpp"

class GroupChatDialog : public ChatDialog
{
public:
	GroupChatDialog(const CDuiString& bgimage, DWORD bkcolor, const ListItemInfo& myselft_info, const ListItemInfo& friend_info, std::string conversationID);
	~GroupChatDialog();

	virtual LPCTSTR GetWindowClassName() const;	

	virtual void InitWindow();

	virtual CDuiString GetSkinFile();


	virtual CControlUI* CreateControl(LPCTSTR pstrClass);

	virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);


	virtual BOOL Receive(MessageEventParam param);

    void SendMsg();


protected:	

	void Notify(TNotifyUI& msg);
	void OnPrepare(TNotifyUI& msg);

private:
	void UpdateMemberList();

private:	

	std::vector<ListItemInfo> members_;
};

#endif // GroupChatDialog_HPP