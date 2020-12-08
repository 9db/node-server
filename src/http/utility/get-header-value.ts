import HTTP from 'http';

import HttpHeader from 'http/enum/header';

function getHeaderValue(
	request: HTTP.IncomingMessage,
	header: HttpHeader
): string | undefined {
	const value = request.headers[header];

	if (Array.isArray(value)) {
		return value[0];
	}

	return value;
}

export default getHeaderValue;
