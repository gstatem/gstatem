import GStatem from "gstatem";

export type StateType = { count: number };

export default new GStatem<StateType>({
	/* init state */
	state: { count: 0 }
});
