<template>
	<VueCounter :value="count" :onIncrement="increaseCount" />
	<button @click="doubleIncreaseCount">+2</button>
</template>

<script setup lang="ts">
import VueCounter from "../../base/components/VueCounter.vue";
import {
	useCount,
	increaseCount,
	doubleIncreaseCount
} from "./VueStoreCustomEqual";

const count = useCount();
</script>
