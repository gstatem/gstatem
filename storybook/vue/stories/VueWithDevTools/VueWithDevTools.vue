<template>
	<VueCounter
		:value="count"
		:onIncrement="increaseCount"
		:onReset="resetCount"
	/>
</template>

<script setup lang="ts">
import VueCounter from "../../base/components/VueCounter.vue";
import { useCount, increaseCount, resetCount } from "./VueStoreWithDevTools";

const count = useCount();
</script>
