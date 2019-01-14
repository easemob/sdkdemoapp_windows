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
		const { selectOfGroup, groupChats } = this.props;
		selectOfGroup(groupChats[e.key]);
	}

	render(){
		const {
			groupChats,
			selectGroup,
			networkConnection
		} = this.props;
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
						_.map(groupChats, (group) => {
							return (
								<Menu.Item key={ group.easemobGroupId }>
									<HeadImageView
										imgUrl={ group.avatar }
										name={ group.chatName }
									/>
									<div className="item-top">
										<span className="ellipsis item-name">
											{ group.chatName }
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
	groupChats: state.groupChats,
	selectGroup: state.selectGroup,
	networkConnection: state.networkConnection
});
export default withRouter(connect(mapStateToProps, actionCreators)(GroupList));
