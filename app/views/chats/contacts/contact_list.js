import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import { withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import _ from "underscore";
const SubMenu = Menu.SubMenu;


class MenuList extends Component {
	constructor(props){
		super(props);
		this.state = {
			openKeys: [],
			currentMenuId: 0
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleOpenChange = this.handleOpenChange.bind(this);
	}

	formSubmenusChild(obj){
		let cHtml = <div></div>;
		const { orgTree } = this.props;
		let childArray = orgTree[obj.id] ? orgTree[obj.id].children : [];
		if(obj.children && obj.children.length > 0){
			cHtml = childArray.map((item, i) => {
				return this.formSubmenusChild(item);
			});
			return <SubMenu key={ obj.id } title={ obj.orgName }>{ cHtml }</SubMenu>;
		}
		return <Menu.Item key={ obj.easemobName || obj.username || obj.id }>{ obj.orgName || obj.realName || obj.username } </Menu.Item>;
	}

	handleClick(e){
		const key = e.key;
		const {
			requestChildOrg,
			requestMembersOfOrg,
			keyOfCurrentOpenMenu,
			memberOfSelect,
			hashOrgAndMember,
			orgTree,
			userInfo
		} = this.props;
		const tenantId = userInfo ? userInfo.user.tenantId : 9;
		this.setState({ currentMenuId: key });
		keyOfCurrentOpenMenu(key);
		const selectMemberOrOrg = orgTree[key];
		if(selectMemberOrOrg){
			requestChildOrg(tenantId, key);
			requestMembersOfOrg(tenantId, key);
		}
		else{
			memberOfSelect(hashOrgAndMember[key]);
		}
	}

	handleOpenChange(keys){
		const { keysOfOpenMenu } = this.props;
		keysOfOpenMenu(keys);
	}

	render(){
		const {
			orgTree,
			rootOrgId,
			openMenuKeys,
			selectMember,
			networkConnection
		} = this.props;
		const treeMenu = orgTree[rootOrgId];
		let html =
		treeMenu
			?
			treeMenu.children && treeMenu.children.length > 0
				?
				<SubMenu key={ treeMenu.id } title={ treeMenu.orgName }>
					{
						_.map(treeMenu.children, (obj) => {
							return this.formSubmenusChild(obj);
						})
					}
				</SubMenu>
				: <Menu.Item key={ treeMenu.easemobName || treeMenu.username || treeMenu.id }> { treeMenu.orgName || treeMenu.realName || treeMenu.username } </Menu.Item>
			:
			null;

		return (
			<div className="oa-main-list">
				{
					networkConnection
						? <div className="network-state">网络连接已断开</div>
						: null
				}
				<Menu
					onClick={ this.handleClick }
					onOpenChange={ this.handleOpenChange }
					style={ { width: 300, border: "none" } }
					openKeys={ openMenuKeys }
					selectedKeys={ selectMember ? [`${selectMember.easemobName}`, `${selectMember.username}`] : [] }
					mode="inline"
				>
					{ html }
				</Menu>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	orgTree: state.orgTree,
	rootOrgId: state.rootOrgId,
	hashOrgAndMember: state.hashOrgAndMember,
	openMenuKeys: state.openMenuKeys,
	selectMember: state.selectMember,
	userInfo: state.userInfo
});
export default withRouter(connect(mapStateToProps, actionCreators)(MenuList));
