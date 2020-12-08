import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import fetchJson from 'http/utility/fetch-json';
import JsonFetchNodeRoute from 'route/json/fetch-node';
import JsonFetchNodeEndpoint from 'endpoint/json/fetch-node';

describe('JsonFetchNodeEndpoint', () => {
	describe('process()', () => {
		const port = 4482;

		let server!: HTTP.Server;

		beforeEach(() => {
			server = HTTP.createServer((request, response) => {
				const route = new JsonFetchNodeRoute();

				const endpoint = new JsonFetchNodeEndpoint(request, response, route);

				endpoint.serve();
			});

			server.listen(port);
		});

		afterEach((done) => {
			closeServer(server).then(done);
		});

		it('returns expected response data', async () => {
			const url = `http://localhost:${port}/public/wizard/gandalf`;

			const result = await fetchJson(url);

			expect(result.body).toStrictEqual({
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
			});

			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});
		});
	});
});
