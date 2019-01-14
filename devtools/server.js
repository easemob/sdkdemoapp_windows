/* eslint-disable no-console */
/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */

import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { spawn } from "child_process";

import electronConfig from "./webpack.config.development";

// 获取命令行参数
const argv = require("minimist")(process.argv.slice(2));

// 根据 target 参数使用不同的 webpack 配置
const config = electronConfig;
const app = express();
const compiler = webpack(config);
const PORT = process.env.PORT || 3000;


// 创建 Webpack 开发中间件
const wdm = webpackDevMiddleware(compiler, {
	publicPath: config[0].output.publicPath,
	stats: {
		colors: true
	}
});

// 使用 Webpack 开发中间件
app.use(wdm);

// 使用 Webpack 热更新中间件
app.use(webpackHotMiddleware(compiler));

// 创建一个 Web server
const server = app.listen(PORT, "localhost", (serverError) => {
	if(serverError){
		return console.error(serverError);
	}

	if(argv["start-hot"]){
		spawn("npm", ["run", "start:hot"], { shell: true, env: process.env, stdio: "inherit" })
		.on("close", code => process.exit(code))
		.on("error", spawnError => console.error(spawnError));
	}
});

// 终止服务
process.on("SIGTERM", () => {
	console.log("Stopping dev server");
	wdm.close();
	server.close(() => {
		process.exit(0);
	});
});
