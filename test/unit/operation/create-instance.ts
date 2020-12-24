import Repository from 'repository';
import MemoryAdapter from 'adapter/memory';
import CreateInstanceOperation from 'operation/create-instance';

describe('CreateInstanceOperation', () => {
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
			const account = await repository.fetchAnonymousAccount();

			const input = {
				id: 'gandalf',
				type_id: 'wizard',
				fields: [
					{
						key: 'color',
						value: 'grey'
					},
					{
						key: 'weapon',
						value: 'glamdring'
					}
				],
				repository,
				account
			};

			const operation = new CreateInstanceOperation(input);
			const result = await operation.perform();

			expect(result).toStrictEqual({
				id: 'gandalf',
				type_id: 'wizard',
				color: 'grey',
				weapon: 'glamdring',
				creator: `${hostname}/account/anonymous`,
				created_at: current_timestamp,
				updated_at: current_timestamp,
				changes: []
			});
		});

		it('assigns the expected data to the repository', async () => {
			const account = await repository.fetchAnonymousAccount();

			const input = {
				id: 'gandalf',
				type_id: 'wizard',
				fields: [
					{
						key: 'color',
						value: 'grey'
					},
					{
						key: 'weapon',
						value: 'glamdring'
					}
				],
				repository,
				account
			};

			const operation = new CreateInstanceOperation(input);

			await operation.perform();

			const persisted_node = await repository.fetchNode('wizard', 'gandalf');

			expect(persisted_node).toStrictEqual({
				id: 'gandalf',
				type_id: 'wizard',
				color: 'grey',
				weapon: 'glamdring',
				creator: `${hostname}/account/anonymous`,
				created_at: current_timestamp,
				updated_at: current_timestamp,
				changes: []
			});
		});
	});
});
