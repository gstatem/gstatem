import {
	increaseCount,
	resetCount,
	get,
	subscribe,
	unsubscribe
} from "../lib/VanillaStore";

const selector = state => state.count;

console.log(get(selector)); // count is 0

increaseCount();
console.log(get(selector)); // count is 1

/* prints updated count */
const subscribeFn = state => console.log("updated count", state.count);

const unsubscribeFn = subscribe(selector, subscribeFn);
/* triggers the subscribe function */
increaseCount({ isDispatch: true });

/* reset count */
resetCount();

window.onbeforeunload = () => {
	unsubscribe(subscribeFn);
	/* alternative way of unsubscribe */
	unsubscribeFn();
};
