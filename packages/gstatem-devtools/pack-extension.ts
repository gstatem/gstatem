const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const { version: manifestVersion } = require("./extension/manifest.json");
const outputDir = "./dist";

const packedFilename = `gstatem-devtools-extension-${manifestVersion}.zip`;
const outputFilepath = path.resolve(path.join(outputDir, packedFilename));

fs.mkdirSync(outputDir, { recursive: true });

if (fs.existsSync(outputFilepath)) {
	fs.rmSync(outputFilepath);
}

const output = fs.createWriteStream(outputFilepath);
const archive = archiver("zip");

output.on("close", function () {
	console.log(`\nTotal ${archive.pointer()} bytes.`);
	console.log(`Packed and saved to ${outputFilepath}`);
	fs.writeFileSync("./.env", `EXTENSION_FILE=${packedFilename}`, {
		encoding: "utf-8"
	});
});

archive.on("error", function (err) {
	throw err;
});

archive.pipe(output);
archive.directory(path.resolve("./extension"), false);

archive.finalize();
