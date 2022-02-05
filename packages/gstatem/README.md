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
import GStatem from "gstatem";

export default new GStatem({
  state: { count: 0 } // init value
});
```

### Use without react
```typescript jsx
import Store from "./Store";
const { get, set, subscribe, unsubscribe } = Store;

console.log(get(({ count }) => count)); // count is 0

set(({ count }) => ({ count: count + 1 }));
console.log(get(({ count }) => count)); // count is 1

// prints updated count
const subscribeFn = ({ count }) => console.log("updated count", count);

subscribe(
  ({ count }) => count,
  subscribeFn
);
set(({ count }) => ({ count: count + 1 }), { isDispatch: true }); // triggers the subscribe function

window.onbeforeunload = () => unsubscribe(subscribeFn);
```