import React, { FunctionComponent, SyntheticEvent } from "react";
import { Statems } from "../utils/Types";

type StatemSelectionProps = {
	statems: Statems;
	onChange: (event: SyntheticEvent) => void;
};

const StatemSelection: FunctionComponent<StatemSelectionProps> = ({
	statems,
	onChange
}) => {
	const options = [];
	let isShowRedDot = false;
	for (const statemId in statems) {
		const { steps } = statems[statemId];
		let hasUnread = false;
		for (const { isRead } of steps) {
			if (!isRead) {
				hasUnread = true;
				break;
			}
		}

		if (!isShowRedDot && hasUnread) {
			isShowRedDot = true;
		}
		options.push(
			<option
				key={statemId}
				value={statemId}
				className={hasUnread ? "statem-has-unread" : undefined}
			>
				{statemId}
			</option>
		);
	}

	return (
		<div
			className="statem-select-container"
			title={isShowRedDot ? "Has unread statem" : undefined}
		>
			<select className="statem-select" onChange={onChange}>
				{options}
			</select>
			{isShowRedDot && <span className="red-dot" />}
		</div>
	);
};

export default StatemSelection;
