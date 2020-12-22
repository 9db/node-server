import Node from 'type/node';
import Adapter from 'interface/adapter';
import NotFoundError from 'http/error/not-found';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface NodeCache {
	[key: string]: Node;
}

interface AccountIds {
	[key: string]: string;
}

class MemoryAdapter implements Adapter {
	private cache: NodeCache;
	private account_ids: AccountIds;

	public constructor() {
		this.cache = {};
		this.account_ids = {};
	}

	public async fetchNode(
		type_id: string,
		node_id: string
	): Promise<Node | undefined> {
		const cache_key = this.createCacheKey(type_id, node_id);
		const cache = this.getCache();
		const node = cache[cache_key];

		return Promise.resolve(node);
	}

	public storeNode(node: Node): Promise<Node> {
		const cache_key = this.createCacheKeyForNode(node);
		const cache = this.getCache();

		cache[cache_key] = node;

		return Promise.resolve(node);
	}

	public async setField(
		type_id: string,
		node_id: string,
		field_key: string,
		value: FieldValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(type_id, node_id);

		const updated_node = {
			...node,
			[field_key]: value
		};

		return this.storeNode(updated_node);
	}

	public async addValueToSet(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(type_id, node_id);
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
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(type_id, node_id);
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
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(type_id, node_id);
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
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(type_id, node_id);
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

	public fetchAccountId(
		username: string,
		password: string
	): Promise<string | undefined> {
		const serialized_credentials = `${username}:${password}`;
		const account_ids = this.getAccountIds();
		const account_id = account_ids[serialized_credentials];

		return Promise.resolve(account_id);
	}

	public storeAccountId(
		username: string,
		password: string,
		account_id: string
	): Promise<void> {
		const serialized_credentials = `${username}:${password}`;
		const account_ids = this.getAccountIds();

		account_ids[serialized_credentials] = account_id;

		return Promise.resolve();
	}

	private async fetchNodeUnsafe(
		type_id: string,
		node_id: string
	): Promise<Node> {
		const node = await this.fetchNode(type_id, node_id);

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
		type_id: string,
		node_id: string
	): string {
		return `${type_id}/${node_id}`;
	}

	private createCacheKeyForNode(node: Node): string {
		return this.createCacheKey(node.type_id, node.id);
	}

	private getCache(): NodeCache {
		return this.cache;
	}

	private getAccountIds(): AccountIds {
		return this.account_ids;
	}
}

export default MemoryAdapter;
