import HTTP from 'http';

import fetchJson from 'http/utility/fetch-json';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import NodeFactory from 'factory/node';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import JsonFetchNodeEndpoint from 'endpoint/json/fetch-node';

describe('JsonFetchNodeEndpoint', () => {
	describe('process()', () => {
		const port = 4482;
		const hostname = 'https://9db.org';

		let server!: HTTP.Server;
		let repository!: Repository;

		beforeEach(() => {
			const adapter = new MemoryAdapter();

			repository = new Repository(hostname, adapter);

			server = HTTP.createServer((request, response) => {
				const endpoint = new JsonFetchNodeEndpoint(
					request,
					response,
					{
						type_id: 'wizard',
						id: 'gandalf'
					},
					repository
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
					type_id: 'wizard',
					id: 'gandalf'
				});

				await repository.storeNode(node);

				const url = `http://localhost:${port}/public/wizard/gandalf`;
				const result = await fetchJson(url);

				expect(result.body).toStrictEqual(node);
				expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

				expect(result.headers).toMatchObject({
					[HttpHeader.CONTENT_TYPE]: ContentType.JSON
				});
			});
		});

		describe('when the specified node does not exist', () => {
			it('returns the expected error data', async () => {
				const url = `http://localhost:${port}/public/wizard/gandalf`;
				const result = await fetchJson(url);

				expect(result.body).toStrictEqual({
					message: 'File not found'
				});

				expect(result.status_code).toStrictEqual(StatusCode.FILE_NOT_FOUND);

				expect(result.headers).toMatchObject({
					[HttpHeader.CONTENT_TYPE]: ContentType.JSON
				});
			});
		});
	});
});
