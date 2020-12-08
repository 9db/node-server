import HTTP from 'http';

import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import getHeaderValue from 'http/utility/get-header-value';

function buildRequest(headers: HeaderMap): HTTP.IncomingMessage {
	const request = {
		headers,
	};

	return request as HTTP.IncomingMessage;
}

describe('getHeaderValue', () => {
	describe('when specified header was not supplied', () => {
		it('returns undefined', () => {
			const request = buildRequest({});
			const header_value = getHeaderValue(request, HttpHeader.ORIGIN);

			expect(header_value).toStrictEqual(undefined);
		});
	});

	describe('when specified header was supplied', () => {
		it('returns the expected value', () => {
			const request = buildRequest({
				[HttpHeader.ORIGIN]: '9db.org',
			});

			const header_value = getHeaderValue(request, HttpHeader.ORIGIN);

			expect(header_value).toStrictEqual('9db.org');
		});
	});

	describe('when specified header points to an array value', () => {
		it('returns the first value in the array', () => {
			const request = {
				headers: {
					[HttpHeader.ORIGIN]: ['9db.org', 'gatewaker.com'],
				},
			} as unknown;

			const header_value = getHeaderValue(
				request as HTTP.IncomingMessage,
				HttpHeader.ORIGIN
			);

			expect(header_value).toStrictEqual('9db.org');
		});
	});
});
