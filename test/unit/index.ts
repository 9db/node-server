import { Server as ServerExport } from 'index';
import Server from 'server';

describe('package.json', () => {
	it('contains expected package name', () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const manifest = require('../../../package.json');

		expect(manifest.name).toStrictEqual('@9db/node-server');
	});
});

describe('Server', () => {
	it('exposes the Server class', () => {
		expect(ServerExport).toStrictEqual(Server);
	});
});