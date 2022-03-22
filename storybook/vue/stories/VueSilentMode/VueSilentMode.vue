<template>
	<button @click="this.$forceUpdate">force update</button>
	<!--suppress RequiredAttributes -->
	<VueCounter :value="getCount()" :onIncrement="increaseCount" />
</template>

<script setup lang="ts">
import VueCounter from "../../base/components/VueCounter.vue";
// @ts-ignore
import { getCount, increaseCount } from "./VueStoreSilentMode";
</script>
