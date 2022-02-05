import React, { FC, MouseEventHandler, RefObject } from "react";
import { getStepState } from "../utils/Utils";
import { StepPayload } from "../utils/Types";

export type StepViewProps = {
	onMouseDown?: MouseEventHandler<HTMLDivElement>;
	onMouseUp?: MouseEventHandler<HTMLDivElement>;
	onMouseOver?: MouseEventHandler<HTMLDivElement>;
	payload: StepPayload;
	timestamp?: number;
	isFirstItem?: boolean;
	extraCss?: string;
	nodeRef?: RefObject<HTMLDivElement>;
};

const StepView: FC<StepViewProps> = ({
	onMouseDown,
	onMouseUp,
	onMouseOver,
	payload,
	timestamp,
	isFirstItem,
	extraCss,
	nodeRef
}) => {
	let timeStr;
	if (isFirstItem) {
		const curTime = new Date(timestamp);
		timeStr = `${curTime.getHours().toString().padStart(2, "0")}:${curTime
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${curTime
			.getSeconds()
			.toString()
			.padStart(2, "0")}.${curTime
			.getMilliseconds()
			.toString()
			.padStart(3, "0")}`;
	} else {
		const diff = timestamp;
		const diffMinutes = Math.floor(diff / (60 * 1000));
		const diffSeconds = Math.floor((diff % (60 * 1000)) / 1000);
		const diffMilliSeconds = diff % 1000;
		timeStr = `+${diffMinutes.toString().padStart(2, "0")}:${diffSeconds
			.toString()
			.padStart(2, "0")}.${diffMilliSeconds.toString().padStart(3, "0")}`;
	}

	const content = JSON.stringify(getStepState(payload));

	return (
		<div
			ref={nodeRef}
			className={`step-box${extraCss}`}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseOver={onMouseOver}
			title={content}
			tabIndex={0}
		>
			<div className="step-box__background" />
			<div className="step-box__body">
				<span className="step-timestamp">{timeStr}</span>
				<span className="step-content">{content}</span>
			</div>
		</div>
	);
};

StepView.defaultProps = {
	onMouseDown: e => e,
	onMouseUp: e => e,
	onMouseOver: e => e,
	isFirstItem: false,
	extraCss: ""
};

export default StepView;
