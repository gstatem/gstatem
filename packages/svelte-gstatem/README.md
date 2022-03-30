GStatem is a small, simple and fast state-management tool.

## Installation
### npm
```shell
npm i svelte-gstatem
```

### yarn
```shell
yarn add svelte-gstatem
```

### [Demos](https://gstatem.netlify.app/?path=/docs/svelte-template-basic-usage--basic-usage)

## Basic usage

**Create a store**

The `increaseCount` function can be used anywhere - in component, utils file, event listener, setTimeout, setInterval and promise callbacks.

```typescript jsx
// Store.js
import { create } from "svelte-gstatem";

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
```html
<script lang="ts">
  import SvelteCounter from "./SvelteCounter.svelte";
  import { useCount, increaseCount } from "./SvelteStore";

  const count = useCount();
</script>

<main>
  <SvelteCounter
    value={count}
    onIncrement={increaseCount}
  />
</main>
```