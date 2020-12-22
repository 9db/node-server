import Repository from 'repository';
import MemoryAdapter from 'adapter/memory';
import Operation, { OperationInput } from 'operation';

describe('Operation', () => {
	function createRepository(): Repository {
		const hostname = 'https://9db.org';
		const adapter = new MemoryAdapter();

		return new Repository(hostname, adapter);
	}

	describe('perform()', () => {
		describe('when performInternal() succeeds', () => {
			class MockOperation extends Operation<OperationInput, string> {
				protected performInternal(): Promise<string> {
					return Promise.resolve('speak friend and enter');
				}
			}

			it('returns the expected result', async () => {
				const repository = createRepository();
				const account = await repository.fetchAnonymousAccount();

				const operation = new MockOperation({
					repository,
					account
				});

				const result = await operation.perform();

				expect(result).toStrictEqual('speak friend and enter');
			});
		});

		describe('when performInternal() returns a rejected promise', () => {
			const error = new Error('Wrong incantation');

			class MockOperation extends Operation<OperationInput, string> {
				protected performInternal(): Promise<string> {
					return Promise.reject(error);
				}
			}

			it('logs and returns the exception', async () => {
				expect.assertions(2);

				const repository = createRepository();
				const account = await repository.fetchAnonymousAccount();

				const operation = new MockOperation({
					repository,
					account
				});

				const spy = jest.spyOn(console, 'error');

				spy.mockImplementation(() => {
					return undefined;
				});

				try {
					await operation.perform();
				} catch (actual_error) {
					expect(actual_error).toStrictEqual(error);
				}

				expect(spy).toHaveBeenCalledWith(error);

				spy.mockRestore();
			});
		});

		describe('when performInternal() raises a synchronous exception', () => {
			const error = new Error('Wrong incantation');

			class MockOperation extends Operation<OperationInput, string> {
				protected performInternal(): Promise<string> {
					throw error;
				}
			}

			it('logs and returns the exception', async () => {
				expect.assertions(2);

				const repository = createRepository();
				const account = await repository.fetchAnonymousAccount();

				const operation = new MockOperation({
					repository,
					account
				});

				const spy = jest.spyOn(console, 'error');

				spy.mockImplementation(() => {
					return undefined;
				});

				try {
					await operation.perform();
				} catch (actual_error) {
					expect(actual_error).toStrictEqual(error);
				}

				expect(spy).toHaveBeenCalledWith(error);

				spy.mockRestore();
			});
		});
	});

	describe('getRepository()', () => {
		it('returns the supplied repository', async () => {
			class MockOperation extends Operation<OperationInput, void> {
				public privilegedGetRepository(): Repository {
					return this.getRepository();
				}

				protected performInternal(): Promise<void> {
					throw new Error('Not implemented');
				}
			}

			const repository = createRepository();
			const account = await repository.fetchAnonymousAccount();

			const operation = new MockOperation({
				repository,
				account
			});

			const result = operation.privilegedGetRepository();

			expect(result).toStrictEqual(repository);
		});
	});
});
