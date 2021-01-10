import Node from 'type/node';
import FieldValue, { PrimitiveValue, ListValue } from 'type/field-value';
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

		if (Array.isArray(value)) {
			const original_list = value as PrimitiveValue[];
			const transformed_list = original_list.map((list_value) => {
				return transformer(list_value, hostname);
			});

			result[key] = transformed_list as ListValue;

			return;
		}

		const transformed_value = transformer(value, hostname);

		result[key] = transformed_value;
	});

	return result as Node;
}

export default transformNode;
