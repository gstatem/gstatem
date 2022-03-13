import React, { Component } from "react";
import Counter from "../../../base/components/Counter";
import {
	State1Type,
	selectCount1,
	increaseCount1
} from "../stores/CCMultiStore1";
import {
	State2Type,
	increaseCount2,
	selectCount2
} from "../stores/CCMultiStore2";

class CCBasicUsage extends Component<object, State1Type & State2Type> {
	unsubscribes = [];

	constructor(props) {
		super(props);

		/* select the count1 in constructor */
		const [count1, unsubCount1] = selectCount1(
			/* subscriber */
			state => this.setState({ count1: state.count1 })
		);
		/* put the unsubscribe function of the selected piece for on component unmount */
		this.unsubscribes.push(unsubCount1);

		/* select the count2 in constructor */
		const [count2, unsubCount2] = selectCount2(
			/* subscriber */
			state => this.setState({ count2: state.count2 })
		);
		/* put the unsubscribe function of the selected piece for on component unmount */
		this.unsubscribes.push(unsubCount2);

		/* initialize component state with the selected piece */
		this.state = { count1, count2 };
	}

	componentWillUnmount() {
		/* unsubscribe all pieces on component unmount */
		this.unsubscribes.forEach(unsub => unsub());
	}

	render() {
		const { count1, count2 } = this.state;
		return (
			<>
				Store1 <Counter value={count1} onIncrement={increaseCount1} />
				Store2 <Counter value={count2} onIncrement={increaseCount2} />
			</>
		);
	}
}

export default CCBasicUsage;
