import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu,Input,Button } from "antd";
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
		this.addContact = this.addContact.bind(this);
		this.onIdChange = this.onIdChange.bind(this);
	}
	addContact(e){
		const {
			globals
		} = this.props;
		let contactManager = globals.contactManager;
		let error = new globals.easemob.EMError();
		contactManager.inviteContact(this.state.chatName,"welcome",error);
	}
	onIdChange(event){
		this.setState({
			chatName: $.trim(event.target.value),
		});
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
			requestMembersOfOrg,
			keyOfCurrentOpenMenu,
			memberOfSelect,
			hashOrgAndMember,
			orgTree,
			userInfo
		} = this.props;
		const tenantId = userInfo ? userInfo.user.tenantId : 9;
		this.setState({ currentMenuId: key });
		memberOfSelect({"easemobName":key});
	}

	handleOpenChange(keys){
		const { keysOfOpenMenu } = this.props;
		keysOfOpenMenu(keys);
	}

	render(){
		const {
			openMenuKeys,
			selectMember,
			networkConnection,
			allContacts
		} = this.props;
		var arrContacs = allContacts.contacts;
		console.log("arrContacs:" + allContacts.contacts);

		return (
			<div className="oa-main-list">
				{
					networkConnection
						? <div className="network-state">网络连接已断开</div>
						: null
				}
				<div className="groupname">
						<Input title="好友用户ID" onChange={(event) => {this.onIdChange(event)}}></Input>
				</div>
				<Button type="primary" onClick={ this.addContact }>添加好友</Button>
				<Menu
					onClick={ this.handleClick }
					onOpenChange={ this.handleOpenChange }
					style={ { width: 300, border: "none" } }
					openKeys={ openMenuKeys }
					selectedKeys={ selectMember ? [`${selectMember.easemobName}`, `${selectMember.username}`] : [] }
					mode="inline"
				>
					{
						arrContacs.map( (contact) => {
							return <Menu.Item key={contact}>{contact}</Menu.Item>
						})
					}
				</Menu>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	hashOrgAndMember: state.hashOrgAndMember,
	openMenuKeys: state.openMenuKeys,
	selectMember: state.selectMember,
	userInfo: state.userInfo,
	allContacts: state.allContacts,
	globals: state.globals
});
export default withRouter(connect(mapStateToProps, actionCreators)(MenuList));
