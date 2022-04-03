<template>
	<VueCounter
		:value="count"
		:onIncrement="increaseCount"
		:onReset="resetCount"
	/>
</template>

<script setup lang="ts">
import VueCounter from "../../../storybook/vue/base/components/VueCounter.vue";
import { useCount, increaseCount, resetCount } from "./VueGStatemStore";

const props = defineProps<{
	customHooks?: VoidFunction;
}>();

if (props.customHooks instanceof Function) {
	props.customHooks();
}

const count = useCount();
</script>
