/**
 * Base webpack config used across other specific configs
 */
import path from "path";
import merge from "webpack-merge";
import { dependencies as externals } from "../app/package.json";

module.exports = merge([{

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: ["babel-loader"],
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				use: "json-loader"
			}
		],
		noParse: [/ajv/]
	},

	output: {
		path: path.resolve(__dirname, "../app/__build__"),
		filename: "bundle.js",
	},

	// https://webpack.github.io/docs/configuration.html#resolve
	resolve: {
		extensions: [".js", ".jsx", ".json"],
		// packageMains: ["webpack", "browser", "web", "browserify", ["jam", "main"], "main"],
		alias: {
			Platform: "platform/electron",
			Config: "config/index.js",
			ExtsRuntime: "exts/runtime.js",
			ExtsView: "views/exts/index.js",
			"@": path.resolve(__dirname, "../app/")
		},
		// root: path.join(__dirname, "../app")
	},

	plugins: [],

	externals: Object.keys(externals || {})
}]);
