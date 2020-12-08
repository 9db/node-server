import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import fetchPlaintext from 'http/utility/fetch-plaintext';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';
import PlaintextNotFoundEndpoint from 'endpoint/plaintext/not-found';

describe('PlaintextNotFoundEndpoint', () => {
	describe('process()', () => {
		const port = 4482;

		let server!: HTTP.Server;

		beforeEach(() => {
			server = HTTP.createServer((request, response) => {
				const adapter = new MemoryAdapter();
				const route = new PlaintextNotFoundRoute(adapter);

				const endpoint = new PlaintextNotFoundEndpoint(
					request,
					response,
					route,
					adapter
				);

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
