import Repository from 'repository';
import NodeFactory from 'factory/node';
import MemoryAdapter from 'adapter/memory';
import NotFoundError from 'http/error/not-found';
import FetchNodeOperation from 'operation/fetch-node';

describe('FetchNodeOperation', () => {
	function createRepository(): Repository {
		const hostname = 'https://9db.org';
		const adapter = new MemoryAdapter();

		return new Repository(hostname, adapter);
	}

	describe('when specified node exists', () => {
		it('returns expected node', async () => {
			const repository = createRepository();
			const account = await repository.fetchAnonymousAccount();

			const node = NodeFactory.create({
				type_id: 'wizard',
				id: 'gandalf'
			});

			await repository.storeNode(node);

			const input = {
				id: 'gandalf',
				type_id: 'wizard',
				repository,
				account
			};

			const operation = new FetchNodeOperation(input);
			const result = await operation.perform();

			expect(result).toStrictEqual(node);
		});
	});

	describe('when specified node does not exist', () => {
		it('returns an exception', async () => {
			expect.assertions(1);

			const repository = createRepository();
			const account = await repository.fetchAnonymousAccount();

			const input = {
				id: 'gandalf',
				type_id: 'wizard',
				repository,
				account
			};

			const operation = new FetchNodeOperation(input);

			try {
				await operation.perform();
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundError);
			}
		});
	});
});
