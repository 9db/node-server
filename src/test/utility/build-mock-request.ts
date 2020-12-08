import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';

function buildMockRequest(
	url: string,
	method: HttpMethod,
	content_type: ContentType
): HTTP.IncomingMessage {
	const headers = {
		[HttpHeader.ACCEPT]: content_type,
	};

	return {
		url,
		method,
		headers,
	} as HTTP.IncomingMessage;
}

export default buildMockRequest;
