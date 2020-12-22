import Node from 'type/node';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface Adapter {
	fetchNode(
		type_key: string,
		node_key: string
	): Promise<Node | undefined>;

	storeNode(node: Node): Promise<Node>;

	setField(
		type_key: string,
		node_key: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node>;

	addValueToSet(
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	removeValueFromSet(
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	addValueToList(
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node>;

	removeValueFromList(
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

	storeAccountKey(
		username: string,
		password: string,
		account_key: string
	): Promise<void>;
}

export default Adapter;
