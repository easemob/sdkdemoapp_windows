import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, withRouter, Switch } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import ROUTES from "../common/routes";
import ContactView from "../chats/contacts";
import ConversationListView from "../chats/conversation";
import GroupsView from "../chats/groups";
import {Icon} from "antd"
import { ipcRenderer } from "electron";
import { setsession } from "../../stores/actions";

const mainViews = [
	{ path: ROUTES.chats.recents.__, view: ConversationListView },
	{ path: ROUTES.chats.contacts.__, view: ContactView },
	{ path: ROUTES.chats.groups.__, view: GroupsView },
];

class Container extends Component {
	constructor(props){
		super(props);
		console.log("container");
		this.state = {
			conId: ""
		};
	}

	sendSyncMsg(conferenceId){
		const { globals, userInfo } = this.props;
		let easemob = globals.easemob;
		let cmdMsgBody = new easemob.EMCmdMessageBody("oa_client_sync");
		console.log("easemobName", userInfo.user.easemobName);
		let cmdMessage = easemob.createSendMessage(userInfo.user.easemobName, userInfo.user.easemobName, cmdMsgBody);
		let snycEvent = {
			event_type: "conferences_accepted",
			conference_id: conferenceId
		};
		cmdMessage.setJsonAttribute(
			"sync_event", JSON.stringify(snycEvent)
		);
		cmdMessage.setAttribute(
			"sync_device", "pc"
		);
		cmdMessage.setChatType(0);
		globals.chatManager.sendMessage(cmdMessage);
	}

	// componentWillMount(props){
	// 	const { userInfo } = this.props;
	// 	if(!userInfo && userInfo.user && userInfo.user.id){
	// 		return <Redirect to="/chats/recents" />;
	// 	}
	// }
	render(){
		return (
			<div className="app-main-container dock">
			<Switch>
				{
					mainViews.map((item) => {
						return (
							<Route
								path={ item.path } key={ item.path } exact={ true }
								render={ () => {
									return <item.view { ...this.props } />;
								} }
							/>);
					})
				}
			</Switch>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	userInfo: state.userInfo,
	globals: state.globals,
	messages: state.messages
});
export default withRouter(connect(mapStateToProps, actionCreators)(Container));
