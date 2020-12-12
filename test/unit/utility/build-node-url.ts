import buildNodeUrl from 'utility/build-node-url';

describe('buildNodeUrl', () => {
	it('returns the expected url', () => {
		const url = buildNodeUrl('https://9db.org', {
			namespace_key: 'public',
			type_key: 'wizard',
			key: 'gandalf'
		});

		expect(url).toStrictEqual('https://9db.org/public/wizard/gandalf');
	});
});
