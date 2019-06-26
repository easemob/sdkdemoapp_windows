import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";
import { Icon } from "antd";
import _ from "underscore";

class Video1v1View extends PureComponent {
	constructor(props){
        super(props);
        this.handleAnwser = this.handleAnwser.bind(this);
		this.handleHangup = this.handleHangup.bind(this);
		this.handlePauseOrResume = this.handlePauseOrResume.bind(this);
		this.showAnswerControl = this.showAnswerControl.bind(this);
		this.showPauseControl = this.showPauseControl.bind(this);
		this.showUserInfo = this.showUserInfo.bind(this);
        this.changeLocation = this.changeLocation.bind(this);
    }
    componentDidMount() {
		const {addvideocontrol,video1v1} = this.props;
		this.videoandaudio = document.getElementById('videoandaudio');
		this.videocontrol = document.getElementById('localVideo');
		this.remotevideocontrol = document.getElementById('remoteVideo');
        addvideocontrol({localvideocontrol:this.videocontrol,remotevideocontrol:this.remotevideocontrol})
        this.videoandaudio.style.backgroundColor = '#ccc';
	  }
	componentDidUpdate(){
		const {video1v1} = this.props;
		if(video1v1.callsession)
		{
			this.videoandaudio.style.display = 'block';
		}else{
			this.videoandaudio.style.display = 'none';
		}
	}

    handleAnwser(){
		const {video1v1,globals} = this.props;
		video1v1.callsession && globals.callManager.asyncAnswerCall(video1v1.callsession.getCallId());
	}
	handleHangup(){
		const {video1v1,globals} = this.props;
		let endReason = 0;
		if(!this.isStartCall()){
			endReason = 2;
		}
		console.log("endReason:" + endReason);
		video1v1.callsession && globals.callManager.asyncEndCall(video1v1.callsession.getCallId(),endReason);
	}
	handlePauseOrResume(){
		const {video1v1,setsession} = this.props;
		let ic = document.getElementById('pauseorresume');
		if(video1v1.callsession)
		{
			if(video1v1.callsession.getType() == 0){
			// 音频
			if(video1v1.pause)
			{
				video1v1.callsession.update(1);
				setsession({pause:false});
			}else{
				video1v1.callsession.update(0);
				setsession({pause:true});
			}
		}else{
			// 视频
			if(video1v1.pause)
			{
				video1v1.callsession.update(3);
				setsession({pause:false});
			}else{
				video1v1.callsession.update(2);
				setsession({pause:true});
			}
		}
	}
		
	}
	showAnswerControl(){
		const {video1v1} = this.props;
		if(video1v1.callsession && !video1v1.callsession.getIsCaller() && !this.isStartCall())
		{
			return <span onClick={ this.handleAnwser }><Icon type="phone" title='接听' className='videoandaudio-answer' /></span>;
		}else
		{
			return null;
		}
	}
	showPauseControl(){
		const {video1v1} = this.props;
		if(video1v1.callsession && this.isStartCall())
		{
			return <span onClick={ this.handlePauseOrResume }><Icon id="pauseorresume" title='暂停/继续' type={video1v1.pause?"play-circle":"pause-circle"} className='videoandaudio-pauseorresume' /></span>;
		}else
		{
			return null;
		}
    }
	showUserInfo(){
		const {video1v1} = this.props;
		if(video1v1.callsession && !this.isStartCall())
		{
            if(!video1v1.callsession.getIsCaller())
			{
                return <span className='videoandaudio-userinfo' >收到来自{video1v1.callsession.getRemoteName()}的{video1v1.callsession.getType()?"视频":"音频"}会话邀请，是否接听</span>;
            }else{
                return <span className='videoandaudio-userinfo' >正在邀请{video1v1.callsession.getRemoteName()}进行{video1v1.callsession.getType()?"视频":"音频"}会话，请等待</span>;
            }
		}else
		{
			return null;
		}
    }
	changeLocation(){
		const {video1v1} = this.props;
		if(video1v1.callsession && video1v1.localStream && video1v1.remoteStream && video1v1.callsession.getType() == 1)
		{
			let localVideoCss = this.videocontrol.className;
			let remoteVideoCss = this.remotevideocontrol.className;
			this.remotevideocontrol.className = localVideoCss;
			this.videocontrol.className = remoteVideoCss;
		}
    }
	isStartCall(){
		if(this.videocontrol && this.videocontrol.srcObject && this.videocontrol.srcObject.active &&
			 this.remotevideocontrol && this.remotevideocontrol.srcObject && this.remotevideocontrol.srcObject.active)
		  return true;
		return false;
	}
	render(){
		return (
			<div id="videoandaudio" className='videoandaudio'>
			{
				<video onClick={this.changeLocation} id="localVideo" className='videoandaudio-localvideo' muted autoPlay={true} controls={false}></video>
			}
			{
				<video onClick={this.changeLocation} id="remoteVideo" className='videoandaudio-remotevideo' autoPlay={true} controls={true}></video>
			}
            {this.showUserInfo()}
			{this.showAnswerControl()}
			<span onClick={ this.handleHangup }><Icon type="phone" title='挂断' className='videoandaudio-hangup' /></span>
			{this.showPauseControl()}
			</div>
		);

	}
}

const mapStateToProps = state => ({
	globals: state.globals,
    userInfo: state.userInfo,
    video1v1: state.video1v1
});
export default connect(mapStateToProps, actionCreators)(Video1v1View);
