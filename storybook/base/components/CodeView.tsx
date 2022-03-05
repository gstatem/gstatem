import React, { FC, useState, useRef } from "react";
import { Source } from "@storybook/addon-docs";
import {
	appendTopRight,
	genCodeTokenLinks,
	prettifySource
} from "../lib/utils";
import { FiddleCodeView, RawFileContent } from "../lib/types";
import { uuidv4 } from "gstatem";
import { SwitchButtons, SwitchButtonOption } from "gstatem-devtools";
import useCodeBlock from "../../react/base/hooks/useCodeBlock";

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

const onCodeBlockMount: FiddleCodeView = (codeView, sourceBlock) => {
	appendTopRight(codeView, sourceBlock);
	genCodeTokenLinks(codeView, sourceBlock);
};

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
		(typeof enableSwitchLang !== "boolean" &&
			jsContent &&
			tsContent &&
			jsContent !== tsContent);

	const isDisplayTopRight = isEnableSwitchLang || componentName;

	useCodeBlock(viewRef, onCodeBlockMount);

	let content, fileExt;
	switch (lang) {
		case "jsx":
			content = jsContent;
			fileExt = "js";
			break;
		case "tsx":
			content = tsContent;
			fileExt = "tsx";
			break;
	}

	return (
		<div ref={viewRef} className="code-view">
			{isDisplayTopRight && (
				<div className="code-view__top-right">
					{componentName && (
						<div className="code-view__component-name">
							{componentName}.{fileExt}
						</div>
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
