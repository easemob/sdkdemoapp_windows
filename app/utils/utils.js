
const utils = {
	latestFunc(){
		var callback;
		return function(cb){
			callback = cb;
			return function(){
				cb === callback && cb.apply(this, arguments);
			};
		};
	},
};

export default{
	utils
};
