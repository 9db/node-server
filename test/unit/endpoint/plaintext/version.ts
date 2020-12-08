import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import fetchPlaintext from 'http/utility/fetch-plaintext';
import buildMockRequest from 'test/utility/build-mock-request';
import VersionPlaintextEndpoint from 'endpoint/plaintext/version';

describe('VersionPlaintextEndpoint', () => {
	describe('accepts()', () => {
		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/info',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(VersionPlaintextEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/version',
				HttpMethod.POST,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(VersionPlaintextEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/version',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(VersionPlaintextEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/version',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns true', () => {
				expect(VersionPlaintextEndpoint.accepts(request)).toBe(true);
			});
		});
	});

	describe('process()', () => {
		const port = 4482;

		let server!: HTTP.Server;

		beforeEach(() => {
			server = HTTP.createServer((request, response) => {
				const endpoint = new VersionPlaintextEndpoint(request, response);

				endpoint.serve();
			});

			server.listen(port);
		});

		afterEach((done) => {
			closeServer(server).then(done);
		});

		it('returns expected response data', async () => {
			const result = await fetchPlaintext(`http://localhost:${port}`);
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const manifest = require('../../../../../package.json');

			expect(result.body).toStrictEqual(manifest.version);
			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.TEXT
			});
		});
	});
});
