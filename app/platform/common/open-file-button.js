const fileButton = document.getElementById("fileOpenButton");

const showOpenDialog = (acceptExts = "", callback) => {
	if(typeof acceptExts === "function"){
		callback = acceptExts;
		acceptExts = "";
	}

	if(typeof acceptExts === "object"){
		const options = acceptExts;
		const extentions = [];
		if(options && options.filters){
			options.filters.forEach((filter) => {
				if(filter.extensions){
					filter.extensions.forEach((ext) => {
						if(ext && ext !== "*"){
							extentions.push(`.${ext}`);
						}
					});
				}
			});
		}
		acceptExts = extentions.join(",");
	}

	fileButton.accept = acceptExts;
	fileButton.onchange = () => {
		const files = fileButton.files;
		if(files.length){
			callback(files);
			setTimeout(() => {
				fileButton.onchange = null;
				fileButton.value = "";
			}, 500);
		}
		else{
			callback(false);
		}
	};
	fileButton.click();
};

export default {
	showOpenDialog
};
