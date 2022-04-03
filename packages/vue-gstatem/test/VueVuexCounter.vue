<template>
	<VueCounter
		:value="vuexStore.state.count"
		:onIncrement="increaseCount"
		:onReset="resetCount"
	/>
</template>

<script setup lang="ts">
import VueCounter from "../../../storybook/vue/base/components/VueCounter.vue";
import { vuexStore } from "./VueVuexStore";

const props = defineProps<{
	customHooks?: VoidFunction;
}>();

if (props.customHooks instanceof Function) {
	props.customHooks();
}

const increaseCount = () => vuexStore.commit("increment");
const resetCount = () => vuexStore.commit("reset");
</script>
