import Operation from 'operation';

describe('Operation', () => {
	describe('perform()', () => {
		describe('when performInternal() succeeds', () => {
			class MockOperation extends Operation<string> {
				protected performInternal(): Promise<string> {
					return Promise.resolve('speak friend and enter');
				}
			}

			it('returns the expected result', async () => {
				const operation = new MockOperation();
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

				const operation = new MockOperation();
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

				const operation = new MockOperation();
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
});
