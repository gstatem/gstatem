import {
	increaseCount,
	resetCount,
	getCount,
	selectCount
} from "../lib/VanillaStore";

/* select count */
const [count, unsubCount] = selectCount(state =>
	console.log("updated count", state.count)
);
console.log(count); // count is 0

increaseCount();
console.log(getCount()); // count is 1

/* reset count */
resetCount();
console.log(getCount()); // count is 0

window.onbeforeunload = () => {
	/* unsubscribe count on page unload */
	unsubCount();
};
