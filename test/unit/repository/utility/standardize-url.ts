import standardizeUrl from 'repository/utility/standardize-url';

describe('standardizeUrl', () => {
	const hostname = 'https://9db.org';

	describe('when given a non-string value', () => {
		const value = 123.45;

		it('returns the original value', () => {
			const standardized_value = standardizeUrl(value, hostname);

			expect(standardized_value).toStrictEqual(value);
		});
	});

	describe('when supplied string does not contain the hostname', () => {
		const value = 'a string without a hostname in it';

		it('returns the original value', () => {
			const standardized_value = standardizeUrl(value, hostname);

			expect(standardized_value).toStrictEqual(value);
		});
	});

	describe('when supplied string contains the hostname, but not at the beginning', () => {
		const value = `the hostname is ${hostname}`;

		it('returns the original value', () => {
			const standardized_value = standardizeUrl(value, hostname);

			expect(standardized_value).toStrictEqual(value);
		});
	});

	describe('when supplied string begins with the hostname', () => {
		const value = `${hostname}/foo/bar/baz`;

		it('returns the value with the hostname replaced with a placeholder', () => {
			const standardized_value = standardizeUrl(value, hostname);

			expect(standardized_value).toStrictEqual('<9dbhost>/foo/bar/baz');
		});
	});
});
