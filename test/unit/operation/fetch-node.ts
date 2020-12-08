import NodeFactory from 'factory/node';
import MemoryAdapter from 'adapter/memory';
import NotFoundError from 'http/error/not-found';
import FetchNodeOperation from 'operation/fetch-node';

describe('FetchNodeOperation', () => {
	const input = {
		namespace_key: 'public',
		type_key: 'wizard',
		key: 'gandalf',
	};

	describe('when specified node exists', () => {
		it('returns expected node', async () => {
			const adapter = new MemoryAdapter();

			const node = NodeFactory.create({
				...input,
			});

			await adapter.storeNode(node);

			const operation = new FetchNodeOperation(adapter, input);
			const result = await operation.perform();

			expect(result).toStrictEqual(node);
		});
	});

	describe('when specified node does not exist', () => {
		it('returns an exception', async () => {
			expect.assertions(1);

			const adapter = new MemoryAdapter();
			const operation = new FetchNodeOperation(adapter, input);

			try {
				await operation.perform();
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundError);
			}
		});
	});
});
