import { create } from "react-gstatem";

type State1Type = {
	count2: number;
};

export default create<State1Type>({
	/* init state */
	state: { count2: 0 }
});