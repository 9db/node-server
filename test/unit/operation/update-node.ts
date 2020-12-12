import SystemKey from 'system/enum/key';
import Repository from 'repository';
import ChangeType from 'enum/change-type';
import ChangeStatus from 'enum/change-status';
import KeyGenerator from 'utility/key-generator';
import MemoryAdapter from 'adapter/memory';
import BadRequestError from 'http/error/bad-request';
import UpdateNodeOperation from 'operation/update-node';

describe('UpdateNodeOperation', () => {
	const hostname = 'https://9db.org';
	const current_timestamp = Date.now();

	let repository!: Repository;
	let date_spy!: jest.SpyInstance;
	let id_spy!: jest.SpyInstance;
	let id!: number;

	beforeEach(() => {
		id = 0;

		const adapter = new MemoryAdapter();
		repository = new Repository(hostname, adapter);

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

	afterEach(() => {
		date_spy.mockRestore();
		id_spy.mockRestore();
	});

	describe('perform()', () => {
		it('processes multiple node changes', async () => {
			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				name: 'Gandalf the Grey',
				horses: [],
				colors: ['grey'],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 1607692722005,
				updated_at: 1607692722005,
				changes: []
			};

			await repository.storeNode(node);

			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
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
						value: 'Shadowfax',
						previous_value: null
					},
					{
						change_type: ChangeType.ADD_LIST_VALUE,
						field: 'colors',
						value: 'white',
						previous_value: null
					},
					{
						change_type: ChangeType.REMOVE_LIST_VALUE,
						field: 'colors',
						value: 'grey',
						previous_value: null
					}
				]
			};

			const operation = new UpdateNodeOperation(repository, input);
			const result = await operation.perform();

			expect(result).toStrictEqual({
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				name: 'Gandalf the White',
				horses: ['Shadowfax'],
				colors: ['white'],
				changes: [
					`${hostname}/system/change/0`,
					`${hostname}/system/change/1`,
					`${hostname}/system/change/2`,
					`${hostname}/system/change/3`
				],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 1607692722005,
				updated_at: 1607692722005
			});
		});

		it('stores each node change to the database', async () => {
			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				name: 'Gandalf the Grey',
				horses: [],
				colors: ['grey'],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 1607692722005,
				updated_at: 1607692722005,
				changes: []
			};

			await repository.storeNode(node);

			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
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
						value: 'Shadowfax',
						previous_value: null
					},
					{
						change_type: ChangeType.ADD_LIST_VALUE,
						field: 'colors',
						value: 'white',
						previous_value: null
					},
					{
						change_type: ChangeType.REMOVE_LIST_VALUE,
						field: 'colors',
						value: 'grey',
						previous_value: null
					}
				]
			};

			const operation = new UpdateNodeOperation(repository, input);
			const result = await operation.perform();

			const promises = result.changes.map((change_url) => {
				const path = change_url.replace(hostname, '');
				const parts = path.split('/');
				const key = parts.pop() as string;
				const type_key = parts.pop() as string;
				const namespace_key = parts.pop() as string;

				return repository.fetchNode(namespace_key, type_key, key);
			});

			const changes = await Promise.all(promises);

			expect(changes).toStrictEqual([
				{
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '0',
					change_type: ChangeType.SET_FIELD_VALUE,
					field: 'name',
					value: 'Gandalf the White',
					previous_value: 'Gandalf the Grey',
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				},
				{
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '1',
					change_type: ChangeType.ADD_SET_VALUE,
					field: 'horses',
					value: 'Shadowfax',
					previous_value: null,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				},
				{
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '2',
					change_type: ChangeType.ADD_LIST_VALUE,
					field: 'colors',
					value: 'white',
					previous_value: null,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				},
				{
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '3',
					change_type: ChangeType.REMOVE_LIST_VALUE,
					field: 'colors',
					value: 'grey',
					previous_value: null,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				}
			]);
		});

		describe('when no changes are supplied', () => {
			it('raises a BadRequestError', async () => {
				const node = {
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					name: 'Gandalf the Grey',
					horses: [],
					colors: ['grey'],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 1607692722005,
					updated_at: 1607692722005,
					changes: []
				};

				await repository.storeNode(node);

				const input = {
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					changes: []
				};

				const operation = new UpdateNodeOperation(repository, input);

				try {
					await operation.perform();
				} catch (error) {
					expect(error).toBeInstanceOf(BadRequestError);
				}
			});
		});
	});
});
