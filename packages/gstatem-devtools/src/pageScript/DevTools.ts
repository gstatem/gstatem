import GStatem, { Init, SelectState, SetOptions, State } from "gstatem";
import { OnAction, OnPageReload, StoreIds } from "../utils/Types";
import { ON_ACTION, ON_PAGE_RELOAD } from "../utils/Constants";
import { uuidv4 } from "../utils/Utils";

// noinspection JSDeprecatedSymbols
const isConnectable =
	typeof window !== "undefined" && navigator.product !== "ReactNative";

const storeIds: StoreIds = {};

if (isConnectable) {
	window.addEventListener("beforeunload", () => {
		const message: OnPageReload = {
			name: ON_PAGE_RELOAD,
			storeIds: storeIds,
			timestamp: new Date().getTime()
		};
		window.postMessage(message);
	});
}

class DevTools<GState extends State> extends GStatem<GState> {
	constructor(config?: Init<GState>) {
		super(config);
		storeIds[this.id] = 1;
		this.postAction(this.state);
	}

	postAction = (piece: GState | SelectState<GState>): GState => {
		const actualPiece = (
			piece instanceof Function ? super.get(piece) : piece
		) as GState;

		if (!isConnectable) return actualPiece;

		const message: OnAction = {
			name: ON_ACTION,
			piece: {
				action: "set",
				payload: {
					storeId: this.id,
					piece: actualPiece
				},
				pieceId: uuidv4(),
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
