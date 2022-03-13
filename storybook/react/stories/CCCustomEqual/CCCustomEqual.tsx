import React, { Component } from "react";
import Counter from "../../base/components/Counter";
import {
	StateType,
	selectCount,
	increaseCount,
	doubleIncreaseCount
} from "./CCStoreCustomEqual";

class CCCustomEqual extends Component<object, StateType> {
	unsubscribes = [];

	constructor(props) {
		super(props);

		/* select the piece in constructor */
		const [count, unsubCount] = selectCount(
			/* subscriber */
			state => this.setState({ count: state.count })
		);
		/* put the unsubscribe function of the selected piece for on component unmount */
		this.unsubscribes.push(unsubCount);

		/* initialize component state with the selected piece */
		this.state = { count };
	}

	componentWillUnmount() {
		/* unsubscribe all pieces on component unmount */
		this.unsubscribes.forEach(unsub => unsub());
	}

	render() {
		return (
			<>
				<Counter value={this.state.count} onIncrement={increaseCount} />
				<button onClick={doubleIncreaseCount}>+2</button>
			</>
		);
	}
}

export default CCCustomEqual;
