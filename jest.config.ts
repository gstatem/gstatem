/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	// All imported modules in your tests should be mocked automatically
	// automock: false,

	// Stop running tests after `n` failures
	// bail: 0,

	// The directory where Jest should store its cached dependency information
	// cacheDirectory: "/tmp/jest_rs",

	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: ["gstatem-devtool", "index.[j|t]s"],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: "v8",

	// Run tests from one or more projects
	projects: [
		"<rootDir>/packages/gstatem",
		"<rootDir>/packages/react-gstatem",
		"<rootDir>/packages/solid-gstatem"
	]
};
