import Node from 'type/node';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface Adapter {
	fetchNode(
		type_id: string,
		node_id: string
	): Promise<Node | undefined>;

	storeNode(node: Node): Promise<Node>;

	setField(
		type_id: string,
		node_id: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node>;

	addValueToSet(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	removeValueFromSet(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node>;

	addValueToList(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node>;

	removeValueFromList(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node>;

	fetchAccountId(
		username: string,
		password: string
	): Promise<string | undefined>;

	storeAccountId(
		username: string,
		password: string,
		account_id: string
	): Promise<void>;
}

export default Adapter;
