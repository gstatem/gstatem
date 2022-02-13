import React, { FC, useState, useRef, useEffect } from "react";
import { Source } from "@storybook/addon-docs";
import { prettifySource, RawFileContent } from "../../../base/lib/utils";
import { uuidv4 } from "gstatem";
import { SwitchButtons, SwitchButtonOption } from "gstatem-devtools";

type Mode = "jsx" | "tsx";

type CodeViewProps = {
	id?: string;
	mode?: Mode;
	enableSwitchMode?: boolean;
	componentName?: string;
	jsContent?: RawFileContent;
	tsContent?: RawFileContent;
};

const switchButtonOptions: SwitchButtonOption[] = [
	{ value: "jsx", desc: "JS" },
	{ value: "tsx", desc: "TS" }
];

const CodeView: FC<CodeViewProps> = ({
	id = uuidv4(),
	mode: modeProp,
	enableSwitchMode,
	componentName,
	jsContent,
	tsContent
}) => {
	const viewRef = useRef<HTMLDivElement>();
	const [mode, setMode] = useState<Mode>(modeProp);

	const isEnableSwitchMode =
		(typeof enableSwitchMode === "boolean" && enableSwitchMode) ||
		(typeof enableSwitchMode !== "boolean" && jsContent !== tsContent);

	const isDisplayTopRight = isEnableSwitchMode || componentName;

	if (isDisplayTopRight) {
		useEffect(() => {
			if (viewRef.current instanceof HTMLDivElement) {
				const observerCallback = (_mutations?, observer?) => {
					const sourceBlockElem =
						viewRef.current.getElementsByClassName("docblock-source")[0];
					const switchButtonsElem = viewRef.current.getElementsByClassName(
						"code-view__top-right"
					)[0];

					if (
						sourceBlockElem instanceof HTMLDivElement &&
						switchButtonsElem instanceof HTMLDivElement
					) {
						sourceBlockElem.insertBefore(
							switchButtonsElem,
							sourceBlockElem.firstChild
						);

						if (observer) {
							observer.disconnect();
						}
					}
				};
				const observer = new MutationObserver(observerCallback);
				observerCallback(); // for remount;

				observer.observe(viewRef.current, { childList: true });
				return () => {
					observer.disconnect();
				};
			}
		}, []);
	}

	let content;
	switch (mode) {
		case "jsx":
			content = jsContent;
			break;
		case "tsx":
			content = tsContent;
			break;
	}

	return (
		<div ref={viewRef} className="code-view">
			{isDisplayTopRight && (
				<div className="code-view__top-right">
					{componentName && (
						<div className="code-view__component-name">{componentName}</div>
					)}
					{isEnableSwitchMode && (
						<SwitchButtons
							name={`code-mode-${id}`}
							options={switchButtonOptions}
							value={mode}
							onChange={({ value }) => setMode(value as Mode)}
						/>
					)}
				</div>
			)}
			<Source dark={true} language={mode} code={prettifySource({ content })} />
		</div>
	);
};

CodeView.defaultProps = {
	mode: "jsx"
};

export default CodeView;
