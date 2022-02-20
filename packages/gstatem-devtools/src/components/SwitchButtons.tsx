import React, { useState, FunctionComponent, SyntheticEvent } from "react";
import "./SwitchButtons.less";

export type SwitchButtonOption = {
	desc: string;
	value: string | number;
};

export type SwitchButtonsProps = {
	name: string;
	value?: string | number;
	onChange?: (payload: {
		event?: SyntheticEvent;
		value?: string | number;
	}) => void;
	options: SwitchButtonOption[];
};

const SwitchButtons: FunctionComponent<SwitchButtonsProps> = ({
	name,
	value: defaultValue,
	onChange,
	options
}) => {
	const [value, setValue] = useState(defaultValue);

	const optionElements = [];
	for (const { desc, value: optionValue } of options) {
		optionElements.push(
			<label key={`${name}_${optionValue}`}>
				<input
					type="radio"
					name={name}
					value={optionValue}
					checked={value === optionValue}
					onChange={e => e}
				/>
				<div>{desc}</div>
			</label>
		);
	}

	return (
		<div
			className="gs-toggle"
			onChange={event => {
				// @ts-ignore
				const { value } = event.target;
				onChange({ event, value });
				setValue(value);
			}}
		>
			{optionElements}
		</div>
	);
};

SwitchButtons.defaultProps = {
	options: [],
	onChange: () => {
		return;
	}
};

export default SwitchButtons;
