import React, { Component } from "react";
import LoginView from "../login";
import MainView from "../main";
// import clientStorage from "@/common/client_storage";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/actions";
import Notify from "../notice";
import { ipcRenderer } from "electron";
import { Icon } from "antd";
import UpdateView from "../update";
const IS_MAC_OSX = process.platform === "darwin";

class AppView extends Component {

	constructor(props){
		super(props);
		this.handleOrignalWindow = this.handleOrignalWindow.bind(this);
		this.handleMaxedWindow = this.handleMaxedWindow.bind(this);

		this.state = {
			maximization: false,
		};
	}

	handleOrignalWindow(){
		ipcRenderer.send("orignal-window");
		this.setState({ maximization: false });
	}
	handleMaxedWindow(){
		ipcRenderer.send("maximization-window");
		this.setState({ maximization: true });
	}

	render(){
		const { userInfo } = this.props;
		return (
			<div className="oa-main-index">
				<Notify />
				<UpdateView />
				{/* 设置无边框后 windows 无最大化最小化关闭按钮，需要单独设置下 */}
				{/* {
					IS_MAC_OSX
						? null
						: <div className="main-operate-button">
							<span onClick={ (e) => {ipcRenderer.send("close-window"); } } style={ { background: "#ed6a5f" } }>
								<Icon type="close" />
							</span>
							<span onClick={ (e) => {ipcRenderer.send("minimize-window"); } } style={ { background: "#f6c351" } }>
								<Icon type="minus" />
							</span>
							{
								this.state.maximization
									? <span onClick={ this.handleOrignalWindow } style={ { background: "#63c751" } }><Icon type="shrink" /></span>
									: <span onClick={ this.handleMaxedWindow } style={ { background: "#63c751" } }><Icon type="arrows-alt" /></span>
							}
						</div>
				} */}

				{
					userInfo && userInfo.user && userInfo.user.id
						? <MainView  className="dock "></MainView>
						: <LoginView></LoginView>
					// <MainView  className="dock "></MainView>
				}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	userInfo: state.userInfo
});
export default connect(mapStateToProps, actionCreators)(AppView);
