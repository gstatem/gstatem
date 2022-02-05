import { create } from "react-gstatem";
import DevTools from "gstatem-devtools";

export type State1Props = {
	count1: number;
	cd: {
		ef?: number;
		jk?: { po?: string };
	};
};

export default create<State1Props>(
	new DevTools<State1Props>({
		id: "State1",
		state: {
			count1: 15,
			cd: {
				ef: 15,
				jk: {
					po: "This is some very long text This is some very long text This is some very long text."
				}
			}
		}
	})
);
