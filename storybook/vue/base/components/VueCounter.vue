<template>
	<div>
		<span>Clicked: {{ value }} times</span>&nbsp;
		<button @click="onIncrement">+</button>&nbsp;
		<button v-if="isShowReset" @click="onReset">Reset</button>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	value: number;
	onIncrement: () => void;
	onReset?: () => void;
}>();

const isShowReset = props.onReset instanceof Function;
</script>
