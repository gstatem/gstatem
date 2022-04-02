<template>
	<VueVuexCounter
		:key="n"
		v-for="n in numOfComponents"
		:customHooks="customHooks"
	/>
</template>

<script setup lang="ts">
import VueVuexCounter from "./VueVuexCounter.vue";
import { vuexStore } from "./VueVuexStore";

const props = defineProps<{
	numOfComponents: number;
	numOfSelectorForEach: number;
}>();

const customHooks = () => {
	const counts = [];
	for (let i = 0; i < props.numOfSelectorForEach; i++) {
		counts.push(vuexStore.state.count);
	}
};
</script>
