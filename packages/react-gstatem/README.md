GStatem is a small, simple and fast state-management tool.

## Installation
### npm
```shell
npm i react-gstatem
```

### yarn
```shell
yarn add react-gstatem
```

## Demo
https://codesandbox.io/s/react-gstatem-with-devtools-ywi2l

## Usage of function component
### Create a store
```typescript jsx
// Store.ts
import { create } from "react-gstatem";

export default create({
  state: { count: 0 } // init value
});
```

### <a name="useincomponent" />Use in component
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

## Usage of class component
### Create a store
```typescript jsx
// Store.ts
import { newStatem } from "react-gstatem";

export default newStatem({
  state: { count: 0 } // init value
});
```

```typescript jsx
import { GSC } from "react-gstatem";
import Store from "./Store";

class Counter extends GSC {
  state = { count: Store.get(({ count }) => count) };
    
  constructor(props) {
    super(props);
    this.state = {
      count: this.select(
        ({ count }) => count, // selector
        ({ count }) => this.setState({ count }), // subscriber
        Store
      )
    };
  }

  increaseCount = () => {
    this.dispatch(({ count }) => ({ count: count + 1 }), Store);
  };

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    return (
      <div>
        Count: {this.state.count}
        <button onClick={this.increaseCount}>Increase count</button>
      </div>
    );
  }
}
```

## With Devtools
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

### [Use in component](#useincomponent)

## Use without react
### Create a store
```typescript jsx
// Store.ts
import GStatem from "gstatem";

export default new GStatem({
  state: { count: 0 } // init value
});
```

### Use in pure javascript
```typescript jsx
import Store from "./Store";
const { get, set, subscribe, unsubscribe } = Store;

console.log(get(({ count }) => count)); // count is 0

set(({ count }) => ({ count: count + 1 }));
console.log(get(({ count }) => count)); // count is 1

// prints updated count;
const subscribeFn = ({ count }) => console.log("updated count", count);

const unsubscribeFn = subscribe(
  ({ count }) => count,
  subscribeFn
);
set(({ count }) => ({ count: count + 1 }), { isDispatch: true }); // triggers the subscribe function

window.onbeforeunload = () => {
  unsubscribe(subscribeFn);
  unsubscribeFn(); // alternative way of unsubscribe
}
```