import { Server as ServerExport } from 'index';
import Server from 'server';

describe('Server', () => {
	it('exposes the Server class', () => {
		expect(ServerExport).toStrictEqual(Server);
	});
});
