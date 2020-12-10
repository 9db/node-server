import Server from 'server';
import StatusCode from 'http/enum/status-code';
import MemoryAdapter from 'adapter/memory';
import fetchPlaintext from 'http/utility/fetch-plaintext';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';

describe('Server', () => {
	describe('accepting requests', () => {
		const port = 5823;

		let server!: Server;

		beforeEach(() => {
			server = new Server({
				port,
			});

			server.start();
		});

		afterEach((done) => {
			server.stop().then(done);
		});

		describe('when /version is requested', () => {
			it('returns the expected data', async () => {
				const result = await fetchPlaintext(`http://localhost:${port}/version`);

				expect(result.body).toStrictEqual('0.0.1');
				expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);
			});
		});

		describe('when a nonexistent route is requested', () => {
			it('returns a 404', async () => {
				const result = await fetchPlaintext(`http://localhost:${port}/gandalf`);

				expect(result.body).toStrictEqual('File not found');
				expect(result.status_code).toStrictEqual(StatusCode.FILE_NOT_FOUND);
			});
		});

		describe('when no matching route exists', () => {
			let accepts_spy!: jest.SpyInstance;

			beforeEach(() => {
				accepts_spy = jest.spyOn(PlaintextNotFoundRoute.prototype, 'accepts');
				accepts_spy.mockImplementation(() => {
					return false;
				});
			});

			afterEach(() => {
				accepts_spy.mockRestore();
			});

			it('returns a 404', async () => {
				const result = await fetchPlaintext(`http://localhost:${port}/gandalf`);

				expect(result.body).toStrictEqual('File not found');
				expect(result.status_code).toStrictEqual(StatusCode.FILE_NOT_FOUND);
			});
		});
	});

	describe('getPort()', () => {
		describe('when the port is explicitly specified', () => {
			it('returns the specified port', () => {
				const port = 4492;

				const server = new Server({
					port,
				});

				expect(server.getPort()).toStrictEqual(port);
			});
		});

		describe('when the port is omitted', () => {
			it('returns the default port', () => {
				const server = new Server();

				expect(server.getPort()).toStrictEqual(9999);
			});
		});
	});

	describe('getAdapter()', () => {
		describe('when the adapter is explicitly specified', () => {
			it('returns the specified adapter', () => {
				const adapter = new MemoryAdapter();

				const server = new Server({
					adapter,
				});

				expect(server.getAdapter()).toStrictEqual(adapter);
			});
		});

		describe('when the adapter is omitted', () => {
			it('returns the default adapter', () => {
				const server = new Server();

				expect(server.getAdapter()).toBeInstanceOf(MemoryAdapter);
			});
		});
	});

	describe('getHostname()', () => {
		describe('when the hostname is explicitly specified', () => {
			it('returns the specified hostname', () => {
				const hostname = 'foo.bar.com';

				const server = new Server({
					hostname,
				});

				expect(server.getHostname()).toStrictEqual(hostname);
			});
		});

		describe('when the hostname is omitted', () => {
			it('returns the default hostname', () => {
				const server = new Server();

				expect(server.getHostname()).toStrictEqual('http://localhost');
			});
		});
	});
});
