import HTTP from 'http';

import fetchJson from 'http/utility/fetch-json';
import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import JsonNotFoundRoute from 'route/json/not-found';
import JsonNotFoundEndpoint from 'endpoint/json/not-found';

describe('JsonNotFoundEndpoint', () => {
	describe('process()', () => {
		const port = 4482;

		let server!: HTTP.Server;

		beforeEach(() => {
			server = HTTP.createServer((request, response) => {
				const route = new JsonNotFoundRoute();

				const endpoint = new JsonNotFoundEndpoint(
					request,
					response,
					route,
					new MemoryAdapter()
				);

				endpoint.serve();
			});

			server.listen(port);
		});

		afterEach((done) => {
			closeServer(server).then(done);
		});

		it('returns expected response data', async () => {
			const result = await fetchJson(`http://localhost:${port}`);

			expect(result.body).toStrictEqual({
				message: 'File not found',
			});

			expect(result.status_code).toStrictEqual(StatusCode.FILE_NOT_FOUND);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});
		});
	});
});
