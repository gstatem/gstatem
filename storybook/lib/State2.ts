import { create } from "react-gstatem";
import DevTools from "gstatem-devtools";

export type State2Props = { count2: number; ab: { pp?: number } };

export default create<State2Props>(
	new DevTools({
		id: "State2",
		state: {
			count2: 19,
			ab: {
				pp: 1.5
			}
		}
	})
);
