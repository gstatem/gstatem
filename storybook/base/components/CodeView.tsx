import React, { FC, useState, useRef } from "react";
import { Source } from "@storybook/addon-docs";
import {
	appendTopRight,
	genCodeTokenLinks,
	prettifySource
} from "../lib/utils";
import { FiddleCodeView, RawFileContent } from "../lib/types";
import { uuidv4 } from "gstatem";
import useCodeBlock from "../../react/base/hooks/useCodeBlock";
import SwitchButtons, {
	SwitchButtonOption
} from "../../../packages/gstatem-devtools/src/components/SwitchButtons";

type Lang = "jsx" | "tsx" | "vue";

type CodeViewProps = {
	id?: string;
	lang?: Lang;
	enableSwitchLang?: boolean;
	componentName?: string;
	jsContent?: RawFileContent;
	tsContent?: RawFileContent;
	vueContent?: RawFileContent;
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
	tsContent,
	vueContent
}) => {
	const viewRef = useRef<HTMLDivElement>();
	const [lang, setLang] = useState<Lang>(langProp);

	let isEnableSwitchLang =
		(typeof enableSwitchLang === "boolean" && enableSwitchLang) ||
		(typeof enableSwitchLang !== "boolean" &&
			jsContent &&
			tsContent &&
			jsContent !== tsContent);

	const isDisplayTopRight = isEnableSwitchLang || componentName;

	useCodeBlock(viewRef, onCodeBlockMount);

	let content, language;
	switch (lang) {
		case "jsx":
			content = jsContent;
			language = "jsx";
			break;
		case "tsx":
			content = tsContent;
			language = "tsx";
			break;
		case "vue":
			content = vueContent;
			language = "html";
			isEnableSwitchLang = false;
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
						// @ts-ignore
						<SwitchButtons
							name={`code-lang-${id}`}
							options={switchButtonOptions}
							value={lang}
							onChange={({ value }) => setLang(value as Lang)}
						/>
					)}
				</div>
			)}
			{content && (
				// @ts-ignore
				<Source
					dark={true}
					language={language}
					code={prettifySource({ content })}
				/>
			)}
		</div>
	);
};

CodeView.defaultProps = {
	lang: "jsx"
};

export default CodeView;
