import Node from 'type/node';
import FieldValue from 'type/field-value';

interface Adapter {
	fetchNode(node_key: string): Promise<Node | undefined>;

	storeNode(node_key: string, node: Node): Promise<Node>;

	setField(
		node_key: string,
		field_key: string,
		old_value: FieldValue,
		new_value: FieldValue
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
