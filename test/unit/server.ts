import Server from 'server';
import fetchString from 'utility/http/fetch-string';
import MemoryAdapter from 'adapter/memory';

describe('Server', () => {
	describe('start()', () => {
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

		it('begins listening on the specified port', async () => {
			const result = await fetchString(`http://localhost:${port}/version`);
			const manifest = require('../../../package.json');

			expect(result).toStrictEqual(manifest.version);
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

				expect(server.getHostname()).toStrictEqual('localhost');
			});
		});
	});
});
