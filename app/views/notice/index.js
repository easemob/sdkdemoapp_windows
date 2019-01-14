import { Component } from "react";
import { connect } from "react-redux";
import { message } from "antd";
import * as selectors from "@/stores/selectors";
import * as actionCreators from "@/stores/actions";

class Notify extends Component {
	componentDidUpdate(){
		let { notice, clearNotice } = this.props;
		if(notice){
			let { content, level } = notice;
			level === "success"
				? message.success(content, 2, () => clearNotice())
				: message.error(content, 2, () => clearNotice());
		}
	}
	render(){
		return null;
	}
}

const mapStateToProps = (state) => {
	return {
		notice: selectors.getNotice(state)
	};
};

export default connect(mapStateToProps, actionCreators)(Notify);

// 1. 直接调用 message
// 2. 限制单例（不太合理）
// 3. 限制 clear
