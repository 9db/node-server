import Node from 'type/node';
import Adapter from 'interface/adapter';
import FieldValue, { PrimitiveValue } from 'type/field-value';

class Repository implements Adapter {
	private adapter: Adapter;

	public constructor(_hostname: string, adapter: Adapter) {
		this.adapter = adapter;
	}

	public async fetchNode(
		namespace_key: string,
		type_key: string,
		node_key: string
	): Promise<Node | undefined> {
		const adapter = this.getAdapter();
		const node = await adapter.fetchNode(namespace_key, type_key, node_key);

		if (node === undefined) {
			return undefined;
		}

		return this.unstandardizeNode(node);
	}

	public async storeNode(node: Node): Promise<Node> {
		const adapter = this.getAdapter();
		const standardized_node = this.standardizeNode(node);

		await adapter.storeNode(standardized_node);

		return node;
	}

	public async setField(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node> {
		const standardized_value = this.standardizeValue(field_value);
		const adapter = this.getAdapter();

		const node = await adapter.setField(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async addValueToSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.addValueToSet(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async removeValueFromSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.removeValueFromSet(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async addValueToList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.addValueToList(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value,
			position
		);

		return this.unstandardizeNode(node);
	}

	public async removeValueFromList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.removeValueFromList(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value,
			position
		);

		return this.unstandardizeNode(node);
	}

	private standardizeValue(value: FieldValue): FieldValue {
		return value;
	}

	private standardizePrimitiveValue(value: PrimitiveValue): PrimitiveValue {
		return value;
	}

	private standardizeNode(node: Node): Node {
		return node;
	}

	private unstandardizeNode(node: Node): Node {
		return node;
	}

	private getAdapter(): Adapter {
		return this.adapter;
	}
}

export default Repository;
