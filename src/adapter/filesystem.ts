import OS from 'os';
import FS from 'fs';
import Util from 'util';
import { readFile, writeFile, mkdir } from 'fs/promises';

import Node from 'type/node';
import Adapter from 'interface/adapter';
import FieldValue from 'type/field-value';
import NotFoundError from 'http/error/not-found';
import BadRequestError from 'http/error/bad-request';

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
		old_value: FieldValue,
		new_value: FieldValue
	): Promise<Node> {
		const node = await this.fetchNodeUnsafe(node_key);
		const current_value = node[field_key];

		if (current_value !== old_value) {
			throw new BadRequestError(`
				Invalid old value supplied for field ${field_key}
				(expected ${current_value}, but received ${old_value})
			`);
		}

		const updated_node = {
			...node,
			[field_key]: new_value
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
