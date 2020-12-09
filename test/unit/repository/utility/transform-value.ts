import transformValue from 'repository/utility/transform-value';

describe('transformValue', () => {
	const hostname = 'https://9db.org';

	describe('when given an array value', () => {
		const value = ['foo', 123.45, true, null];

		it('invokes the transformer for each value in the array', () => {
			let index = 0;

			transformValue(value, hostname, (supplied_value, supplied_hostname) => {
				expect(supplied_hostname).toStrictEqual(hostname);

				const expected_value = value[index];

				expect(supplied_value).toStrictEqual(expected_value);

				index++;

				return supplied_value;
			});

			expect(index).toStrictEqual(value.length);
		});

		it('returns the expected transformed array', () => {
			const result = transformValue(value, hostname, (supplied_value) => {
				switch (typeof supplied_value) {
					case 'string':
						return supplied_value + 'xxx';
					case 'number':
						return supplied_value * 5;
					case 'boolean':
						return !supplied_value;
					default:
						return 'something else';
				}
			});

			expect(result).toStrictEqual(['fooxxx', 617.25, false, 'something else']);
		});
	});

	describe('when given a non-array value', () => {
		const value = 'a non-array value';

		it('forwards the value to the transformer', () => {
			expect.assertions(2);

			transformValue(value, hostname, (supplied_value, supplied_hostname) => {
				expect(supplied_value).toStrictEqual(value);
				expect(supplied_hostname).toStrictEqual(hostname);

				return supplied_value;
			});
		});

		it('returns the expected transformed value', () => {
			const result = transformValue(value, hostname, () => {
				return 'a different value entirely';
			});

			expect(result).toStrictEqual('a different value entirely');
		});
	});
});
