import { createStore } from "vuex";

type State = { count: number };

export const vuexStore = createStore({
	state() {
		return {
			count: 0
		};
	},
	mutations: {
		increment(state: State) {
			state.count += 1;
		},
		reset(state: State) {
			state.count = 0;
		}
	}
});
