import React, { Component, createRef, MutableRefObject } from "react";
import "./App.less";
import {
	CHANNEL_NAME,
	PAGE_OPEN,
	REQUEST_PAGE_OPEN,
	ON_ACTION,
	ON_PAGE_RELOAD,
	MARK_AS_READ,
	MERGE_PIECES
} from "../utils/Constants";
import {
	OnAction,
	ReadPieces,
	PageToBg,
	StoresInfo,
	MergePieces,
	PageOpen,
	OnPageReload,
	PieceInfo
} from "../utils/Types";
import { firstEntry, getPiece, accPiece, setPiece } from "../utils/Utils";
import ReactJson from "react-json-view";
import PieceView from "../components/PieceView";
import SwitchButtons from "../components/SwitchButtons";
import StoreSelection from "../components/StoreSelection";
import { State as GState } from "gstatem";

type PieceNodeStatus = {
	pieceId?: string;
	isRead?: boolean;
	isActive?: boolean;
	storeId?: string;
};
type PieceNodeRefs = Map<MutableRefObject<HTMLDivElement>, PieceNodeStatus>;
type PieceNodes = Map<HTMLDivElement, PieceNodeStatus>;

const switchButtonConfigs = [
	{ desc: "Store", value: "store" },
	{ desc: "Piece", value: "piece" }
];

class App extends Component {
	leftSidePanelNodeRef: MutableRefObject<HTMLDivElement> = createRef();
	bgConn;
	storesInfo: StoresInfo = {};
	activeStoreId;
	tab;
	selectedPieceIndexStart;
	selectedPieceIndexEnd;
	viewMode = "store";
	observer: IntersectionObserver;
	pieceNodeRefs: PieceNodeRefs = new Map();
	pieceNodes: PieceNodes = new Map();
	isMouseDownInLeftPanel = false;
	selectedAccPiece: GState;
	nextReadPieces: ReadPieces = {};
	markAsReadTimeout;
	scrollLeftPanelToBottom = false;

	constructor(props) {
		super(props);
		this.observer = new IntersectionObserver(this.onPieceInViewport);
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
					tabState: { pieceInfoMap }
				}: PageOpen = message;
				for (const storeId in pieceInfoMap) {
					const pieceMap = pieceInfoMap[storeId];
					for (const pieceId in pieceMap) {
						const piece = pieceMap[pieceId];
						this.handlePiece({ pieceInfo: piece, isRender: false });
					}
				}

