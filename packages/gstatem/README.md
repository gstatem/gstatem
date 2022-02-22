GStatem is a small, simple and fast state-management tool.

## Installation
### npm
```shell
npm i gstatem
```

### yarn
```shell
yarn add gstatem
```

### [Demos](https://gstatem.netlify.app/?path=/docs/vanilla-basic-usage--page)

## Usage

### Create a store

The exported functions can be used anywhere - in component, utils file, event listener, setTimeout, setInterval and promise callbacks.

```typescript jsx
// Store.js
import GStatem, { Subscriber, SetOptions } from "gstatem";

const { get, set, select } = new GStatem({
  /* initial state */
  state: { count: 0 }
});

export const countSelector = state => state.count;

export const getCount = get(countSelector);

/* select count for non function component */
export const selectCount = subscribe =>
  select<number>(countSelector, subscribe);

/* update the store with callback */
export const increaseCount = () =>
  set(state => ({ count: state.count + 1 }), options);
```

### Use without react
```typescript jsx
import {
  increaseCount,
  resetCount,
  getCount,
  selectCount
} from "../lib/VanillaStore";

/* select count */
const [count, unsubCount] = selectCount(state =>
  console.log("updated count", state.count)
);
console.log(count); // count is 0

increaseCount();
console.log(getCount()); // count is 1

/* reset count */
resetCount();
console.log(getCount()); // count is 0

window.onbeforeunload = () => {
  /* unsubscribe count on page unload */
  unsubCount();
};
```