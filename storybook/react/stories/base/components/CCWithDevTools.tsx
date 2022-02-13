import React from "react";
import { GSC } from "react-gstatem";
import Store, { StateType } from "../lib/CCStoreWithDevTools";
import Counter from "../../../base/components/Counter";

type Props = object;

class CCWithDevTools extends GSC<Props, StateType> {
	state = { count: Store.get(({ count }) => count) };

	constructor(props) {
		super(props);
		this.state = {
			count: this.select(
				/* selector */
				({ count }) => count,
				/* subscriber */
				({ count }) => this.setState({ count }),
				Store
			)
		};
	}

	increaseCount = () => {
		this.dispatch(({ count }) => ({ count: count + 1 }), Store);
	};

	decreaseCount = () => {
		this.dispatch(({ count }) => ({ count: count - 1 }), Store);
	};

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	render() {
		return (
			<Counter
				value={this.state.count}
				onIncrement={this.increaseCount}
				onDecrement={this.decreaseCount}
			/>
		);
	}
}

export default CCWithDevTools;
