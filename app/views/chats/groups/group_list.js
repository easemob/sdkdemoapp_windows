import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import { withRouter, Route, Link, NavLink } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import _ from "underscore";
import HeadImageView from "@/views/common/head_image";
const SubMenu = Menu.SubMenu;

// const NavLink = ({ item }) => (
// 	<Menu.Item key={ item.id }> {item.orgName || item.realName} </Menu.Item>
// );

class GroupList extends Component {
	constructor(props){
		super(props);
		this.state = {
			openKeys: [],
			currentMenuId: 0
		};
		this.handleClick = this.handleClick.bind(this);
		// this.handleOpenChange = this.handleOpenChange.bind(this);
	}

	handleClick(e){
		const { selectOfGroup } = this.props;
		selectOfGroup({
			"easemobGroupId":e.key
		});
	}

	render(){
		const {
			selectGroup,
			networkConnection,
			allGroupChats,
			globals
		} = this.props;
		let arrGroupChats = allGroupChats.allGroups;
		return (
			<div className="oa-main-list oa-conversation-list">
				{
					networkConnection
						? <div className="network-state">网络连接已断开</div>
						: null
				}
				<Menu
					onClick={ this.handleClick }
					onOpenChange={ this.handleOpenChange }
					style={ { width: 300, border: "none" } }
					selectedKeys={ selectGroup.easemobGroupId ? [selectGroup.easemobGroupId] : [] }
					mode="inline"
				>
					{
						arrGroupChats.map((groupId) => {
							var groupManager = globals.groupManager;
							var group = groupManager.groupWithId(groupId);
							return (
								<Menu.Item key={ group.groupId() }>
									<HeadImageView
										name={ group.groupSubject() }
									/>
									<div className="item-top">
										<span className="ellipsis item-name">
											{ group.groupSubject() }
										</span>
									</div>
								</Menu.Item>);
						})
					}
				</Menu>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectGroup: state.selectGroup,
	networkConnection: state.networkConnection,
	allGroupChats: state.allGroupChats,
	globals: state.globals
});
export default withRouter(connect(mapStateToProps, actionCreators)(GroupList));
