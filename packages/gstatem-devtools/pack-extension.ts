const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const { version: manifestVersion } = require("./extension/manifest.json");
const outputDir = "./dist";

const packedFilename = `gstatem-devtools-extension-${manifestVersion}.zip`;
const relativeOutputFilePath = path.join(outputDir, packedFilename);
const outputFilePath = path.resolve(relativeOutputFilePath);

fs.mkdirSync(outputDir, { recursive: true });

if (fs.existsSync(outputFilePath)) {
	fs.rmSync(outputFilePath);
}

const output = fs.createWriteStream(outputFilePath);
const archive = archiver("zip");

output.on("close", function () {
	console.log(`\nTotal ${archive.pointer()} bytes.`);
	console.log(`Packed and saved to ${outputFilePath}`);
	fs.writeFileSync(
		"./.extension_filepath",
		`EXTENSION_FILENAME=${packedFilename}\nEXTENSION_FILEPATH=${relativeOutputFilePath}`,
		{
			encoding: "utf-8"
		}
	);
});

archive.on("error", function (err) {
	throw err;
});

archive.pipe(output);
archive.directory(path.resolve("./extension"), false);

archive.finalize();
