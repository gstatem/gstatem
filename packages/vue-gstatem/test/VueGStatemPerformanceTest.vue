<template>
	<VueGStatemCounter
		:key="n"
		v-for="n in numOfComponents"
		:customHooks="customHooks"
	/>
</template>

<script setup lang="ts">
import VueGStatemCounter from "./VueGStatemCounter.vue";
import { useSelect, countSelector } from "./VueGStatemStore";

const props = defineProps<{
	numOfComponents: number;
	numOfSelectorForEach: number;
}>();

const customHooks = () => {
	for (let i = 0; i < props.numOfSelectorForEach; i++) {
		useSelect(countSelector);
	}
};
</script>