				this.scrollLeftPanelToBottom = true;
				this.setState({}, () => {
					this.scrollLeftPanelToBottom = false;
				});
				break;
			}
			case ON_ACTION: {
				const { piece }: OnAction = message;
				this.handlePiece({ pieceInfo: piece });
				break;
			}
			case ON_PAGE_RELOAD: {
				const { storeIds }: OnPageReload = message;
				if (storeIds) {
					let hasActiveStoreId = false;
					for (const storeId in storeIds) {
						delete this.storesInfo[storeId];
						if (!hasActiveStoreId && storeId === this.activeStoreId) {
							hasActiveStoreId = true;
						}
					}
					if (hasActiveStoreId) {
						const [firstStoreId] = firstEntry(this.storesInfo) || [];
						this.activeStoreId = firstStoreId;
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

	getStoreInfo = storeId => {
		let storeInfo = this.storesInfo[storeId];
		if (!storeInfo) {
			storeInfo = { piecesInfo: [], piecesById: {}, store: {} };
			this.storesInfo[storeId] = storeInfo;
			if (!this.activeStoreId) {
				this.activeStoreId = storeId;
			}
		}
		return storeInfo;
	};

	handlePiece = ({
		pieceInfo,
		isRender = true
	}: {
		pieceInfo: PieceInfo;
		isRender?: boolean;
	}) => {
		const { action, payload, pieceId } = pieceInfo;
		if (!action || !payload) return;

		const { storeId } = payload;

		const storeInfo = this.getStoreInfo(storeId);
		const { piecesInfo, piecesById, store } = storeInfo;
		switch (action) {
			case "set": {
				piecesInfo.push(pieceInfo);
				piecesById[pieceId] = pieceInfo;
				piecesInfo.sort((a, b) => a.timestamp - b.timestamp);

				const piece = getPiece(payload);
				Object.assign(store, piece);

				const isActiveStore = this.activeStoreId === storeId;
				if (isActiveStore) {
					this.selectedPieceIndexStart = piecesInfo.length - 1;
					this.selectedPieceIndexEnd = this.selectedPieceIndexStart;
				}

				if (isRender) {
					this.scrollLeftPanelToBottom = isActiveStore;
					this.setState({}, () => {
						this.scrollLeftPanelToBottom = false;
					});
				}
				break;
			}
		}
	};

	activeStoreInfo = () => {
		return this.storesInfo[this.activeStoreId] || {};
	};

	onPieceSelect =
		(index, isMouseDownSelect = false) =>
		e => {
			if (e.shiftKey || isMouseDownSelect) {
				this.selectedPieceIndexEnd = index;
			} else {
				this.selectedPieceIndexStart = index;
				this.selectedPieceIndexEnd = this.selectedPieceIndexStart;
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

		const { piecesInfo = [] } = this.activeStoreInfo();
		let nextIndex = this.selectedPieceIndexEnd;
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
			nextIndex = piecesInfo.length - 1;
		} else {
			return;
		}

		if (nextIndex < 0 || nextIndex > piecesInfo.length - 1) {
			return;
		}

		this.onPieceSelect(nextIndex)(e);
		const piecesContainerNode = e.target;
		const selectedPieceNode =
			piecesContainerNode.children[this.selectedPieceIndexStart];

		if (
			isPreventDefault &&
			selectedPieceNode &&
			(selectedPieceNode.offsetTop <
				piecesContainerNode.scrollTop + piecesContainerNode.offsetTop ||
				selectedPieceNode.offsetTop + selectedPieceNode.offsetHeight >
					piecesContainerNode.scrollTop +
						piecesContainerNode.offsetTop +
						piecesContainerNode.offsetHeight)
		) {
			selectedPieceNode.scrollIntoView({
				behavior: "smooth"
			});
		}
	};

	onStoreChange = e => {
		const nextActiveStoreId = e.target.value;
		if (!nextActiveStoreId || this.activeStoreId === nextActiveStoreId) {
			return;
		}

		this.activeStoreId = nextActiveStoreId;
		const storeInfo = this.getStoreInfo(this.activeStoreId);
		const { piecesInfo } = storeInfo;
		this.selectedPieceIndexStart = piecesInfo.length - 1;
		this.selectedPieceIndexEnd = this.selectedPieceIndexStart;
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

		this.pieceNodes.clear();
		this.pieceNodeRefs.forEach((pieceNodeStatus, pieceNodeRef) => {
			const pieceNode = pieceNodeRef.current;
			if (pieceNode instanceof HTMLDivElement) {
				this.observer.observe(pieceNode);
				this.pieceNodes.set(pieceNode, pieceNodeStatus);
			}
		});
	}

	markAsRead = (storeId: string, pieceId: string) => {
		let readPieces = this.nextReadPieces[storeId];
		if (!readPieces) {
			readPieces = [];
			this.nextReadPieces[storeId] = readPieces;
		}
		readPieces.push(pieceId);

		if (this.markAsReadTimeout) {
			clearTimeout(this.markAsReadTimeout);
		}
		this.markAsReadTimeout = setTimeout(async () => {
			const message: PageToBg = {
				name: MARK_AS_READ,
				tabId: this.tab.id,
				readPieces: this.nextReadPieces
			};
			this.bgConn.postMessage(message);
			this.nextReadPieces = {};
			this.markAsReadTimeout = undefined;
			this.setState({});
		}, 300);
	};

	onPieceInViewport = entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const pieceNode = entry.target;
				const piece = this.pieceNodes.get(pieceNode);
				if (!piece) return;

				const { isRead, storeId, pieceId } = piece;
				if (!isRead) {
					pieceNode.classList.add("piece-box__is-unread");
					const { piecesById } = this.storesInfo[storeId];
					const unreadPiece = piecesById[pieceId];
					unreadPiece.isRead = true;
					this.markAsRead(storeId, pieceId);
				}
				this.observer.unobserve(pieceNode);
				pieceNode.addEventListener("animationend", () => {
					pieceNode.classList.remove("piece-box__is-unread");
				});
			}
		});
	};

	mergePieces = () => {
		if (this.selectedPieceIndexStart === this.selectedPieceIndexEnd) return;

		let startIndex = this.selectedPieceIndexStart;
		let endIndex = this.selectedPieceIndexEnd;
		if (this.selectedPieceIndexStart > this.selectedPieceIndexEnd) {
			startIndex = this.selectedPieceIndexEnd;
			endIndex = this.selectedPieceIndexStart;
		}

		const { piecesInfo, piecesById } = this.activeStoreInfo();
		const { payload, pieceId: targetPieceId } = piecesInfo[endIndex];
		setPiece(payload, this.selectedAccPiece);
		const pieceIdsToBeMerged = [];
		for (let i = startIndex; i < endIndex; i++) {
			const { pieceId } = piecesInfo[i];
			delete piecesById[pieceId];
			pieceIdsToBeMerged.push(pieceId);
		}
		piecesInfo.splice(startIndex, endIndex - startIndex);

		this.selectedPieceIndexStart = startIndex;
		this.selectedPieceIndexEnd = startIndex;

		const mergePieces: MergePieces = {
			storeId: this.activeStoreId,
			sourcePieceIds: pieceIdsToBeMerged,
			targetPieceId: targetPieceId
		};

		const message: PageToBg = {
			name: MERGE_PIECES,
			tabId: this.tab.id,
			mergePieces: mergePieces
		};
		this.bgConn.postMessage(message);

		this.setState({});
	};

	render() {
		const { piecesInfo = [] } = this.activeStoreInfo();
		const pieceNodes = [];
		const curStore = {};
		this.pieceNodeRefs.clear();

		let lastTimestamp = 0;
		this.selectedAccPiece = {};
		for (let i = 0; i < piecesInfo.length; i++) {
			const piece = piecesInfo[i];
			const { payload, timestamp, isRead, pieceId } = piece;
			const { storeId } = payload;
			const diffTimestamp = timestamp - lastTimestamp;
			lastTimestamp = timestamp;

			let isActive = false;
			if (this.selectedPieceIndexStart === this.selectedPieceIndexEnd) {
				isActive = this.selectedPieceIndexStart === i;
			} else if (this.selectedPieceIndexStart < this.selectedPieceIndexEnd) {
				isActive =
					i >= this.selectedPieceIndexStart && i <= this.selectedPieceIndexEnd;
			} else if (this.selectedPieceIndexStart > this.selectedPieceIndexEnd) {
				isActive =
					i >= this.selectedPieceIndexEnd && i <= this.selectedPieceIndexStart;
			}

			if (isActive) {
				Object.assign(this.selectedAccPiece, getPiece(payload));
			}

			const pieceNodeRef = createRef<HTMLDivElement>();
			this.pieceNodeRefs.set(pieceNodeRef, {
				isActive,
				isRead,
				storeId: storeId,
				pieceId
			});

			pieceNodes.push(
				<PieceView
					nodeRef={pieceNodeRef}
					key={`${storeId}_${i}`}
					isFirstItem={i === 0}
					payload={payload}
					timestamp={diffTimestamp}
					onMouseDown={this.onPieceSelect(i)}
					onMouseOver={e => {
						if (this.isMouseDownInLeftPanel) {
							this.onPieceSelect(i, true)(e);
						}
					}}
					extraCss={isActive ? " active-piece" : ""}
				/>
			);

			if (
				i <= Math.max(this.selectedPieceIndexStart, this.selectedPieceIndexEnd)
			) {
				accPiece(payload, curStore);
			}
		}

		let displayJsonContent = curStore;
		if (
			this.viewMode === "piece" &&
			(this.selectedPieceIndexStart >= 0 || this.selectedPieceIndexEnd >= 0)
		) {
			displayJsonContent = this.selectedAccPiece;
		}

		return (
			<div className="wrapper">
				<div className="header">
					<StoreSelection
						stores={this.storesInfo}
						onChange={this.onStoreChange}
					/>
					<div className="header-title">GStatem dev tools</div>
				</div>
				<div className="main-body">
					<div className="piece-container">
						<div className="left-side-panel-header">
							<div className="left-side-panel-header__body">
								Piece(s)
								{this.selectedPieceIndexStart !==
									this.selectedPieceIndexEnd && (
									<button
										className="merge-piece-button"
										onClick={this.mergePieces}
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
							{pieceNodes}
						</div>
					</div>
					<div className="store-container">
						<div className="body-container-header">
							<SwitchButtons
								name="view-mode"
								options={switchButtonConfigs}
								value="store"
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
