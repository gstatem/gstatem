import React, { Component, createRef, MutableRefObject } from "react";
import "./App.less";
import {
	CHANNEL_NAME,
	PAGE_OPEN,
	REQUEST_PAGE_OPEN,
	ON_ACTION,
	ON_PAGE_RELOAD,
	MARK_AS_READ,
	MERGE_STEPS
} from "../utils/Constants";
import {
	OnAction,
	ReadSteps,
	PageToBg,
	Statems,
	MergeSteps,
	PageOpen,
	OnPageReload,
	Step
} from "../utils/Types";
import {
	firstEntry,
	getStepState,
	accStepState,
	setStepState
} from "../utils/Utils";
import ReactJson from "react-json-view";
import StepView from "../components/StepView";
import SwitchButtons from "../components/SwitchButtons";
import StatemSelection from "../components/StatemSelection";
import { State as GState } from "gstatem";

type StepNodeStatus = {
	stepId?: string;
	isRead?: boolean;
	isActive?: boolean;
	statemId?: string;
};
type StepNodeRefs = Map<MutableRefObject<HTMLDivElement>, StepNodeStatus>;
type StepNodes = Map<HTMLDivElement, StepNodeStatus>;
type State = {
	scrollLeftPanelToBottom?: boolean;
};

const switchButtonConfigs = [
	{ desc: "State", value: "state" },
	{ desc: "Step(s)", value: "step" }
];

class App extends Component {
	state: State = {};
	leftSidePanelNodeRef: MutableRefObject<HTMLDivElement> = createRef();
	bgConn;
	statems: Statems = {};
	activeStatemId;
	tab;
	selectedStepIndexStart;
	selectedStepIndexEnd;
	viewMode = "state";
	observer: IntersectionObserver;
	stepNodeRefs: StepNodeRefs = new Map();
	stepNodes: StepNodes = new Map();
	isMouseDownInLeftPanel = false;
	selectedAccStepState: GState;
	nextReadSteps: ReadSteps = {};
	markAsReadTimeout;
	scrollLeftPanelToBottom = false;

	constructor(props) {
		super(props);
		this.observer = new IntersectionObserver(this.onStepInViewport);
		this.init().then();
	}

	init = async () => {
		if (!this.tab) {
			const [tab] = await chrome.tabs.query({ active: true });
			this.tab = tab;
		}
		if (!this.tab) return;

		this.bgConn = chrome.runtime.connect({
			name: `${CHANNEL_NAME}__${this.tab.id}`
		});

		this.bgConn.onMessage.addListener(this.onMessage);

		this.bgConn.onDisconnect.addListener(this.onDisconnect);

		this.bgConn.postMessage({
			tabId: this.tab.id,
			name: REQUEST_PAGE_OPEN
		});
	};

	onMessage = async (message: OnAction & OnPageReload & PageOpen) => {
		const { name, tabId } = message;
		if (this.tab.id !== tabId) return;

		switch (name) {
			case PAGE_OPEN: {
				const {
					tabState: { statemStepMap }
				}: PageOpen = message;
				for (const statemId in statemStepMap) {
					const stepMap = statemStepMap[statemId];
					for (const stepId in stepMap) {
						const step = stepMap[stepId];
						this.handleStep({ step, isRender: false });
					}
				}

				this.scrollLeftPanelToBottom = true;
				this.setState({}, () => {
					this.scrollLeftPanelToBottom = false;
				});
				break;
			}
			case ON_ACTION: {
				const { step }: OnAction = message;
				this.handleStep({ step });
				break;
			}
			case ON_PAGE_RELOAD: {
				const { statemIds }: OnPageReload = message;
				if (statemIds) {
					let hasActiveStatemId = false;
					for (const statemId in statemIds) {
						delete this.statems[statemId];
						if (!hasActiveStatemId && statemId === this.activeStatemId) {
							hasActiveStatemId = true;
						}
					}
					if (hasActiveStatemId) {
						const [firstStatemId] = firstEntry(this.statems) || [];
						this.activeStatemId = firstStatemId;
					}
					this.setState({});
				}
				break;
			}
		}
	};

	onDisconnect = async () => {
		await this.init();
	};

	getStatem = statemId => {
		let statem = this.statems[statemId];
		if (!statem) {
			statem = { steps: [], stepsById: {}, state: {} };
			this.statems[statemId] = statem;
			if (!this.activeStatemId) {
				this.activeStatemId = statemId;
			}
		}
		return statem;
	};

	handleStep = ({
		step,
		isRender = true
	}: {
		step: Step;
		isRender?: boolean;
	}) => {
		const { action, payload, stepId } = step;
		if (!action || !payload) return;

		const { statemId } = payload;

		const statem = this.getStatem(statemId);
		const { steps, stepsById, state } = statem;
		switch (action) {
			case "set": {
				steps.push(step);
				stepsById[stepId] = step;
				steps.sort((a, b) => a.timestamp - b.timestamp);

				const stepState = getStepState(payload);
				Object.assign(state, stepState);

				const isActiveStatem = this.activeStatemId === statemId;
				if (isActiveStatem) {
					this.selectedStepIndexStart = steps.length - 1;
					this.selectedStepIndexEnd = this.selectedStepIndexStart;
				}

				if (isRender) {
					this.scrollLeftPanelToBottom = isActiveStatem;
					this.setState({}, () => {
						this.scrollLeftPanelToBottom = false;
					});
				}
				break;
			}
		}
	};

