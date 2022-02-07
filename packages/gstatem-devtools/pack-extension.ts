const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const { version: manifestVersion } = require("./extension/manifest.json");
const outputDir = "./dist";

const tagName = `gstatem-devtools-extension-${manifestVersion}`;
const packedFilename = `${tagName}.zip`;
const relativeOutputFilePath = path.join(outputDir, packedFilename);
const outputFilePath = path.resolve(relativeOutputFilePath);

fs.mkdirSync(outputDir, { recursive: true });

if (fs.existsSync(outputFilePath)) {
	fs.rmSync(outputFilePath);
}

const output = fs.createWriteStream(outputFilePath);
const archive = archiver("zip", {
	zlib: { level: 9 }
});

output.on("close", function () {
	console.log(`\nTotal ${archive.pointer()} bytes.`);
	console.log(`Packed and saved to ${outputFilePath}`);
	const variables = [
		`TAG_NAME=${tagName}`,
		`EXTENSION_FILENAME=${packedFilename}`,
		`EXTENSION_FILEPATH=${outputFilePath}`
	];
	fs.writeFileSync("./.extension_info_vars", variables.join("\n"), {
		encoding: "utf-8"
	});
});

archive.on("error", function (err) {
	throw err;
});

archive.pipe(output);
archive.directory(path.resolve(path.join(__dirname, "./extension")), false);

archive.finalize();
