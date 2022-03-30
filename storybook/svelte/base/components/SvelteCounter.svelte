<script lang="ts">
  export let value
  export let onIncrement
  export let onReset
</script>

<div>
  <span>Clicked: { value } times</span>
  <button on:click={onIncrement}>+</button>
  {#if onReset}<button on:click={onReset}>Reset</button>{/if}
</div>