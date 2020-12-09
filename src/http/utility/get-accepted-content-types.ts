import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import ContentType from 'http/enum/content-type';
import getHeaderValue from 'http/utility/get-header-value';

const KNOWN_CONTENT_TYPES = Object.values(ContentType);

function getAcceptedContentTypes(request: HTTP.IncomingMessage): ContentType[] {
	const header_value = getHeaderValue(request, HttpHeader.ACCEPT);

	if (header_value === undefined) {
		return [
			ContentType.JSON
		];
	}

	const parts = header_value.split(';') as ContentType[];

	return parts.filter((part) => {
		return KNOWN_CONTENT_TYPES.includes(part);
	});
}

export default getAcceptedContentTypes;
