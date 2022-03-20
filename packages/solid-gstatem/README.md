GStatem is a small, simple and fast state-management tool.

## Installation
### npm
```shell
npm i solid-gstatem
```

### yarn
```shell
yarn add solid-gstatem
```

### [Demos](https://gstatem.netlify.app/?path=/docs/solid-basic-usage--page)

## Basic usage

**Create a store**

The `increaseCount` function can be used anywhere - in component, utils file, event listener, setTimeout, setInterval and promise callbacks.

```typescript jsx
// Store.js
import * as solid from "solid-js";
import { create } from "solid-gstatem";

const { useSelect, dispatch } = create(solid, {
  /* initial state */
  state: { count: 0 }
});

/* the count accessor for component */
export const useCount = () => useSelect(state => state.count);

/* increase the counter */
export const increaseCount = () =>
  dispatch(state => ({ count: state.count + 1 }));
```

**Use the store in component**
```typescript jsx
import Counter from "./Counter";
import { useCount, increaseCount } from "./Store";

const BasicUsage = () => {
  const count = useCount();

  createEffect(() => console.log("count =", count()));
  
  return (
    <Counter value={count} onIncrement={increaseCount} />
  );
};

export default BasicUsage;
```