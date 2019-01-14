import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";

class VideoView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
		};
	}

	render(){
		const { localPath, thumbUrl } = this.props;
		return (
			<div className="message-res">
				<video
					src={ localPath }
					controls="controls"
					preload="preload"
					width="220"
					height="auto"
					poster={ thumbUrl }
				></video>
			</div>);

	}
}
const mapStateToProps = state => ({
});
export default connect(mapStateToProps, actionCreators)(VideoView);
