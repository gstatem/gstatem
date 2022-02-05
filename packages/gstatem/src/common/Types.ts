export type State = object;
export type ValueOf<T> = T[keyof T];

export type SelectState<T extends State> = (state: T) => {
	[key in keyof T]?: ValueOf<T>;
};
export type Selector<T extends State, Piece = unknown> = (state: T) => Piece;
export type Subscriber<T extends State> = (nextState: T, state: T) => void;
export type EqualityFn<T extends State> = (state: T, nextState: T) => boolean;

export type SetOptions = {
	isDispatch?: boolean;
	isReplace?: boolean;
};
export type SubscriberPayload<T extends State, Piece> = {
	selector?: Selector<T, Piece>;
	equalityFn?: EqualityFn<T>;
	unsubscribe?: () => void;
};
export type Subscribers<T extends State, Piece = unknown> = Map<
	Subscriber<T>,
	SubscriberPayload<T, Piece>
>;

// noinspection JSUnusedGlobalSymbols
export type Action = "get" | "set" | "subscribe" | "unsubscribe";

export type Init<T extends State> = {
	id?: string;
	state?: T;
};
