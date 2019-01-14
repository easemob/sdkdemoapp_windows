const classes = (...args) => (
	args.map((arg) => {
		if(Array.isArray(arg)){
			return classes(arg);
		}
		else if(arg !== null && typeof arg === "object"){
			return Object.keys(arg).filter((className) => {
				const condition = arg[className];
				if(typeof condition === "function"){
					return !!condition();
				}
				return !!condition;
			}).join(" ");
		}
		return arg;
	}).filter(x => (typeof x === "string") && x.length).join(" ")
);

const rem = (value, rootValue = 20) => (`${value / rootValue}rem`);

const getSearchParam = (key, search = null) => {
	const params = {};
	search = search === null ? window.location.search : search;
	if(search.length > 1){
		if(search[0] === "?"){
			search = search.substr(1);
		}
		const searchArr = search.split("&");
		for(const pair of searchArr){
			const pairValues = pair.split("=", 2);
			if(pairValues.length > 1){
				params[pairValues[0]] = decodeURIComponent(pairValues[1]);
			}
			else{
				params[pairValues[0]] = "";
			}
		}
	}
	return key ? params[key] : params;
};

const strip = (html) => {
	if(typeof document !== "undefined"){
		const tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}
	return html.replace(/<(?:.|\n)*?>/gm, "");
};

export default {
	classes,
	rem,
	getSearchParam,
	strip
};
