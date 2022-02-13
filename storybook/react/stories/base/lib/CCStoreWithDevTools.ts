import DevTools from "gstatem-devtools";

export type StateType = { count: number };

export default new DevTools<StateType>({
	/* optional, will be shown in devtools */
	id: "cc-store-with-devtools",
	/* init state */
	state: { count: 0 }
});
