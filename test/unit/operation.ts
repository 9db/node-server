import Adapter from 'interface/adapter';
import Operation from 'operation';
import MemoryAdapter from 'adapter/memory';

describe('Operation', () => {
	describe('perform()', () => {
		describe('when performInternal() succeeds', () => {
			class MockOperation extends Operation<string> {
				protected performInternal(): Promise<string> {
					return Promise.resolve('speak friend and enter');
				}
			}

			it('returns the expected result', async () => {
				const adapter = new MemoryAdapter();
				const operation = new MockOperation(adapter);
				const result = await operation.perform();

				expect(result).toStrictEqual('speak friend and enter');
			});
		});

		describe('when performInternal() returns a rejected promise', () => {
			const error = new Error('Wrong incantation');

			class MockOperation extends Operation<string> {
				protected performInternal(): Promise<string> {
					return Promise.reject(error);
				}
			}

			it('logs and returns the exception', async () => {
				expect.assertions(2);

				const adapter = new MemoryAdapter();
				const operation = new MockOperation(adapter);
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

			class MockOperation extends Operation<string> {
				protected performInternal(): Promise<string> {
					throw error;
				}
			}

			it('logs and returns the exception', async () => {
				expect.assertions(2);

				const adapter = new MemoryAdapter();
				const operation = new MockOperation(adapter);
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

	describe('getAdapter()', () => {
		it('returns the supplied adapter', () => {
			class MockOperation extends Operation<void> {
				public privilegedGetAdapter(): Adapter {
					return this.getAdapter();
				}

				protected performInternal(): Promise<void> {
					throw new Error('Not implemented');
				}
			}

			const adapter = new MemoryAdapter();
			const operation = new MockOperation(adapter);
			const result = operation.privilegedGetAdapter();

			expect(result).toStrictEqual(adapter);
		});
	});
});
