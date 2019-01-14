var fs = require("fs-extra");
var http = require("http");
var https = require("https");

const downLoadFile = (filePath, remotePath) => {
	var imageData;
	var url = http;
	if(remotePath.indexOf("https") >= 0){
		url = https;
	}
	url.get(`${remotePath}`, function(res){
		res.setEncoding("binary");// 二进制（binary）
		imageData = "";
		res.on("data", function(data){// 图片加载到内存变量
			imageData += data;
		}).on("end", function(){// 加载完毕保存图片
			fs.writeFile(`${filePath}`, imageData, "binary", function(err){// 以二进制格式保存
				if(err) throw err;
				// console.log("file saved");
			});
		});
	});
	return remotePath;
};

const localOrRemoteFile = (filePath, remotePath) => {
	if(fs.existsSync(`${filePath}`)){
		return filePath;
	}
	else if(remotePath){
		return downLoadFile(filePath, remotePath);
	}
};



export default{
	localOrRemoteFile,
	downLoadFile
};
