<script lang="ts">
  import SvelteCounter from "../../base/components/SvelteCounter.svelte"

  let count = 0
  const onIncrement = () => count++
</script>

<SvelteCounter value={count} onIncrement={onIncrement} />

<!--<template>-->
<!--	<VueCounter-->
<!--		:value="count"-->
<!--		:onIncrement="increaseCount"-->
<!--		:onReset="resetCount"-->
<!--	/>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import VueCounter from "../../base/components/VueCounter.vue";-->
<!--import { useCount, increaseCount, resetCount } from "./VueStore";-->

<!--const count = useCount();-->
<!--</script>-->
