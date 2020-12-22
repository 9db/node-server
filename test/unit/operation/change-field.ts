import Node from 'type/node';
import SystemId from 'system/enum/id';
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
	let account!: Node;
	let date_spy!: jest.SpyInstance;
	let id_spy!: jest.SpyInstance;
	let id!: number;

	beforeEach(async () => {
		id = 0;

		const adapter = new MemoryAdapter();
		repository = new Repository(hostname, adapter);
		account = await repository.fetchAnonymousAccount();

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
				id: 'gandalf',
				type_id: 'wizard',
				change_type: ChangeType.SET_FIELD_VALUE,
				field: 'color',
				value: 'white',
				previous_value: 'grey'
			};

			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				color: 'grey',
				creator: `${hostname}/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				const result = await operation.perform();

				expect(result).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					color: 'white',
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					color: 'white',
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const change_node = await repository.fetchNode('change', '0');

				expect(change_node).toStrictEqual({
					id: '0',
					type_id: SystemId.CHANGE_TYPE,
					field: 'color',
					value: 'white',
					previous_value: 'grey',
					change_type: ChangeType.SET_FIELD_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation({
						...input,
						repository,
						account
					});

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
				id: 'gandalf',
				type_id: 'wizard',
				change_type: ChangeType.ADD_SET_VALUE,
				field: 'weapons',
				value: 'glamdring'
			};

			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				weapons: [],
				creator: `${hostname}/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				const result = await operation.perform();

				expect(result).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					weapons: ['glamdring'],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					weapons: ['glamdring'],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
				  account
				});

				await operation.perform();

				const change_node = await repository.fetchNode('change', '0');

				expect(change_node).toStrictEqual({
					id: '0',
					type_id: SystemId.CHANGE_TYPE,
					field: 'weapons',
					value: 'glamdring',
					previous_value: null,
					change_type: ChangeType.ADD_SET_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation({
						...input,
						repository,
						account
					});

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
				id: 'gandalf',
				type_id: 'wizard',
				change_type: ChangeType.REMOVE_SET_VALUE,
				field: 'weapons',
				value: 'glamdring'
			};

			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				weapons: ['glamdring'],
				creator: `${hostname}/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				const result = await operation.perform();

				expect(result).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					weapons: [],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					weapons: [],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const change_node = await repository.fetchNode('change', '0');

				expect(change_node).toStrictEqual({
					id: '0',
					type_id: SystemId.CHANGE_TYPE,
					field: 'weapons',
					value: 'glamdring',
					previous_value: null,
					change_type: ChangeType.REMOVE_SET_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation({
						...input,
						repository,
						account
					});

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
				id: 'gandalf',
				type_id: 'wizard',
				change_type: ChangeType.ADD_LIST_VALUE,
				field: 'mutterings',
				value: 'hrm'
			};

			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				mutterings: ['hrm', 'oho'],
				creator: `${hostname}/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				const result = await operation.perform();

				expect(result).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					mutterings: ['hrm', 'oho', 'hrm'],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					mutterings: ['hrm', 'oho', 'hrm'],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const change_node = await repository.fetchNode('change', '0');

				expect(change_node).toStrictEqual({
					id: '0',
					type_id: SystemId.CHANGE_TYPE,
					field: 'mutterings',
					value: 'hrm',
					previous_value: null,
					change_type: ChangeType.ADD_LIST_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation({
						...input,
						repository,
						account
					});

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
				id: 'gandalf',
				type_id: 'wizard',
				change_type: ChangeType.REMOVE_LIST_VALUE,
				field: 'mutterings',
				value: 'hrm'
			};

			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				mutterings: ['hrm', 'oho', 'hrm'],
				creator: `${hostname}/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('returns the expected output', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				const result = await operation.perform();

				expect(result).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					mutterings: ['hrm', 'oho'],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the updated node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const persisted_node = await repository.fetchNode(
					'wizard',
					'gandalf'
				);

				expect(persisted_node).toStrictEqual({
					id: 'gandalf',
					type_id: 'wizard',
					mutterings: ['hrm', 'oho'],
					creator: `${hostname}/account/iluvatar`,
					created_at: 0,
					updated_at: 0,
					changes: [`${hostname}/change/0`]
				});
			});

			it('persists the change node', async () => {
				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				await operation.perform();

				const change_node = await repository.fetchNode('change', '0');

				expect(change_node).toStrictEqual({
					id: '0',
					type_id: SystemId.CHANGE_TYPE,
					field: 'mutterings',
					value: 'hrm',
					previous_value: null,
					change_type: ChangeType.REMOVE_LIST_VALUE,
					status: ChangeStatus.APPROVED,
					creator: `${hostname}/account/anonymous`,
					approver: `${hostname}/account/system`,
					created_at: current_timestamp,
					updated_at: current_timestamp,
					changes: []
				});
			});

			describe('when the specified node does not exist', () => {
				it('returns a NotFoundError', async () => {
					expect.assertions(1);

					const operation = new ChangeFieldOperation({
						...input,
						repository,
						account
					});

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
				id: 'gandalf',
				type_id: 'wizard',
				change_type: 'something_unsupported' as ChangeType,
				field: 'weapons',
				value: 'glamdring'
			};

			const node = {
				id: 'gandalf',
				type_id: 'wizard',
				weapons: [],
				creator: `${hostname}/account/iluvatar`,
				created_at: 0,
				updated_at: 0,
				changes: []
			};

			it('raises a BadRequestError', async () => {
				expect.assertions(1);

				await repository.storeNode(node);

				const operation = new ChangeFieldOperation({
					...input,
					repository,
					account
				});

				try {
					await operation.perform();
				} catch (error) {
					expect(error).toBeInstanceOf(BadRequestError);
				}
			});
		});
	});
});
