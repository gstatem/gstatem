import React, { useState, FunctionComponent, SyntheticEvent } from "react";

type OptionTogglesProps = {
	name: string;
	value?: string | number;
	onChange?: (payload: {
		event?: SyntheticEvent;
		value?: string | number;
	}) => void;
	options: {
		desc: string;
		value: string | number;
	}[];
};

const OptionToggles: FunctionComponent<OptionTogglesProps> = ({
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

OptionToggles.defaultProps = {
	options: [],
	onChange: () => {
		return;
	}
};

export default OptionToggles;