	activeStatem = () => {
		return this.statems[this.activeStatemId] || {};
	};

	onStepSelect =
		(index, isMouseDownSelect = false) =>
		e => {
			if (e.shiftKey || isMouseDownSelect) {
				this.selectedStepIndexEnd = index;
			} else {
				this.selectedStepIndexStart = index;
				this.selectedStepIndexEnd = this.selectedStepIndexStart;
			}
			this.setState({});
		};

	leftSidePanelScrollToBottom = () => {
		const theNode = this.leftSidePanelNodeRef.current;
		if (!theNode) return;

		theNode.scrollTop = theNode.scrollHeight;
	};

	onKeyDown = e => {
		const isPreventDefault =
			e.keyCode !== 33 && // page up
			e.keyCode !== 34 && // page down
			e.keyCode !== 35 && // end
			e.keyCode !== 36 && // home
			e.keyCode !== 37 && // left arrow
			e.keyCode !== 39; // right arrow
		if (isPreventDefault) {
			e.preventDefault();
		}

		const { steps = [] } = this.activeStatem();
		let nextIndex = this.selectedStepIndexEnd;
		if (e.keyCode === 38) {
			// up arrow
			nextIndex--;
		} else if (e.keyCode === 40) {
			// down arrow
			nextIndex++;
		} else if (e.keyCode === 36) {
			// home
			nextIndex = 0;
		} else if (e.keyCode === 35) {
			// end
			nextIndex = steps.length - 1;
		} else {
			return;
		}

		if (nextIndex < 0 || nextIndex > steps.length - 1) {
			return;
		}

		this.onStepSelect(nextIndex)(e);
		const stepsContainerNode = e.target;
		const selectedStepNode =
			stepsContainerNode.children[this.selectedStepIndexStart];

		if (
			isPreventDefault &&
			selectedStepNode &&
			(selectedStepNode.offsetTop <
				stepsContainerNode.scrollTop + stepsContainerNode.offsetTop ||
				selectedStepNode.offsetTop + selectedStepNode.offsetHeight >
					stepsContainerNode.scrollTop +
						stepsContainerNode.offsetTop +
						stepsContainerNode.offsetHeight)
		) {
			selectedStepNode.scrollIntoView({
				behavior: "smooth"
			});
		}
	};

	onStatemChange = e => {
		const nextActiveStatemId = e.target.value;
		if (!nextActiveStatemId || this.activeStatemId === nextActiveStatemId) {
			return;
		}

		this.activeStatemId = nextActiveStatemId;
		const statem = this.getStatem(this.activeStatemId);
		const { steps } = statem;
		this.selectedStepIndexStart = steps.length - 1;
		this.selectedStepIndexEnd = this.selectedStepIndexStart;
		this.scrollLeftPanelToBottom = true;
		this.setState({}, () => {
			this.scrollLeftPanelToBottom = false;
		});
	};

	onViewModeChange = ({ value }) => {
		this.viewMode = value;
		this.setState({});
	};

	windowOnMouseUp = () => {
		this.isMouseDownInLeftPanel = false;
	};

	componentDidMount() {
		window.addEventListener("mouseup", this.windowOnMouseUp);
	}

	componentWillUnmount() {
		window.removeEventListener("mouseup", this.windowOnMouseUp);
	}

	componentDidUpdate() {
		if (this.scrollLeftPanelToBottom) {
			this.leftSidePanelScrollToBottom();
		}

		this.stepNodes.clear();
		this.stepNodeRefs.forEach((stepNodeStatus, stepNodeRef) => {
			const stepNode = stepNodeRef.current;
			if (stepNode instanceof HTMLDivElement) {
				this.observer.observe(stepNode);
				this.stepNodes.set(stepNode, stepNodeStatus);
			}
		});
	}

	markAsRead = (statemId: string, stepId: string) => {
		let readSteps = this.nextReadSteps[statemId];
		if (!readSteps) {
			readSteps = [];
			this.nextReadSteps[statemId] = readSteps;
		}
		readSteps.push(stepId);

		if (this.markAsReadTimeout) {
			clearTimeout(this.markAsReadTimeout);
		}
		this.markAsReadTimeout = setTimeout(async () => {
			const message: PageToBg = {
				name: MARK_AS_READ,
				tabId: this.tab.id,
				readSteps: this.nextReadSteps
			};
			this.bgConn.postMessage(message);
			this.nextReadSteps = {};
			this.markAsReadTimeout = undefined;
			this.setState({});
		}, 300);
	};

	onStepInViewport = entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const stepNode = entry.target;
				const step = this.stepNodes.get(stepNode);
				if (!step) return;

