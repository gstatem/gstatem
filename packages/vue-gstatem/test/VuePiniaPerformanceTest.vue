<template>
	<VuePiniaCounter
		:key="n"
		v-for="n in numOfComponents"
		:customHooks="customHooks"
	/>
</template>

<script setup lang="ts">
import VuePiniaCounter from "./VuePiniaCounter.vue";
import { useCounterStore } from "./VuePiniaStore";

const props = defineProps<{
	numOfComponents: number;
	numOfSelectorForEach: number;
}>();

const customHooks = () => {
	for (let i = 0; i < props.numOfSelectorForEach; i++) {
		useCounterStore();
	}
};
</script>
