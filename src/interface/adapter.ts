import Node from 'type/node';
import FieldValue from 'type/field-value';

interface Adapter {
	fetchNode(node_key: string): Promise<Node | undefined>;

	storeNode(node_key: string, node: Node): Promise<Node>;

	setField(
		node_key: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node>;

	addValueToSet(node_key: string, value: FieldValue): Promise<void>;

	removeValueFromSet(node_key: string, value: FieldValue): Promise<void>;

	fetchValuesFromSet(
		node_key: string,
		offset: number,
		limit: number
	): Promise<FieldValue[]>;

	addValueToList(
		node_key: string,
		value: FieldValue,
		position?: number
	): Promise<void>;

	removeValueFromList(
		node_key: string,
		value: FieldValue,
		position?: number
	): Promise<void>;

	fetchValuesFromList(
		node_key: string,
		offset: number,
		limit: number
	): Promise<FieldValue[]>;

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
