import { newStatem } from "react-gstatem";

export type StateType = { count: number };

export default newStatem<StateType>({
	/* init state */
	state: { count: 0 }
});
