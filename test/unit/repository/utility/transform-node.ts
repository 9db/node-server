import NodeFactory from 'factory/node';
import transformNode from 'repository/utility/transform-node';

describe('transformNode', () => {
	const hostname = 'https://9db.org';

	it('passes the hostname to the transformer', () => {
		const node = NodeFactory.create();

		transformNode(node, hostname, (value, supplied_hostname) => {
			expect(supplied_hostname).toStrictEqual(hostname);

			return value;
		});
	});

	it('does not pass the namespace key to the transformer', () => {
		const node = NodeFactory.create();

		transformNode(node, hostname, (value) => {
			expect(value).not.toStrictEqual(node.namespace_key);

			return value;
		});
	});

	it('does not pass the type key to the transformer', () => {
		const node = NodeFactory.create();

		transformNode(node, hostname, (value) => {
			expect(value).not.toStrictEqual(node.type_key);

			return value;
		});
	});

	it('does not pass the node key to the transformer', () => {
		const node = NodeFactory.create();

		transformNode(node, hostname, (value) => {
			expect(value).not.toStrictEqual(node.key);

			return value;
		});
	});

	it('does not pass the creation timestamp to the transformer', () => {
		const node = NodeFactory.create();

		transformNode(node, hostname, (value) => {
			expect(value).not.toStrictEqual(node.created_at);

			return value;
		});
	});

	it('does not pass the update timestamp to the transformer', () => {
		const node = NodeFactory.create();

		transformNode(node, hostname, (value) => {
			expect(value).not.toStrictEqual(node.updated_at);

			return value;
		});
	});

	it('passes all other values to the transformer', () => {
		const node = NodeFactory.create({
			foo: 'bar',
			bar: 123.45,
			baz: null,
			wat: [true, 'asdf']
		});

		let index = 0;

		const expected_values = [node.creator, 'bar', 123.45, null, true, 'asdf'];

		transformNode(node, hostname, (value) => {
			const expected_value = expected_values[index];

			index++;

			expect(value).toStrictEqual(expected_value);

			return value;
		});

		expect(index).toStrictEqual(6);
	});

	it('returns expected transformed node', () => {
		const node = NodeFactory.create({
			foo: 'bar',
			bar: 123.45,
			baz: null,
			wat: [true, 'asdf']
		});

		const transformed_node = transformNode(node, hostname, (value) => {
			if (value === node.creator) {
				return value;
			}

			switch (typeof value) {
				case 'string':
					return value.split('').reverse().join('');
				case 'number':
					return value * 5;
				case 'boolean':
					return !value;
				default:
					return 'something else';
			}
		});

		expect(transformed_node).toStrictEqual({
			...node,
			foo: 'rab',
			bar: 617.25,
			baz: 'something else',
			wat: [false, 'fdsa']
		});
	});
});
