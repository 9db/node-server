import Node from 'type/node';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface Adapter {
	fetchNode(
		namespace_key: string,
		type_key: string,
		node_key: string
	): Promise<Node>;

	storeNode(node: Node): Promise<Node>;

	setField(
		node: Node,
		field_key: string,
		field_value: FieldValue
	): Promise<Node>;

	addValueToSet(
		node: Node,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	removeValueFromSet(
		node: Node,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	addValueToList(
		node: Node,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node>;

	removeValueFromList(
		node: Node,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node>;
}

export default Adapter;
