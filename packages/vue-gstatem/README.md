GStatem is a small, simple and fast state-management tool.

## Installation
### npm
```shell
npm i vue-gstatem
```

### yarn
```shell
yarn add vue-gstatem
```

### [Demos](https://gstatem.netlify.app/?path=/docs/solid-basic-usage--page)

## Basic usage

**Create a store**

The `increaseCount` function can be used anywhere - in component, utils file, event listener, setTimeout, setInterval and promise callbacks.

```typescript jsx
// Store.js
import { create } from "vue-gstatem";

type StateType = { count: number };

const initialState = { count: 0 };
const { useSelect, dispatch } = create<StateType>({ state: initialState });

/* the count hook for function component */
export const useCount = () => useSelect<number>(state => state.count);

/* increase the counter */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));
```

**Use the store in component**
```typescript vue3
<template>
  <VueCounter
    :value="count"
    :onIncrement="increaseCount"
  />
</template>

<script setup lang="ts">
import VueCounter from "../../base/components/VueCounter.vue";
import { useCount, increaseCount } from "./VueStore";

const count = useCount();
</script>
```