import Node from 'type/node';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface Adapter {
	fetchNode(
		namespace_key: string,
		type_key: string,
		node_key: string
	): Promise<Node | undefined>;

	storeNode(node: Node): Promise<Node>;

	setField(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node>;

	addValueToSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	removeValueFromSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	addValueToList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node>;

	removeValueFromList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node>;

	fetchAccountKey(
		username: string,
		password: string
	): Promise<string | undefined>;
}

export default Adapter;
