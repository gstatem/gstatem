React GStatem is a small, simple and fast state-management tool.

[![Build](https://github.com/gstatem/gstatem/actions/workflows/build.yml/badge.svg)](https://github.com/gstatem/gstatem/actions/workflows/build.yml)

## Installation
### npm
```shell
npm i react-gstatem
```

### yarn
```shell
yarn add react-gstatem
```

### [Demos](https://gstatem.netlify.app/)

## Basic usage of function component
### Create a store

The `increaseCount` function can be used anywhere - in component, utils file, event handler, setTimeout, setInterval and promise callbacks. 

```typescript jsx
// Store.js
import { create } from "react-gstatem";

const { useSelect, dispatch } = create({
  /* initial state */
  state: { count: 0 }
});

/* the count hook for function component */
export const useCount = () => useSelect<number>(state => state.count);

/* increase the counter */
export const increaseCount = () => dispatch(state => ({ count: state.count + 1 }));
```

### <a name="useincomponent" />Use the store in component
```typescript jsx
import React from "react";
import Counter from "./Counter";
import { useCount, increaseCount } from "./Store";

const BasicUsage = () => {
  const count = useCount();
  return (
    <Counter value={count} onIncrement={increaseCount} />
  );
};

export default BasicUsage;
```