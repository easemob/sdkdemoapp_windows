import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import MenuList from "./contact_list";
import MemberDetailView from "./contact_detail";

class ContactView extends PureComponent {

	render(){
		return (
			<div>
				<MenuList />
				<MemberDetailView { ...this.props } />
			</div>);

	}
}
const mapStateToProps = state => ({
	loginState: state.userInfo
});
export default withRouter(connect(mapStateToProps, actionCreators)(ContactView));
