import SystemKey from 'system/enum/key';
import Repository from 'repository';
import ChangeType from 'enum/change-type';
import ChangeStatus from 'enum/change-status';
import KeyGenerator from 'utility/key-generator';
import MemoryAdapter from 'adapter/memory';
import NotFoundError from 'http/error/not-found';
import BadRequestError from 'http/error/bad-request';
import ChangeFieldOperation from 'operation/change-field';

describe('ChangeFieldOperation', () => {
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
		describe('when handling a SET_FIELD_VALUE change', () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				change_type: ChangeType.SET_FIELD_VALUE,
				field: 'color',
				value: 'white',
				previous_value: 'grey'
			};

			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				color: 'grey',
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);
				const result = await operation.perform();

				expect(result).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					color: 'white',
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'public',
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					color: 'white',
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const change_node = await repository.fetchNode('system', 'change', '0');

				expect(change_node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '0',
					field: 'color',
					value: 'white',
					previous_value: 'grey',
					change_type: ChangeType.SET_FIELD_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation(repository, input);

					try {
						await operation.perform();
					} catch (error) {
						expect(error).toBeInstanceOf(NotFoundError);
					}
				});
			});
		});

		describe('when handling a ADD_SET_VALUE change', () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				change_type: ChangeType.ADD_SET_VALUE,
				field: 'weapons',
				value: 'glamdring'
			};

			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				weapons: [],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);
				const result = await operation.perform();

				expect(result).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					weapons: ['glamdring'],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'public',
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					weapons: ['glamdring'],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const change_node = await repository.fetchNode('system', 'change', '0');

				expect(change_node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '0',
					field: 'weapons',
					value: 'glamdring',
					previous_value: null,
					change_type: ChangeType.ADD_SET_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation(repository, input);

					try {
						await operation.perform();
					} catch (error) {
						expect(error).toBeInstanceOf(NotFoundError);
					}
				});
			});
		});

		describe('when handling a REMOVE_SET_VALUE change', () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				change_type: ChangeType.REMOVE_SET_VALUE,
				field: 'weapons',
				value: 'glamdring'
			};

			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				weapons: ['glamdring'],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);
				const result = await operation.perform();

				expect(result).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					weapons: [],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'public',
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					weapons: [],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const change_node = await repository.fetchNode('system', 'change', '0');

				expect(change_node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '0',
					field: 'weapons',
					value: 'glamdring',
					previous_value: null,
					change_type: ChangeType.REMOVE_SET_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation(repository, input);

					try {
						await operation.perform();
					} catch (error) {
						expect(error).toBeInstanceOf(NotFoundError);
					}
				});
			});
		});

		describe('when handling an ADD_LIST_VALUE change', () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				change_type: ChangeType.ADD_LIST_VALUE,
				field: 'mutterings',
				value: 'hrm'
			};

			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				mutterings: ['hrm', 'oho'],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);
				const result = await operation.perform();

				expect(result).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					mutterings: ['hrm', 'oho', 'hrm'],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'public',
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					mutterings: ['hrm', 'oho', 'hrm'],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const change_node = await repository.fetchNode('system', 'change', '0');

				expect(change_node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '0',
					field: 'mutterings',
					value: 'hrm',
					previous_value: null,
					change_type: ChangeType.ADD_LIST_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation(repository, input);

					try {
						await operation.perform();
					} catch (error) {
						expect(error).toBeInstanceOf(NotFoundError);
					}
				});
			});
		});

		describe('when handling an REMOVE_LIST_VALUE change', () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				change_type: ChangeType.REMOVE_LIST_VALUE,
				field: 'mutterings',
				value: 'hrm'
			};

			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				mutterings: ['hrm', 'oho', 'hrm'],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);
				const result = await operation.perform();

				expect(result).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					mutterings: ['hrm', 'oho'],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'public',
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					namespace_key: 'public',
					type_key: 'wizard',
					key: 'gandalf',
					mutterings: ['hrm', 'oho'],
					creator: `${hostname}/public/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/system/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				await operation.perform();

				const change_node = await repository.fetchNode('system', 'change', '0');

				expect(change_node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.CHANGE_TYPE,
					key: '0',
					field: 'mutterings',
					value: 'hrm',
					previous_value: null,
					change_type: ChangeType.REMOVE_LIST_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/system/account/anonymous`,
					approver: `${hostname}/system/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation(repository, input);

					try {
						await operation.perform();
					} catch (error) {
						expect(error).toBeInstanceOf(NotFoundError);
					}
				});
			});
		});

		describe('when given an unsupported change type', () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				change_type: 'something_unsupported' as ChangeType,
				field: 'weapons',
				value: 'glamdring'
			};

			const node = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				weapons: [],
				creator: `${hostname}/public/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('raises a BadRequestError', async () => {
				expect.assertions(1);

				await repository.storeNode(node);

				const operation = new ChangeFieldOperation(repository, input);

				try {
					await operation.perform();
				} catch (error) {
					expect(error).toBeInstanceOf(BadRequestError);
				}
			});
		});
	});
});
