<template>
	<div>Store1 <VueCounter :value="count1" :onIncrement="increaseCount1" /></div>
	<div>Store2 <VueCounter :value="count2" :onIncrement="increaseCount2" /></div>
</template>

<script setup lang="ts">
import VueCounter from "../../base/components/VueCounter.vue";
import { useCount1, increaseCount1 } from "./VueMultiStore1";
import { useCount2, increaseCount2 } from "./VueMultiStore2";

const count1 = useCount1();
const count2 = useCount2();
</script>
