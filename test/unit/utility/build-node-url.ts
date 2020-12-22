import buildNodeUrl from 'utility/build-node-url';

describe('buildNodeUrl', () => {
	it('returns the expected url', () => {
		const url = buildNodeUrl('https://9db.org', {
			type_id: 'wizard',
			id: 'gandalf'
		});

		expect(url).toStrictEqual('https://9db.org/wizard/gandalf');
	});
});
