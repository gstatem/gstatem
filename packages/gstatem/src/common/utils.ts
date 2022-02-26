import { State, ValueOf } from "./types";

export const deepCopy = <T extends State>(
	inObj: T | ValueOf<T> | object,
	circularCache = new WeakMap()
): T | ValueOf<T> | object => {
	if (!(inObj instanceof Object)) return inObj;

	const existingOutObj = circularCache.get(inObj);
	if (existingOutObj) return existingOutObj;

	const outObj = Array.isArray(inObj) ? [] : {};
	circularCache.set(inObj, outObj);

	for (const key in inObj) {
		const value = inObj[key];
		outObj[key] = deepCopy<T>(value, circularCache);
	}

	return outObj;
};

export const uuidv4 = () => {
	// @ts-ignore
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
};
