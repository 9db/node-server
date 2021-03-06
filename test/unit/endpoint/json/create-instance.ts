import HTTP from 'http';

import SystemId from 'system/enum/id';
import postJson from 'http/utility/post-json';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import JsonCreateInstanceEndpoint from 'endpoint/json/create-instance';

describe('JsonCreateInstanceEndpoint', () => {
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
			const endpoint = new JsonCreateInstanceEndpoint(
				request,
				response,
				{
					type_id: 'type',
					id: 'wizard'
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
				name: `${hostname}/type/string`,
				age: `${hostname}/type/number`
			};

			const url = `http://localhost:${port}/type/wizard`;
			const result = await postJson(url, data);

			expect(result.body).toStrictEqual({
				url: `${hostname}/wizard`,
				creator: `${hostname}/account/anonymous`,
				created_at: current_timestamp,
				updated_at: current_timestamp,
				changes: [],
				...data
			});
		});

		it('returns the expected headers', async () => {
			const url = `http://localhost:${port}/type/wizard`;
			const result = await postJson(url, {});

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON
			});
		});

		it('returns the expected status code', async () => {
			const url = `http://localhost:${port}/type/wizard`;
			const result = await postJson(url, {});

			expect(result.status_code).toStrictEqual(StatusCode.CREATED);
		});

		it('persists the node to the repository', async () => {
			const data = {
				name: `${hostname}/type/string`,
				age: `${hostname}/type/number`
			};

			const url = `http://localhost:${port}/type/wizard`;

			await postJson(url, data);

			const persisted_node = await repository.fetchNode({
				type_id: SystemId.GENERIC_TYPE,
				id: 'wizard'
			});

			expect(persisted_node).toStrictEqual({
				url: `${hostname}/wizard`,
				creator: `${hostname}/account/anonymous`,
				created_at: current_timestamp,
				updated_at: current_timestamp,
				changes: [],
				...data
			});
		});
	});
});
