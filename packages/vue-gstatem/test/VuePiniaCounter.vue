<template>
	<VueCounter
		:value="counter.count"
		:onIncrement="increaseCount"
		:onReset="resetCount"
	/>
</template>

<script setup lang="ts">
import VueCounter from "../../../storybook/vue/base/components/VueCounter.vue";
import { useCounterStore } from "./VuePiniaStore";

const props = defineProps<{
	customHooks?: VoidFunction;
}>();

if (props.customHooks instanceof Function) {
	props.customHooks();
}

const counter = useCounterStore();
const increaseCount = () => counter.$patch({ count: counter.count + 1 });
const resetCount = () => counter.$patch({ count: 0 });
</script>
