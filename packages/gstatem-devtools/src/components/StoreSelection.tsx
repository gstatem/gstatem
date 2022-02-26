import React, { FunctionComponent, SyntheticEvent } from "react";
import { StoresInfo } from "../utils/Types";

type StoreSelectionProps = {
	stores: StoresInfo;
	onChange: (event: SyntheticEvent) => void;
};

const StoreSelection: FunctionComponent<StoreSelectionProps> = ({
	stores,
	onChange
}) => {
	const options = [];
	let isShowRedDot = false;
	for (const storeId in stores) {
		const { piecesInfo } = stores[storeId];
		let hasUnread = false;
		for (const { isRead } of piecesInfo) {
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
				key={storeId}
				value={storeId}
				className={hasUnread ? "store-has-unread" : undefined}
			>
				{storeId}
			</option>
		);
	}

	return (
		<div
			className="store-select-container"
			title={isShowRedDot ? "Has unread store" : undefined}
		>
			<select className="store-select" onChange={onChange}>
				{options}
			</select>
			{isShowRedDot && <span className="red-dot" />}
		</div>
	);
};

export default StoreSelection;
