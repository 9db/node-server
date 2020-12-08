import PathParser from 'route/utility/path-parser';

describe('PathParser', () => {
	it('returns the expected result', () => {
		const parser = new PathParser('/v1/:wizard/passwords/:password');
		const result = parser.parse();

		expect(result).toStrictEqual({
			regex: /^\/v1\/([^\/]+)\/passwords\/([^\/]+)$/,
			parameter_keys: ['wizard', 'password'],
		});
	});
});
