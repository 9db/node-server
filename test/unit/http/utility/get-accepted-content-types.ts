import HTTP from 'http';

import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import ContentType from 'http/enum/content-type';
import getAcceptedContentTypes from 'http/utility/get-accepted-content-types';

function buildRequest(headers: HeaderMap): HTTP.IncomingMessage {
	const request = {
		headers
	};

	return request as HTTP.IncomingMessage;
}

describe('getAcceptedContentTypes', () => {
	describe('when no ACCEPT header is specified', () => {
		it('returns an array containing the JSON content type', () => {
			const request = buildRequest({});
			const content_types = getAcceptedContentTypes(request);

			expect(content_types).toStrictEqual([ContentType.JSON]);
		});
	});

	describe('when ACCEPT header is specified', () => {
		it('returns array of supported content types', () => {
			const request = buildRequest({
				[HttpHeader.ACCEPT]: 'application/json;text/css;text/html'
			});

			const content_types = getAcceptedContentTypes(request);

			expect(content_types).toStrictEqual([ContentType.JSON, ContentType.HTML]);
		});
	});
});