				const { isRead, statemId, stepId } = step;
				if (!isRead) {
					stepNode.classList.add("step-box__is-unread");
					const { stepsById } = this.statems[statemId];
					const step = stepsById[stepId];
					step.isRead = true;
					this.markAsRead(statemId, stepId);
				}
				this.observer.unobserve(stepNode);
				stepNode.addEventListener("animationend", () => {
					stepNode.classList.remove("step-box__is-unread");
				});
			}
		});
	};

	mergeSteps = () => {
		if (this.selectedStepIndexStart === this.selectedStepIndexEnd) return;

		let startIndex = this.selectedStepIndexStart;
		let endIndex = this.selectedStepIndexEnd;
		if (this.selectedStepIndexStart > this.selectedStepIndexEnd) {
			startIndex = this.selectedStepIndexEnd;
			endIndex = this.selectedStepIndexStart;
		}

		const { steps, stepsById } = this.activeStatem();
		const { payload, stepId: targetStepId } = steps[endIndex];
		setStepState(payload, this.selectedAccStepState);
		const stepIdsToBeMerged = [];
		for (let i = startIndex; i < endIndex; i++) {
			const { stepId } = steps[i];
			delete stepsById[stepId];
			stepIdsToBeMerged.push(stepId);
		}
		steps.splice(startIndex, endIndex - startIndex);

		this.selectedStepIndexStart = startIndex;
		this.selectedStepIndexEnd = startIndex;

		const mergeSteps: MergeSteps = {
			statemId: this.activeStatemId,
			sourceStepIds: stepIdsToBeMerged,
			targetStepId
		};

		const message: PageToBg = {
			name: MERGE_STEPS,
			tabId: this.tab.id,
			mergeSteps
		};
		this.bgConn.postMessage(message);

		this.setState({});
	};

	render() {
		const { steps = [] } = this.activeStatem();
		const stepNodes = [];
		const curState = {};
		this.stepNodeRefs.clear();

		let lastTimestamp = 0;
		this.selectedAccStepState = {};
		for (let i = 0; i < steps.length; i++) {
			const step = steps[i];
			const { payload, timestamp, isRead, stepId } = step;
			const { statemId } = payload;
			const diffTimestamp = timestamp - lastTimestamp;
			lastTimestamp = timestamp;

			let isActive = false;
			if (this.selectedStepIndexStart === this.selectedStepIndexEnd) {
				isActive = this.selectedStepIndexStart === i;
			} else if (this.selectedStepIndexStart < this.selectedStepIndexEnd) {
				isActive =
					i >= this.selectedStepIndexStart && i <= this.selectedStepIndexEnd;
			} else if (this.selectedStepIndexStart > this.selectedStepIndexEnd) {
				isActive =
					i >= this.selectedStepIndexEnd && i <= this.selectedStepIndexStart;
			}

			if (isActive) {
				Object.assign(this.selectedAccStepState, getStepState(payload));
			}

			const stepNodeRef = createRef<HTMLDivElement>();
			this.stepNodeRefs.set(stepNodeRef, {
				isActive,
				isRead,
				statemId,
				stepId
			});

			stepNodes.push(
				<StepView
					nodeRef={stepNodeRef}
					key={`${statemId}_${i}`}
					isFirstItem={i === 0}
					payload={payload}
					timestamp={diffTimestamp}
					onMouseDown={this.onStepSelect(i)}
					onMouseOver={e => {
						if (this.isMouseDownInLeftPanel) {
							this.onStepSelect(i, true)(e);
						}
					}}
					extraCss={isActive ? " active-step" : ""}
				/>
			);

			if (
				i <= Math.max(this.selectedStepIndexStart, this.selectedStepIndexEnd)
			) {
				accStepState(payload, curState);
			}
		}

		let displayJsonContent = curState;
		if (
			this.viewMode === "step" &&
			(this.selectedStepIndexStart >= 0 || this.selectedStepIndexEnd >= 0)
		) {
			displayJsonContent = this.selectedAccStepState;
		}

		return (
			<div className="wrapper">
				<div className="header">
					<StatemSelection
						statems={this.statems}
						onChange={this.onStatemChange}
					/>
					<div className="header-title">GStatem dev tools</div>
				</div>
				<div className="main-body">
					<div className="step-container">
						<div className="left-side-panel-header">
							<div className="left-side-panel-header__body">
								Steps
								{this.selectedStepIndexStart !== this.selectedStepIndexEnd && (
									<button
										className="merge-step-button"
										onClick={this.mergeSteps}
									>
										Merge
									</button>
								)}
							</div>
						</div>
						<div
							ref={this.leftSidePanelNodeRef}
							tabIndex={0}
							onKeyDown={this.onKeyDown}
							onMouseDown={e => {
								if (e.button === 0) {
									this.isMouseDownInLeftPanel = true;
								}
							}}
							className="left-side-panel"
						>
							{stepNodes}
						</div>
					</div>
					<div className="state-container">
						<div className="body-container-header">
							<SwitchButtons
								name="view-mode"
								options={switchButtonConfigs}
								value="state"
								onChange={this.onViewModeChange}
							/>
						</div>
						<div className="body-container">
							<ReactJson
								name={false}
								enableClipboard={false}
								src={displayJsonContent}
								theme="monokai"
								collapseStringsAfterLength={10}
								groupArraysAfterLength={3}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
