import { screen, render, fireEvent } from "@testing-library/vue";
import VueGStatemCounter from "./VueGStatemCounter.vue";
import { getCount, increaseCount, resetCount } from "./VueGStatemStore";
import VueGStatemPerformanceTest from "./VueGStatemPerformanceTest.vue";
import VuePiniaPerformanceTest from "./VuePiniaPerformanceTest.vue";
import VueVuexPerformanceTest from "./VueVuexPerformanceTest.vue";
import { createTestingPinia } from "@pinia/testing";
import { vuexStore } from "./VueVuexStore";

const numOfComponents = 100;
const numOfSelectorForEach = 10;

const performanceTest = async (name, TestComponent, mountOptions) => {
	render(TestComponent, {
		props: {
			numOfComponents,
			numOfSelectorForEach
		},
		...mountOptions
	});

	const t1 = performance.now();
	const incrementButton = screen.getAllByRole("button", { name: `+` })[0];
	await fireEvent.click(incrementButton);
	console.log(
		`${name} - single dispatch to ${numOfComponents} components with ${numOfSelectorForEach} selectors each in single store, took ${
			performance.now() - t1
		} ms.`
	);

	await fireEvent.click(incrementButton);
	const resetButton = screen.getAllByRole("button", { name: "Reset" })[0];
	await fireEvent.click(resetButton);
	expect(screen.getAllByText("Clicked: 0 times")[0]).toBeDefined();
};

describe("VueGStatem tests", () => {
	it("renders counter component", async () => {
		render(VueGStatemCounter);
		expect(screen.getByText("Clicked: 0 times")).toBeDefined();

		const incrementButton = screen.getByRole("button", { name: "+" });
		await fireEvent.click(incrementButton);
		expect(screen.getByText("Clicked: 1 times")).toBeDefined();
		expect(getCount()).toBe(1);

		const resetButton = screen.getByRole("button", { name: "Reset" });
		await fireEvent.click(resetButton);
		expect(screen.getByText("Clicked: 0 times")).toBeDefined();
	});

	it("Test store", () => {
		increaseCount();
		expect(getCount()).toBe(1);
		resetCount();
		expect(getCount()).toBe(0);
	});

	it("Vuex performance test", () => {
		performanceTest("Vuex", VueVuexPerformanceTest, {
			global: {
				plugins: [vuexStore]
			}
		});
	});

	it("Pinia performance test", () => {
		performanceTest("Pinia", VuePiniaPerformanceTest, {
			global: {
				plugins: [createTestingPinia()]
			}
		});
	});

	it("Vue GStatem performance test", () => {
		performanceTest("Vue GStatem", VueGStatemPerformanceTest);
	});
});
