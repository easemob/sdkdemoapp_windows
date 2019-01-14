export default (path, originView) => {
	return global.replaceViews && global.replaceViews[path] || originView;
};
