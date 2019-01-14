import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";
import { Icon } from "antd";
import { ipcRenderer } from "electron";

class FileView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			downloadStatus: false,
			progress: null
		};
		this.handleSearch = this.handleSearch.bind(this);
		this.handleDownload = this.handleDownload.bind(this);
	}

	handleSearch(){
		const { msg } = this.props;
		ipcRenderer.send("open-file", msg.localPath);
	}
	handleDownload(){
		const { globals, item } = this.props;
		var me = this;
		var emCallback = globals.emCallback;
		emCallback.onSuccess = function(){
			console.log("emCallback call back success");
			me.setState({ downloadStatus: true });
			return true;
		};
		emCallback.onFail = function(error){
			console.log("emCallback call back fail");
			console.log(error.description);
			console.log(error.errorCode);
			return true;
		};
		emCallback.onProgress = function(progress){
			console.log(progress);
			console.log("call back progress");
			me.setState({ progress });
			return true;
		};
		item.setCallback(emCallback);
		globals.chatManager.downloadMessageAttachments(item);

	}

	showFileStatus(){
		const { item, userInfo, msg } = this.props;
		// if(userInfo.user.easemobName != item.from()){
		if(this.state.downloadStatus || msg.downloadStatus == 1){
			return (
				<div>
					{
						userInfo.user.easemobName != item.from()
							? <span>已下载</span>
							: null
					}
					<span onClick={ this.handleSearch } className="search-file-direction">
						<Icon type="search" />
					</span>
				</div>
			);
		}
		else if(this.state.progress > 0 && this.state.progress < 100){
			return <span>{ this.state.progress }%</span>;
		}
		return <Icon type="download" onClick={ this.handleDownload } />;
		// }

		// if(item.getProgress() > 0 && item.getProgress() < 100){
		// 	return <span>发送中</span>;
		// }
		// else if(item.getProgress() == 100){
		// 	return <span>已发送</span>;
		// }

		// return null;
	}

	render(){
		const { msg, userInfo } = this.props;
		return (
			<div className="message-res">
				<div className="detail-file">
					<div className="file-icon">
						<Icon type="file" />
					</div>
					<div className="file-info">
						<div className="ellipsis">{ msg.displayName}</div>
						<div>
							{/* <span>{ msg.length }</span> */}
							{/* 0:正在下载， 1:下载成功， 2:下载失败， 3:状态未知。 */}
							{/* <span>{ msg.downloadStatus == 1 ? "已下载" : "" }</span> */}
							{ this.showFileStatus() }


						</div>
					</div>
				</div>
			</div>
		);

	}
}
const mapStateToProps = state => ({
	userInfo: state.userInfo,
	globals: state.globals
});
export default connect(mapStateToProps, actionCreators)(FileView);
