The devtools helpers for [gstatem](https://www.npmjs.com/package/gstatem) and [react-gstatem](https://www.npmjs.com/package/react-gstatem).

## Installation
### npm
```shell
npm i gstatem-devtools
```

### yarn
```shell
yarn add gstatem-tools
```

## Usage
Every dispatched piece will be logged in the Chrome extension [GStatem-devtools](https://chrome.google.com/webstore/detail/gstatem-devtools/djohekcenmdagbolgaiiphdnmhgmpllk) if the devtools is installed.
### Create a store with Devtools
```typescript jsx
// Store.ts
import { create } from "react-gstatem";
import DevTools from "gstatem-devtools";

export default create(
  new DevTools({ 
    state: { count: 0 } // init value 
  })
);
```

### Use in component
```typescript jsx
import Store from "./Store";
const { useSelect, dispatch } = Store;

const Counter = () => {
  const count = useSelect(state => state.count);

  return (
    <Counter
      value={count}
      onIncrement={() =>
        dispatch(state => ({ count: state.count + 1 }))
      }
      onDecrement={() =>
        dispatch(state => ({ count: state.count - 1 }))
      }
    />
  );
}

export default Counter;
```