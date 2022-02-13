import { create } from "react-gstatem";

type StateType = { count: number };

export default create<StateType>({
	/* init state */
	state: { count: 0 }
});
