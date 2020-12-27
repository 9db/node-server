import OS from 'os';
import FS from 'fs';
import Util from 'util';
import { readFile, writeFile, mkdir } from 'fs/promises';

import Node from 'type/node';
import Adapter from 'interface/adapter';
import NotFoundError from 'http/error/not-found';
import FieldValue, { PrimitiveValue } from 'type/field-value';

const exists = Util.promisify(FS.exists);

interface AdapterConfig {
	readonly filepath: string;
}

function buildDefaultConfig(): AdapterConfig {
	return {
		filepath: OS.tmpdir()
	};
}

class FilesystemAdapter implements Adapter {
	private filepath: string;

	public constructor(partial_config?: Partial<AdapterConfig>) {
		const config: AdapterConfig = {
			...buildDefaultConfig(),
			...partial_config
		};

		this.filepath = config.filepath;
	}

	public async fetchNode(node_key: string): Promise<Node | undefined> {
		const node_filepath = this.buildNodeFilepath(node_key);
		const node_exists = await exists(node_filepath);

		if (node_exists === false) {
			return undefined;
		}

		const node_string = await readFile(node_filepath, 'utf8');
		const node_data = JSON.parse(node_string);

		return node_data as Node;
	}

	public async storeNode(node_key: string, node: Node): Promise<Node> {
		await this.ensureTypeDirectoryExists(node_key);

		const node_filepath = this.buildNodeFilepath(node_key);
		const node_string = JSON.stringify(node, null, 2);

		await writeFile(node_filepath, node_string, 'utf8');

		return node;
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

		const updated_set_values = [...set_values, value];

		this.storeSetValues(node_key, updated_set_values);
	}

	public async removeValueFromSet(
		node_key: string,
		value: PrimitiveValue
	): Promise<void> {
		const set_values = await this.fetchSetValues(node_key);

		if (!set_values.includes(value)) {
			return;
		}

		const updated_set_values = set_values.filter((existing_value) => {
			return existing_value !== value;
		});

		this.storeSetValues(node_key, updated_set_values);
	}

	public async fetchValuesFromSet(
		node_key: string,
		offset: number,
		limit: number
	): Promise<PrimitiveValue[]> {
		const set_values = await this.fetchSetValues(node_key);

		return set_values.slice(offset, offset + limit);
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

		const updated_list_values = [];
		const max_index = Math.max(position + 1, list_values.length);

		let index = 0;

		while (index < max_index) {
			if (index === position) {
				updated_list_values.push(value);
			}

			const current_value = list_values[index];

			if (current_value !== undefined) {
				updated_list_values.push(current_value);
			} else if (index !== position) {
				updated_list_values.push(null);
			}

			index++;
		}

		this.storeListValues(node_key, updated_list_values);
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

		const updated_list_values = [
			...list_values.slice(0, position),
			...list_values.slice(position + 1)
		];

		this.storeListValues(node_key, updated_list_values);
	}

	public async fetchValuesFromList(
		node_key: string,
		offset: number,
		limit: number
	): Promise<PrimitiveValue[]> {
		const list_values = await this.fetchListValues(node_key);

		return list_values.slice(offset, offset + limit);
	}

	public async fetchAccountId(
		username: string,
		password: string
	): Promise<string | undefined> {
		const filepath = this.getFilepath();
		const token = `${username}:${password}`;
		const account_filepath = `${filepath}/credentials/${token}`;

		const file_exists = await exists(account_filepath);

		if (file_exists === false) {
			return undefined;
		}

		return readFile(account_filepath, 'utf8');
	}

	public async storeAccountId(
		username: string,
		password: string,
		account_id: string
	): Promise<void> {
		await this.ensureSubdirectoryExists('credentials');

		const filepath = this.getFilepath();
		const token = `${username}:${password}`;
		const account_filepath = `${filepath}/credentials/${token}`;

		await writeFile(account_filepath, account_id, 'utf8');
	}

	private async fetchNodeUnsafe(node_key: string): Promise<Node> {
		const node = await this.fetchNode(node_key);

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	private async fetchSetValues(node_key: string): Promise<PrimitiveValue[]> {
		const set_filepath = this.buildNodeFilepath(node_key);
		const set_exists = await exists(set_filepath);

		if (set_exists === false) {
			return Promise.resolve([]);
		}

		const set_string = await readFile(set_filepath, 'utf8');
		const set_data = JSON.parse(set_string);

		if (!Array.isArray(set_data)) {
			throw new Error(`Invalid set data for key ${node_key}: ${set_string}`);
		}

		return set_data as PrimitiveValue[];
	}

	private async storeSetValues(
		node_key: string,
		set_values: PrimitiveValue[]
	): Promise<void> {
		await this.ensureTypeDirectoryExists(node_key);

		const set_filepath = this.buildNodeFilepath(node_key);
		const set_data = JSON.stringify(set_values, null, 2);

		await writeFile(set_filepath, set_data, 'utf8');
	}

	private async fetchListValues(node_key: string): Promise<PrimitiveValue[]> {
		const list_filepath = this.buildNodeFilepath(node_key);
		const list_exists = await exists(list_filepath);

		if (list_exists === false) {
			return Promise.resolve([]);
		}

		const list_string = await readFile(list_filepath, 'utf8');
		const list_data = JSON.parse(list_string);

		if (!Array.isArray(list_data)) {
			throw new Error(`Invalid list data for key ${node_key}: ${list_string}`);
		}

		return list_data as PrimitiveValue[];
	}

	private async storeListValues(
		node_key: string,
		list_values: PrimitiveValue[]
	): Promise<void> {
		await this.ensureTypeDirectoryExists(node_key);

		const list_filepath = this.buildNodeFilepath(node_key);
		const list_data = JSON.stringify(list_values, null, 2);

		await writeFile(list_filepath, list_data, 'utf8');
	}

	private ensureTypeDirectoryExists(node_key: string): Promise<void> {
		const parts = node_key.split('/');
		const type_id = parts[0];

		return this.ensureSubdirectoryExists(type_id);
	}

	private async ensureSubdirectoryExists(
		subdirectory_name: string
	): Promise<void> {
		const filepath = this.getFilepath();
		const subdirectory = `${filepath}/${subdirectory_name}`;
		const subdirectory_exists = await exists(subdirectory);

		if (subdirectory_exists) {
			return;
		}

		await mkdir(subdirectory);
	}

	private buildNodeFilepath(node_key: string): string {
		const filepath = this.getFilepath();

		return `${filepath}/${node_key}.json`;
	}

	private getFilepath(): string {
		return this.filepath;
	}
}

export default FilesystemAdapter;
