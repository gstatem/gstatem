/**
 * Created by shuieryin on 30. Oct 2021 12:20 PM.
 */

chrome.devtools.panels.create(
	"GStatem",
	"images/get_started32.png",
	"./dist/app/index.html",
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	() => {}
);
