import React, { Component } from "react";
import { getCount, increaseCount } from "./CCStoreSilentMode";
import Counter from "../../base/components/Counter";

class CCSilentMode extends Component {
	render() {
		return (
			<>
				<button onClick={() => this.setState({})}>re-render</button>
				<Counter value={getCount()} onIncrement={increaseCount} />
			</>
		);
	}
}

export default CCSilentMode;
