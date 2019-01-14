import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import GroupList from "./group_list";
import GroupDetailView from "./group_detail";

class GroupView extends PureComponent {

	render(){
		return (
			<div>
				<GroupList />
				<GroupDetailView { ...this.props } />
			</div>
		);

	}
}
const mapStateToProps = state => ({
	loginState: state.userInfo
});
export default withRouter(connect(mapStateToProps, actionCreators)(GroupView));
