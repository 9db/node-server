import Node from 'type/node';
import Adapter from 'interface/adapter';
import NotFoundError from 'http/error/not-found';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface NodeCache {
	[key: string]: Node;
}

interface SetCache {
	[key: string]: PrimitiveValue[];
}

interface ListCache {
	[key: string]: PrimitiveValue[];
}

interface AccountIds {
	[key: string]: string;
}

class MemoryAdapter implements Adapter {
	private node_cache: NodeCache;
	private set_cache: SetCache;
	private list_cache: ListCache;
	private account_ids: AccountIds;

	public constructor() {
		this.node_cache = {};
		this.set_cache = {};
		this.list_cache = {};
		this.account_ids = {};
	}

	public async fetchNode(node_key: string): Promise<Node | undefined> {
		const cache = this.getNodeCache();
		const node = cache[node_key];

		return Promise.resolve(node);
	}

	public storeNode(node_key: string, node: Node): Promise<Node> {
		const cache = this.getNodeCache();

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
		value: PrimitiveValue
	): Promise<void> {
		const set_values = await this.fetchSetValues(node_key);

		if (set_values.includes(value)) {
			return;
		}

		const updated_values = [...set_values, value];

		await this.storeSetValues(node_key, updated_values);
	}

	public async removeValueFromSet(
		node_key: string,
		value: PrimitiveValue
	): Promise<void> {
		const set_values = await this.fetchSetValues(node_key);

		if (!set_values.includes(value)) {
			return;
		}

		const updated_values = set_values.filter((existing_value) => {
			return existing_value !== value;
		});

		await this.storeSetValues(node_key, updated_values);
	}

	public async fetchValuesFromSet(
		_node_key: string,
		_offset: number,
		_limit: number
	): Promise<PrimitiveValue[]> {
		return Promise.resolve([]);
	}

	public async addValueToList(
		node_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<void> {
		const list_values = await this.fetchListValues(node_key);

		if (position === undefined) {
			position = list_values.length;
		}

		const updated_values = [];
		const max_index = Math.max(position + 1, list_values.length);

		let index = 0;

		while (index < max_index) {
			if (index === position) {
				updated_values.push(value);
			}

			const current_value = list_values[index];

			if (current_value !== undefined) {
				updated_values.push(current_value);
			} else if (index !== position) {
				updated_values.push(null);
			}

			index++;
		}

		await this.storeListValues(node_key, updated_values);
	}

	public async removeValueFromList(
		node_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<void> {
		const list_values = await this.fetchListValues(node_key);

		if (position === undefined) {
			position = list_values.lastIndexOf(value);
		}

		if (position === -1) {
			return;
		}

		const target_value = list_values[position];

		if (target_value !== value) {
			throw new Error(
				`Expected to see ${value} at index ${position}, but saw ${target_value}`
			);
		}

		const updated_values = [
			...list_values.slice(0, position),
			...list_values.slice(position + 1)
		];

		await this.storeListValues(node_key, updated_values);
	}

	public async fetchValuesFromList(
		_node_key: string,
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

	private fetchSetValues(node_key: string): Promise<PrimitiveValue[]> {
		const set_cache = this.getSetCache();

		if (set_cache[node_key] === undefined) {
			set_cache[node_key] = [];
		}

		const set_values = set_cache[node_key];

		return Promise.resolve(set_values);
	}

	private storeSetValues(node_key: string, set_values: PrimitiveValue[]): Promise<void> {
		const set_cache = this.getSetCache();

		set_cache[node_key] = set_values;

		return Promise.resolve();
	}

	private fetchListValues(node_key: string): Promise<PrimitiveValue[]> {
		const list_cache = this.getListCache();

		if (list_cache[node_key] === undefined) {
			list_cache[node_key] = [];
		}

		const list_values = list_cache[node_key];

		return Promise.resolve(list_values);
	}

	private storeListValues(node_key: string, list_values: PrimitiveValue[]): Promise<void> {
		const list_cache = this.getListCache();

		list_cache[node_key] = list_values;

		return Promise.resolve();
	}

	private getNodeCache(): NodeCache {
		return this.node_cache;
	}

	private getSetCache(): SetCache {
		return this.set_cache;
	}

	private getListCache(): ListCache {
		return this.list_cache;
	}

	private getAccountIds(): AccountIds {
		return this.account_ids;
	}
}

export default MemoryAdapter;
