import Querystring from 'querystring';

import JsonObject from 'http/type/json-object';

function isNumericKey(key: string): boolean {
	const parsed_key = parseInt(key, 10);

	return isNaN(parsed_key) === false;
}

function mergeValue(
	result: Record<string, unknown>,
	key: string,
	value: any
): void {
	const brace_index = key.indexOf('[');

	if (brace_index === -1) {
		result[key] = value;
		return;
	}

	const prefix = key.slice(0, brace_index);
	const suffix = key.slice(brace_index);

	let index = 0;
	let previous_key = prefix;
	let current_key = '';
	let target = result;

	while (index < suffix.length) {
		const character = suffix[index];

		index++;

		if (character === '[') {
			current_key = '';
		} else if (character === ']') {
			if (previous_key === '') {
				const array = (target as unknown) as any[];
				const index_key = Math.max(0, array.length - 1);

				previous_key = index_key.toString();
			}

			if (target[previous_key] === undefined) {
				if (current_key === '' || isNumericKey(current_key)) {
					target[previous_key] = [];
				} else {
					target[previous_key] = {};
				}
			}

			target = target[previous_key] as Record<string, unknown>;
			previous_key = current_key;
		} else {
			current_key += character;
		}
	}

	target[current_key] = value;
}

function parseQuerystring(querystring: string): JsonObject {
	const result = {};
	const raw_data = Querystring.parse(querystring);

	Object.keys(raw_data).forEach((key) => {
		const value = raw_data[key];

		mergeValue(result, key, value);
	});

	return result;
}

export default parseQuerystring;
