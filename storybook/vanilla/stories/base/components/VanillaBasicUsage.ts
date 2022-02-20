import {
	increaseCount,
	resetCount,
	getCount,
	selectCount
} from "../lib/VanillaStore";

console.log(getCount()); // count is 0

increaseCount();
console.log(getCount()); // count is 1

/* select count */
const [count, unsubCount] = selectCount(state =>
	console.log("updated count", state.count)
);
console.log(count); // count is 1

/* triggers the subscribe function */
increaseCount({ isDispatch: true });

/* reset count */
resetCount();

window.onbeforeunload = () => {
	/* unsubscribe count on page unload */
	unsubCount();
};
