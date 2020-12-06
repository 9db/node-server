describe('package.json', () => {
	it('contains expected package name', () => {
		const manifest = require('../../../package.json');

		expect(manifest.name).toStrictEqual('@9db/node-server');
	});
});
