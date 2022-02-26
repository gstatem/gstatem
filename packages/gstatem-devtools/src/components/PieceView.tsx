import React, { FC, MouseEventHandler, MutableRefObject } from "react";
import { getPiece } from "../utils/Utils";
import { PiecePayload } from "../utils/Types";

export type PieceViewProps = {
	onMouseDown?: MouseEventHandler<HTMLDivElement>;
	onMouseUp?: MouseEventHandler<HTMLDivElement>;
	onMouseOver?: MouseEventHandler<HTMLDivElement>;
	payload: PiecePayload;
	timestamp?: number;
	isFirstItem?: boolean;
	extraCss?: string;
	nodeRef?: MutableRefObject<HTMLDivElement>;
};

const PieceView: FC<PieceViewProps> = ({
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

	const content = JSON.stringify(getPiece(payload));

	return (
		<div
			ref={nodeRef}
			className={`piece-box${extraCss}`}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseOver={onMouseOver}
			title={content}
			tabIndex={0}
		>
			<div className="piece-box__background" />
			<div className="piece-box__body">
				<span className="piece-timestamp">{timeStr}</span>
				<span className="piece-content">{content}</span>
			</div>
		</div>
	);
};

PieceView.defaultProps = {
	onMouseDown: () => {},
	onMouseUp: () => {},
	onMouseOver: () => {},
	isFirstItem: false,
	extraCss: ""
};

export default PieceView;
