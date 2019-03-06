import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link, Redirect } from "react-router-dom";
import { Icon, Badge, Menu, Dropdown } from "antd";
import ROUTES from "../common/routes";
import HeadImageView from "../common/head_image";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import { ipcRenderer } from "electron";

const navbarItems = [
	{ to: ROUTES.chats.recents.__, label: "最近聊天", icon: "contacts" },
	{ to: ROUTES.chats.contacts.__, label: "通讯录", icon: "idcard" },
	{ to: ROUTES.chats.groups.__, label: "群组", icon: "team" },
];



class Navbar extends Component {

	constructor(props){
		super(props);
		const { selectNavAction } = this.props;
		let url = ROUTES.chats.recents.__;
		this.handleClickNav = this.handleClickNav.bind(this);
		navbarItems.forEach((item, index) => {
			console.log(item);
			if(window.location.hash.indexOf(item.to) > -1){
				url = item.to;
			}

		})
		selectNavAction(url);
	}

	handleClickNav(link){
		const { selectNavAction } = this.props;
		// this.setState({ currentLink: link });
		selectNavAction(link);
	}

	render(){
		const {
			allUnReadMsgCount,
			selectNav
		} = this.props;
		/* eslint-disable */
		const NavLink = ({item, allUnReadMsgCount}) => (
			<Route
				path={item.to}
				children={(obj, obj1) => (
					<Link
						className={`block ${ selectNav == item.to ? "selected" : ""}`}
						to={item.to}
						onClick={ (e) => this.handleClickNav(item.to)}
					>
						<Icon type={item.icon} />
						{
							item.to == ROUTES.chats.recents.__
							? <Badge className="nav-unread-count" count={allUnReadMsgCount} />
							: null
						}
					</Link>
				)}
			/>
		);
		return (
			<div className="app-navbar" >
				{ ipcRenderer.send("receive-unread-msg", allUnReadMsgCount) }
				{
					navbarItems.map((item) => {
						return (
							<div key={ item.to } className="hint--right nav-item" title={ item.label }>
								<NavLink item={ item } allUnReadMsgCount={allUnReadMsgCount}/>
							</div>
						);
					})
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allUnReadMsgCount: selectors.allUnReadMsgCount(state),
	userInfo: state.userInfo,
	selectNav: state.selectNav
});
export default connect(mapStateToProps, actionCreators)(Navbar);
