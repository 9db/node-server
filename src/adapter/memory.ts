import Node from 'type/node';
import Adapter from 'interface/adapter';
import NotFoundError from 'http/error/not-found';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface NodeCache {
	[key: string]: Node;
}

class MemoryAdapter implements Adapter {
	private cache: NodeCache;

	public constructor() {
		this.cache = {};
	}

	public async fetchNode(
		namespace_key: string,
		type_key: string,
		node_key: string
	): Promise<Node | undefined> {
		const cache_key = this.createCacheKey(namespace_key, type_key, node_key);
		const node = this.cache[cache_key];

		return Promise.resolve(node);
	}

	public storeNode(node: Node): Promise<Node> {
		const cache_key = this.createCacheKeyForNode(node);

		this.cache[cache_key] = node;

		return Promise.resolve(node);
	}

	public async setField(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: FieldValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(namespace_key, type_key, node_key);

		const updated_node = {
			...node,
			[field_key]: value
		};

		return this.storeNode(updated_node);
	}

	public async addValueToSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(namespace_key, type_key, node_key);
		const set_field = this.getArrayField(node, field_key);

		if (set_field.includes(value)) {
			return Promise.resolve(node);
		}

		const updated_set = [...set_field, value];

		const updated_node = {
			...node,
			[field_key]: updated_set
		};

		return this.storeNode(updated_node);
	}

	public async removeValueFromSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(namespace_key, type_key, node_key);
		const set_field = this.getArrayField(node, field_key);

		if (!set_field.includes(value)) {
			return Promise.resolve(node);
		}

		const updated_set = set_field.filter((existing_value) => {
			return existing_value !== value;
		});

		const updated_node = {
			...node,
			[field_key]: updated_set
		};

		return this.storeNode(updated_node);
	}

	public async addValueToList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(namespace_key, type_key, node_key);
		const list_field = this.getArrayField(node, field_key);

		if (position === undefined) {
			position = list_field.length;
		}

		const updated_list = [];
		const max_index = Math.max(position + 1, list_field.length);

		let index = 0;

		while (index < max_index) {
			if (index === position) {
				updated_list.push(value);
			}

			const current_value = list_field[index];

			if (current_value !== undefined) {
				updated_list.push(current_value);
			} else if (index !== position) {
				updated_list.push(null);
			}

			index++;
		}

		const updated_node = {
			...node,
			[field_key]: updated_list
		};

		return this.storeNode(updated_node);
	}

	public async removeValueFromList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(namespace_key, type_key, node_key);
		const list_field = this.getArrayField(node, field_key);

		if (position === undefined) {
			position = list_field.lastIndexOf(value);
		}

		if (position === -1) {
			return Promise.resolve(node);
		}

		const target_value = list_field[position];

		if (target_value !== value) {
			throw new Error(
				`Expected to see ${value} at index ${position}, but saw ${target_value}`
			);
		}

		const updated_list = [
			...list_field.slice(0, position),
			...list_field.slice(position + 1)
		];

		const updated_node = {
			...node,
			[field_key]: updated_list
		};

		return this.storeNode(updated_node);
	}

	public fetchAccountKey(
		_username: string,
		_password: string
	): Promise<string | undefined> {
		return Promise.resolve('system');
	}

	private async fetchNodeUnsafe(
		namespace_key: string,
		type_key: string,
		node_key: string
	): Promise<Node> {
		const node = await this.fetchNode(namespace_key, type_key, node_key);

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	private getArrayField(node: Node, field_key: string): PrimitiveValue[] {
		const field = node[field_key];

		if (field === undefined) {
			throw new Error(`Unable to find field for key: ${field_key}`);
		}

		if (!Array.isArray(field)) {
			throw new Error(`Field key ${field_key} did not point to an array`);
		}

		return field as PrimitiveValue[];
	}

	private createCacheKey(
		namespace_key: string,
		type_key: string,
		node_key: string
	): string {
		return `${namespace_key}/${type_key}/${node_key}`;
	}

	private createCacheKeyForNode(node: Node): string {
		return this.createCacheKey(node.namespace_key, node.type_key, node.key);
	}
}

export default MemoryAdapter;
