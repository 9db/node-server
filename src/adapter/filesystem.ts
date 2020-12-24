import OS from 'os';
import FS from 'fs';
import Util from 'util';
import {readFile, writeFile, mkdir} from 'fs/promises';

import Node from 'type/node';
import Adapter from 'interface/adapter';
import NotFoundError from 'http/error/not-found';
import FieldValue, {PrimitiveValue} from 'type/field-value';

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

	private ensureTypeDirectoryExists(node_key: string): Promise<void> {
		const parts = node_key.split('/');
		const type_id = parts[0] as string;

		return this.ensureSubdirectoryExists(type_id);
	}

	private async ensureSubdirectoryExists(subdirectory_name: string): Promise<void> {
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
