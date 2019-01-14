import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Icon } from "antd";
import * as actionCreators from "@/stores/actions";
import GroupMembersView from "./group_members";
import GroupSettingView from "./group_setting";
const TabPane = Tabs.TabPane;


class GroupTabView extends Component {
	constructor(props){
		super(props);
		this.state = {
		};
	}

	render(){
		const { selectConversationId } = this.props;
		return (
			<div className="group-tab" key={ selectConversationId }>
				<Tabs
					defaultActiveKey="members"
					size="default"
					tabBarStyle={ { borderBottom: "1px sold #f6f6f6" } }
				>
					<TabPane tab={ <Icon type="solution" /> } key="members">
						<GroupMembersView />
					</TabPane>
					<TabPane tab={ <Icon type="setting" /> } key="setting">
						<GroupSettingView />
					</TabPane>
				</Tabs>
				{/* <div><Icon type="user" /></div> */}
			</div>
		);

	}
}

const mapStateToProps = state => ({
	selectConversationId: state.selectConversationId
});
export default connect(mapStateToProps, actionCreators)(GroupTabView);
