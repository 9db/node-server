import Repository from 'repository';
import NodeFactory from 'factory/node';
import MemoryAdapter from 'adapter/memory';
import NotFoundError from 'http/error/not-found';
import FetchNodeOperation from 'operation/fetch-node';

describe('FetchNodeOperation', () => {
	const input = {
		namespace_key: 'public',
		type_key: 'wizard',
		key: 'gandalf'
	};

	function createRepository(): Repository {
		const hostname = 'https://9db.org';
		const adapter = new MemoryAdapter();

		return new Repository(hostname, adapter);
	}

	describe('when specified node exists', () => {
		it('returns expected node', async () => {
			const repository = createRepository();

			const node = NodeFactory.create({
				...input
			});

			await repository.storeNode(node);

			const operation = new FetchNodeOperation(repository, input);
			const result = await operation.perform();

			expect(result).toStrictEqual(node);
		});
	});

	describe('when specified node does not exist', () => {
		it('returns an exception', async () => {
			expect.assertions(1);

			const repository = createRepository();
			const operation = new FetchNodeOperation(repository, input);

			try {
				await operation.perform();
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundError);
			}
		});
	});
});
