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

## Usage
### Create a store
```typescript jsx
// Store.ts
import GStatem, { Subscriber, SetOptions } from "gstatem";

const { get, set, select } = new GStatem<StateType>({
	state: { count: 0 }
});

export const countSelector = state => state.count;

export const getCount = get(countSelector);

/* select count for non function component */
export const selectCount = (subscribe: Subscriber<StateType>) =>
  select<number>(countSelector, subscribe);

/* update the store with callback */
export const increaseCount = (options?: SetOptions) =>
  set(state => ({ count: state.count + 1 }), options);
```

### Use without react
```typescript jsx
import {
  increaseCount,
  selectCount,
  getCount
} from "./Store";

/* select count */
const [count, unsubCount] = selectCount(state =>
  console.log("updated count", state.count)
);
console.log(count); // count is 0

increaseCount(); // count is 1
console.log(getCount()); // count is 1

window.onbeforeunload = () => {
  /* unsubscribe count on page unload */
  unsubCount();
};
```