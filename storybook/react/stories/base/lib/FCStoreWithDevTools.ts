import { create } from "react-gstatem";
import DevTools from "gstatem-devtools";

type StateType = { count: number };

export default create<StateType>(
	new DevTools({
		/* optional, will be shown in devtools */
		id: "fc-store-with-devtools",
		/* init state */
		state: { count: 0 }
	})
);
