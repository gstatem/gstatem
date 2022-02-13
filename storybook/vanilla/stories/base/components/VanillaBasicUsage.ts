import Store from "../lib/VanillaStore";
const { get, set, subscribe, unsubscribe } = Store;

console.log(get(({ count }) => count)); // count is 0

set(({ count }) => ({ count: count + 1 }));
console.log(get(({ count }) => count)); // count is 1

/* prints updated count */
const subscribeFn = ({ count }) => console.log("updated count", count);

const unsubscribeFn = subscribe(({ count }) => count, subscribeFn);
/* triggers the subscribe function */
set(({ count }) => ({ count: count + 1 }), { isDispatch: true });

window.onbeforeunload = () => {
	unsubscribe(subscribeFn);
	/* alternative way of unsubscribe */
	unsubscribeFn();
};

export default {};
