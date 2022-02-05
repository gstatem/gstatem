import GStatem, { SelectState, SetOptions, State } from "gstatem";
import { OnAction, OnPageReload, StatemIds } from "../utils/Types";
import { ON_ACTION, ON_PAGE_RELOAD } from "../utils/Constants";
import { uuidv4 } from "../utils/Utils";

// noinspection JSDeprecatedSymbols
const isConnectable =
	typeof window !== "undefined" && navigator.product !== "ReactNative";

const statemIds: StatemIds = {};

if (isConnectable) {
	window.addEventListener("beforeunload", () => {
		const message: OnPageReload = {
			name: ON_PAGE_RELOAD,
			statemIds,
			timestamp: new Date().getTime()
		};
		window.postMessage(message);
	});
}

class DevTools<GState extends State> extends GStatem<GState> {
	constructor(...props) {
		super(...props);
		statemIds[this.id] = 1;
		this.postAction(this.state);
	}

	postAction = (piece: GState | SelectState<GState>): GState => {
		const actualPiece = (
			piece instanceof Function ? super.get(piece) : piece
		) as GState;

		if (!isConnectable) return actualPiece;

		const message: OnAction = {
			name: ON_ACTION,
			step: {
				action: "set",
				payload: {
					statemId: this.id,
					piece: actualPiece
				},
				stepId: uuidv4(),
				timestamp: new Date().getTime()
			}
		};
		window.postMessage(message);
		return actualPiece;
	};

	set = (
		piece: GState | SelectState<GState>,
		setOptions?: SetOptions
	): void => {
		const actualPiece = this.postAction(piece);
		return super.set(actualPiece, setOptions);
	};
}

export default DevTools;
