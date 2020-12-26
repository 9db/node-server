import Node from 'type/node';
import FieldValue from 'type/field-value';

interface FieldInput {
	readonly key: string;
	readonly value: FieldValue;
	readonly type_node: Node;
}

export default FieldInput;
