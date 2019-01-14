import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";

class LocaltionView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
		};
	}

	render(){
		const { latitude, longitude, address } = this.props;
		return (
			<div>
				[位置]{ address }
			</div>
		);

	}
}
const mapStateToProps = state => ({
});
export default connect(mapStateToProps, actionCreators)(LocaltionView);
