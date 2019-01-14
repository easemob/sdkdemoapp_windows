import React, { PureComponent } from "react";
import { Menu, Dropdown, Icon } from "antd";
import emoji from "@/views/config/emoji";
// import "./style/ChatEmoji.less";
import _ from "underscore";
const state = {
	emojiPadding: 5,
	emojiWidth: 25,
	lineNum: 10
};

class ChatEmoji extends PureComponent {


	renderEmojiMenu(){
		const { emojiWidth, emojiPadding, lineNum } = state;
		const emojisNum = _.values(emoji.map).length;
		const rows = Math.ceil(emojisNum / lineNum);
		const width = (emojiWidth + 2 * emojiPadding) * lineNum;
		const height = (emojiWidth + 2 * emojiPadding) * rows;

		return (
			<Menu className="x-emoji" style={ { width, height } } { ...this.props }>
				{this.renderEmoji()}
			</Menu>
		);
	}

	renderEmoji(){
		const { emojiWidth, emojiPadding } = state;
		return _.keys(emoji.EMOJI_MAP).map((k) => {
			const v = emoji.EMOJI_MAP[k];
			return (
				<Menu.Item
					key={ k }
					className=""
					style={ {
						width: emojiWidth,
						height: emojiWidth,
						padding: emojiPadding
					} }
				>
					<img
						src={ require(`@/views/config/faces/${v}`) }
						width={ emojiWidth }
						height={ emojiWidth }
					/>
				</Menu.Item>
			);
		});
	}


	render(){
		const menu = this.renderEmojiMenu();
		return (
			<div className="oa-chatbox-emoji">
				<Dropdown overlay={ menu } trigger={ [ "click" ] } placement="topCenter">
					<a className="ant-dropdown-link" href="#">
						<Icon type="smile-o" />
						{/* <i className="iconfont icon-smile" /> */}
					</a>
				</Dropdown>
			</div>
		);
	}
}

export default ChatEmoji;
