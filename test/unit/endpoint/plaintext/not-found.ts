import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import fetchPlaintext from 'http/utility/fetch-plaintext';
import buildMockRequest from 'test/utility/build-mock-request';
import NotFoundPlaintextEndpoint from 'endpoint/plaintext/not-found';

describe('NotFoundPlaintextEndpoint', () => {
	describe('accepts()', () => {
		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/500',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(NotFoundPlaintextEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.POST,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(NotFoundPlaintextEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(NotFoundPlaintextEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns true', () => {
				expect(NotFoundPlaintextEndpoint.accepts(request)).toBe(true);
			});
		});
	});

	describe('process()', () => {
		const port = 4482;

		let server!: HTTP.Server;

		beforeEach(() => {
			server = HTTP.createServer((request, response) => {
				const endpoint = new NotFoundPlaintextEndpoint(request, response);

				endpoint.serve();
			});

			server.listen(port);
		});

		afterEach((done) => {
			closeServer(server).then(done);
		});

		it('returns expected response data', async () => {
			const result = await fetchPlaintext(`http://localhost:${port}`);

			expect(result.body).toStrictEqual('File not found');
			expect(result.status_code).toStrictEqual(StatusCode.FILE_NOT_FOUND);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
			});
		});
	});
});
