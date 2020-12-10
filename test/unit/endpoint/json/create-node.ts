import HTTP from 'http';

import postJson from 'http/utility/post-json';
import SystemKey from 'system/enum/key';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import JsonCreateNodeEndpoint from 'endpoint/json/create-node';

describe('JsonCreateNodeEndpoint', () => {
	const port = 4482;
	const hostname = 'https://9db.org';
	const current_timestamp = Date.now();

	let date_spy!: jest.SpyInstance;
	let repository!: Repository;
	let server!: HTTP.Server;

	beforeEach(() => {
		date_spy = jest.spyOn(Date, 'now');
		date_spy.mockImplementation(() => {
			return current_timestamp;
		});

		const adapter = new MemoryAdapter();

		repository = new Repository(hostname, adapter);

		server = HTTP.createServer((request, response) => {
			const endpoint = new JsonCreateNodeEndpoint(
				request,
				response,
				{
					namespace_key: 'public',
					type_key: 'type',
					key: 'wizard',
				},
				repository
			);

			endpoint.serve();
		});

		server.listen(port);
	});

	afterEach((done) => {
		date_spy.mockRestore();
		closeServer(server).then(done);
	});

	describe('serve()', () => {
		it('returns the expected node data', async () => {
			const data = {
				name: `${hostname}/system/type/string`,
				age: `${hostname}/system/type/number`,
			};

			const url = `http://localhost:${port}/public/type/wizard`;
			const result = await postJson(url, data);

			expect(result.body).toStrictEqual({
				key: 'wizard',
				type_key: SystemKey.GENERIC_TYPE,
				namespace_key: 'public',
				creator: 'http://localhost/system/account/anonymous',
				created_at: current_timestamp,
				updated_at: current_timestamp,
				...data,
			});
		});

		it('returns the expected headers', async () => {
			const url = `http://localhost:${port}/public/type/wizard`;
			const result = await postJson(url, {});

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});
		});

		it('returns the expected status code', async () => {
			const url = `http://localhost:${port}/public/type/wizard`;
			const result = await postJson(url, {});

			expect(result.status_code).toStrictEqual(StatusCode.CREATED);
		});

		it('persists the node to the repository', async () => {
			const data = {
				name: `${hostname}/system/type/string`,
				age: `${hostname}/system/type/number`,
			};

			const url = `http://localhost:${port}/public/type/wizard`;

			await postJson(url, data);

			const persisted_node = await repository.fetchNode(
				'public',
				'type',
				'wizard'
			);

			expect(persisted_node).toStrictEqual({
				key: 'wizard',
				type_key: SystemKey.GENERIC_TYPE,
				namespace_key: 'public',
				creator: 'http://localhost/system/account/anonymous',
				created_at: current_timestamp,
				updated_at: current_timestamp,
				...data,
			});
		});
	});
});
