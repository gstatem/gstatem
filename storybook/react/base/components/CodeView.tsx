import React, { FC, useState, useRef } from "react";
import { Source } from "@storybook/addon-docs";
import { prettifySource, RawFileContent } from "../../../base/lib/utils";
import { uuidv4 } from "gstatem";
import { SwitchButtons, SwitchButtonOption } from "gstatem-devtools";
import useCodeViewTopRight from "../hooks/useCodeViewTopRight";

type Lang = "jsx" | "tsx";

type CodeViewProps = {
	id?: string;
	lang?: Lang;
	enableSwitchLang?: boolean;
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
	lang: langProp,
	enableSwitchLang,
	componentName,
	jsContent,
	tsContent
}) => {
	const viewRef = useRef<HTMLDivElement>();
	const [lang, setLang] = useState<Lang>(langProp);

	const isEnableSwitchLang =
		(typeof enableSwitchLang === "boolean" && enableSwitchLang) ||
		(typeof enableSwitchLang !== "boolean" && jsContent !== tsContent);

	const isDisplayTopRight = isEnableSwitchLang || componentName;

	if (isDisplayTopRight) {
		useCodeViewTopRight(viewRef);
	}

	let content;
	switch (lang) {
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
					{isEnableSwitchLang && (
						<SwitchButtons
							name={`code-lang-${id}`}
							options={switchButtonOptions}
							value={lang}
							onChange={({ value }) => setLang(value as Lang)}
						/>
					)}
				</div>
			)}
			<Source dark={true} language={lang} code={prettifySource({ content })} />
		</div>
	);
};

CodeView.defaultProps = {
	lang: "jsx"
};

export default CodeView;
