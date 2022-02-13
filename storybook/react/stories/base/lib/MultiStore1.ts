import { create } from "react-gstatem";

type State1Type = {
	count1: number;
};

export default create<State1Type>({
	/* init state */
	state: { count1: 0 }
});
