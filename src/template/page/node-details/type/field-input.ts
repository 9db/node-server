import TypeNode from 'type/type-node';
import FieldValue from 'type/field-value';

interface FieldInput {
	readonly key: string;
	readonly value: FieldValue;
	readonly type_node: TypeNode;
}

export default FieldInput;
