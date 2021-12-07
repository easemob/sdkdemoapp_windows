import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";
import { Avatar } from "antd";
import { ipcRenderer } from "electron";

const defaultAvatar = 'https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png'
class UserCardView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {};
	}
	render(){
		const { msg, bySelf } = this.props;
		let avatar = msg.exts ? msg.exts.avatar : defaultAvatar;
		let nickname = msg.exts && msg.exts.nickname;
		let uid = msg.exts && msg.exts.uid;
		console.log('msg.exts:',msg.exts)
		return (
			<div className="idCard" data={msg.exts} >
                    <div>
                        <Avatar shape="circle" style={{width:'100%', height:'100%'}} src={avatar}></Avatar>
                    </div>
                    <div>{nickname || uid}</div>
                </div>
		);

	}
}
const mapStateToProps = state => ({
	userInfo: state.userInfo,
	globals: state.globals
});
export default connect(mapStateToProps, actionCreators)(UserCardView);
