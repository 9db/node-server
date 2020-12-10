import HTTP from 'http';

import closeServer from 'http/utility/close-server';

describe('closeServer()', () => {
	let close_spy!: jest.SpyInstance;

	const server = HTTP.createServer();

	beforeEach(() => {
		close_spy = jest.spyOn(server, 'close');
	});

	describe('when closing the server succeeds', () => {
		it('returns and resolves a promise', async () => {
			close_spy.mockImplementation((callback) => {
				return callback(null);
			});

			const result = closeServer(server);

			expect(result).toBeInstanceOf(Promise);

			await result;
		});
	});

	describe('when closing the server fails', () => {
		it('returns and rejects a promise', async () => {
			expect.assertions(1);

			const error = new Error('Something went wrong');

			close_spy.mockImplementation((callback) => {
				return callback(error);
			});

			try {
				await closeServer(server);
			} catch (actual_error) {
				expect(actual_error).toStrictEqual(error);
			}
		});
	});
});
