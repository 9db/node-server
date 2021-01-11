import Node from 'type/node';
import FieldValue from 'type/field-value';
import transformValue from 'repository/utility/transform-value';
import FieldValueTransformer from 'repository/interface/field-value-transformer';

interface WritableNode {
	[key: string]: FieldValue;
}

function transformNode(
	node: Node,
	hostname: string,
	transformer: FieldValueTransformer
): Node {
	const result: WritableNode = {};

	Object.keys(node).forEach((key) => {
		const value = node[key];

		switch (key) {
			case 'id':
			case 'type_id':
			case 'created_at':
			case 'updated_at':
				result[key] = value;
				return;
		}

		const transformed_value = transformValue(value, hostname, transformer);

		result[key] = transformed_value;
	});

	return result as Node;
}

export default transformNode;
