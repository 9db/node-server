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

	public async fetchNode(node_key: string): Promise<Node | undefined> {
		const cache = this.getCache();
		const node = cache[node_key];

		return Promise.resolve(node);
	}

	public storeNode(node_key: string, node: Node): Promise<Node> {
		const cache = this.getCache();

		cache[node_key] = node;

		return Promise.resolve(node);
	}

	public async setField(
		node_key: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(node_key);

		const updated_node = {
			...node,
			[field_key]: field_value
		};

		return this.storeNode(node_key, updated_node);
	}

	public async addValueToSet(
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(node_key);
		const set_field = this.getArrayField(node, field_key);

		if (set_field.includes(value)) {
			return Promise.resolve(node);
		}

		const updated_set = [...set_field, value];

		const updated_node = {
			...node,
			[field_key]: updated_set
		};

		return this.storeNode(node_key, updated_node);
	}

	public async removeValueFromSet(
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(node_key);
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

		return this.storeNode(node_key, updated_node);
	}

	public async fetchValuesFromSet(
		_node_key: string,
		_field_key: string,
		_offset: number,
		_limit: number
	): Promise<PrimitiveValue[]> {
		return Promise.resolve([]);
	}

	public async addValueToList(
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(node_key);
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

		return this.storeNode(node_key, updated_node);
	}

	public async removeValueFromList(
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(node_key);
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

		return this.storeNode(node_key, updated_node);
	}

	public async fetchValuesFromList(
		_node_key: string,
		_field_key: string,
		_offset: number,
		_limit: number
	): Promise<PrimitiveValue[]> {
		return Promise.resolve([]);
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

	private async fetchNodeUnsafe(node_key: string): Promise<Node> {
		const node = await this.fetchNode(node_key);

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

	private getCache(): NodeCache {
		return this.cache;
	}

	private getAccountIds(): AccountIds {
		return this.account_ids;
	}
}

export default MemoryAdapter;
