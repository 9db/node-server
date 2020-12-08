import HTTP from 'http';

import fetchJson from 'http/utility/fetch-json';
import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import NodeFactory from 'factory/node';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import JsonFetchNodeRoute from 'route/json/fetch-node';
import JsonFetchNodeEndpoint from 'endpoint/json/fetch-node';

describe('JsonFetchNodeEndpoint', () => {
	describe('process()', () => {
		const port = 4482;

		let server!: HTTP.Server;
		let adapter!: MemoryAdapter;

		beforeEach(() => {
			adapter = new MemoryAdapter();

			server = HTTP.createServer((request, response) => {
				const route = new JsonFetchNodeRoute();

				const endpoint = new JsonFetchNodeEndpoint(
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

		describe('when the specified node exists', () => {
			it('returns expected response data', async () => {
				const node = NodeFactory.create({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
				});

				await adapter.storeNode(node);

				const url = `http://localhost:${port}/public/wizard/gandalf`;
				const result = await fetchJson(url);

				expect(result.body).toStrictEqual(node);
				expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

				expect(result.headers).toMatchObject({
					[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
				});
			});
		});

		describe('when the specified node does not exist', () => {
			it('returns the expected error data', async () => {
				const url = `http://localhost:${port}/public/wizard/gandalf`;
				const result = await fetchJson(url);

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
});
