import { create } from "react-gstatem";
import DevTools from "gstatem-devtools";

export type State3Props = { count: number };

export default create<State3Props>(
	new DevTools<State3Props>({
		id: "State3",
		state: {
			count: 12
		},
		DevTools
	})
);
