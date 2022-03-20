import { create } from "./";
// import { fireEvent, screen } from "@testing-library/vue";
// import VueCounter from "../../../storybook/vue/base/components/VueCounter.vue";

type StateType = { count: number };

const initialState = { count: 0 };
const { dispatch, get } = create<StateType>({ state: initialState });

const getCount = () => get<number>(state => state.count);

const increaseCount = () => dispatch(state => ({ count: state.count + 1 }));

describe("VueGStatem tests", () => {
	// TODO: not able to run @testing-library/vue with jest
	// it.skip("renders counter component", () => {
	// 	// render(() => <VueCounter />);
	// 	expect(screen.getByText("Clicked: 0 times")).toBeDefined();
	//
	// 	const incrementButton = screen.getByRole("button", { name: "+" });
	// 	fireEvent.click(incrementButton);
	// 	expect(screen.getByText("Clicked: 1 times")).toBeDefined();
	// 	// expect(get(countSelector)).toBe(1);
	//
	// 	const resetButton = screen.getByRole("button", { name: "Reset" });
	// 	fireEvent.click(resetButton);
	// 	expect(screen.getByText("Clicked: 0 times")).toBeDefined();
	// });

	it("Test store", () => {
		increaseCount();
		expect(getCount()).toBe(1);
	});
});
