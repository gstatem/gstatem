module.exports = {
	presets: [
		"@babel/preset-typescript",
		"@babel/preset-react",
		"@babel/preset-env",
		[
			"minify",
			{
				builtIns: false
			}
		]
	],
	plugins: [
		[
			"@babel/plugin-transform-runtime",
			{
				helpers: false
			}
		]
	],
	comments: false,
	overrides: [
		{
			test: /^.*\/vue\/.*\.tsx?$/,
			plugins: ["@vue/babel-plugin-jsx"]
		}
	]
};
