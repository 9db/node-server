import unstandardizeUrl from 'repository/utility/unstandardize-url';

describe('unstandardizeUrl', () => {
	const hostname = 'https://9db.org';

	describe('when given a non-string value', () => {
		const value = 123.45;

		it('returns the original value', () => {
			const unstandardized_value = unstandardizeUrl(value, hostname);

			expect(unstandardized_value).toStrictEqual(value);
		});
	});

	describe('when supplied string does not contain the placeholder', () => {
		const value = 'a string without the placeholder in it';

		it('returns the original value', () => {
			const unstandardized_value = unstandardizeUrl(value, hostname);

			expect(unstandardized_value).toStrictEqual(value);
		});
	});

	describe('when supplied string contains the placeholder, but not at the beginning', () => {
		const value = 'the placeholder is <9dbhost>';

		it('returns the original value', () => {
			const unstandardized_value = unstandardizeUrl(value, hostname);

			expect(unstandardized_value).toStrictEqual(value);
		});
	});

	describe('when supplied string begins with the hostname', () => {
		const value = '<9dbhost>/foo/bar/baz';

		it('returns the value with the hostname replaced with a placeholder', () => {
			const unstandardized_value = unstandardizeUrl(value, hostname);

			expect(unstandardized_value).toStrictEqual(`${hostname}/foo/bar/baz`);
		});
	});
});
