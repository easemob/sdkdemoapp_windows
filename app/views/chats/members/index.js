import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Icon } from "antd";
import * as actionCreators from "@/stores/actions";
import MemberSettingView from "./member_setting";
const TabPane = Tabs.TabPane;

// const NavLink = ({ item }) => (
// 	<Menu.Item key={ item.id }> {item.orgName || item.realName} </Menu.Item>
// );

class MemberTabView extends Component {
	constructor(props){
		super(props);
		this.state = {
		};
	}

	render(){
		return (
			<div className="group-tab">
				<Tabs defaultActiveKey="members" size="default" tabBarStyle={ { borderBottom: "1px sold #f6f6f6" } }>
					<TabPane tab={ <Icon type="solution" /> } key="members">
						<MemberSettingView />
					</TabPane>
					{/* <TabPane tab="文件" key="3">Content of tab 3</TabPane> */}
				</Tabs>
				{/* <div>
					<Icon type="menu-unfold" />
				</div> */}
			</div>
		);

	}
}

const mapStateToProps = state => ({
	selectGroup: state.selectGroup,
	globals: state.globals,
	selectConversationId: state.selectConversationId,
	groupsMgr: state.groupsMgr,
	userInfo: state.userInfo
});
export default connect(mapStateToProps, actionCreators)(MemberTabView);
