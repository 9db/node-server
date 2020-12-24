import HTTP from 'http';

import Node from 'type/node';
import postJson from 'http/utility/post-json';
import SystemId from 'system/enum/id';
import Repository from 'repository';
import ChangeType from 'enum/change-type';
import closeServer from 'http/utility/close-server';
import ChangeStatus from 'enum/change-status';
import KeyGenerator from 'utility/key-generator';
import MemoryAdapter from 'adapter/memory';
import JsonUpdateInstanceEndpoint from 'endpoint/json/update-instance';

describe('JsonUpdateInstanceEndpoint', () => {
	const hostname = 'https://9db.org';
	const port = 4428;
	const current_timestamp = Date.now();

	let server!: HTTP.Server;
	let repository!: Repository;
	let date_spy!: jest.SpyInstance;
	let id_spy!: jest.SpyInstance;
	let id!: number;

	beforeEach(() => {
		id = 0;

		const adapter = new MemoryAdapter();
		repository = new Repository(hostname, adapter);

		server = HTTP.createServer((request, response) => {
			const endpoint = new JsonUpdateInstanceEndpoint(
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

		date_spy = jest.spyOn(Date, 'now');

		date_spy.mockImplementation(() => {
			return current_timestamp;
		});

		id_spy = jest.spyOn(KeyGenerator, 'id');

		id_spy.mockImplementation(() => {
			const result = id++;

			return result.toString();
		});
	});

	afterEach((done) => {
		date_spy.mockRestore();
		id_spy.mockRestore();

		closeServer(server).then(done);
	});

	describe('serve()', () => {
		it('processes multiple node changes', async () => {
			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				name: 'Gandalf the Grey',
				horses: [],
				colors: ['grey'],
				creator: `${hostname}/account/iluvatar`,
				created_at: 1607692722005,
				updated_at: 1607692722005,
				changes: []
			};

			await repository.storeNode(node);

			const data = {
				changes: [
					{
						change_type: ChangeType.SET_FIELD_VALUE,
						field: 'name',
						value: 'Gandalf the White',
						previous_value: 'Gandalf the Grey'
					},
					{
						change_type: ChangeType.ADD_SET_VALUE,
						field: 'horses',
						value: 'Shadowfax'
					},
					{
						change_type: ChangeType.ADD_LIST_VALUE,
						field: 'colors',
						value: 'white'
					},
					{
						change_type: ChangeType.REMOVE_LIST_VALUE,
						field: 'colors',
						value: 'grey'
					}
				]
			};

			const url = `http://localhost:${port}/wizard/gandalf`;
			const result = await postJson(url, data);

			expect(result.body).toStrictEqual({
				id: 'gandalf',
				type_id: 'wizard',
				name: 'Gandalf the White',
				horses: ['Shadowfax'],
				colors: ['white'],
				changes: [
					`${hostname}/change/0`,
					`${hostname}/change/1`,
					`${hostname}/change/2`,
					`${hostname}/change/3`
				],
				creator: `${hostname}/account/iluvatar`,
				created_at: 1607692722005,
				updated_at: 1607692722005
			});
		});

		it('stores each node change to the database', async () => {
			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				name: 'Gandalf the Grey',
				horses: [],
				colors: ['grey'],
				creator: `${hostname}/account/iluvatar`,
				created_at: 1607692722005,
				updated_at: 1607692722005,
				changes: []
			};

			await repository.storeNode(node);

			const data = {
				changes: [
					{
						change_type: ChangeType.SET_FIELD_VALUE,
						field: 'name',
						value: 'Gandalf the White',
						previous_value: 'Gandalf the Grey'
					},
					{
						change_type: ChangeType.ADD_SET_VALUE,
						field: 'horses',
						value: 'Shadowfax'
					},
					{
						change_type: ChangeType.ADD_LIST_VALUE,
						field: 'colors',
						value: 'white'
					},
					{
						change_type: ChangeType.REMOVE_LIST_VALUE,
						field: 'colors',
						value: 'grey'
					}
				]
			};

			const url = `http://localhost:${port}/wizard/gandalf`;
			const result = await postJson(url, data);
			const result_node = result.body as Node;
			const promises = result_node.changes.map((change_url) => {
				const path = change_url.replace(hostname, '');
				const parts = path.split('/');
				const id = parts.pop() as string;
				const type_id = parts.pop() as string;

				return repository.fetchNode(type_id, id);
			});

			const changes = await Promise.all(promises);

			expect(changes).toStrictEqual([
				{
					id: '0',
					type_id: SystemId.CHANGE_TYPE,
					change_type: ChangeType.SET_FIELD_VALUE,
					field: 'name',
					value: 'Gandalf the White',
					previous_value: 'Gandalf the Grey',
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				},
				{
					id: '1',
					type_id: SystemId.CHANGE_TYPE,
					change_type: ChangeType.ADD_SET_VALUE,
					field: 'horses',
					value: 'Shadowfax',
					previous_value: null,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				},
				{
					id: '2',
					type_id: SystemId.CHANGE_TYPE,
					change_type: ChangeType.ADD_LIST_VALUE,
					field: 'colors',
					value: 'white',
					previous_value: null,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				},
				{
					id: '3',
					type_id: SystemId.CHANGE_TYPE,
					change_type: ChangeType.REMOVE_LIST_VALUE,
					field: 'colors',
					value: 'grey',
					previous_value: null,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				}
			]);
		});
	});
});
