import Repository from 'repository';
import MemoryAdapter from 'adapter/memory';
import CreateNodeOperation from 'operation/create-node';

describe('CreateNodeOperation', () => {
	const hostname = 'https://9db.org';
	const current_timestamp = Date.now();

	let date_spy!: jest.SpyInstance;
	let repository!: Repository;

	beforeEach(() => {
		date_spy = jest.spyOn(Date, 'now');
		date_spy.mockImplementation(() => {
			return current_timestamp;
		});

		const adapter = new MemoryAdapter();
		repository = new Repository(hostname, adapter);
	});

	afterEach(() => {
		date_spy.mockRestore();
	});

	describe('perform()', () => {
		it('returns the expected data', async () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				color: 'grey',
				weapon: 'glamdring'
			};

			const operation = new CreateNodeOperation(repository, input);
			const result = await operation.perform();

			expect(result).toStrictEqual({
				...input,
				creator: 'http://localhost/system/account/anonymous',
				created_at: current_timestamp,
				updated_at: current_timestamp,
				changes: []
			});
		});

		it('assigns the expected data to the repository', async () => {
			const input = {
				namespace_key: 'public',
				type_key: 'wizard',
				key: 'gandalf',
				color: 'grey',
				weapon: 'glamdring'
			};

			const operation = new CreateNodeOperation(repository, input);

			await operation.perform();

			const persisted_node = await repository.fetchNode(
				'public',
				'wizard',
				'gandalf'
			);

			expect(persisted_node).toStrictEqual({
				...input,
				creator: 'http://localhost/system/account/anonymous',
				created_at: current_timestamp,
				updated_at: current_timestamp,
				changes: []
			});
		});
	});
});