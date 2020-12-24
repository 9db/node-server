import OS from 'os';
import {readFile} from 'fs/promises';

import Node from 'type/node';
import Adapter from 'interface/adapter';
import FieldValue, {PrimitiveValue} from 'type/field-value';

class FilesystemAdapter implements Adapter {
	private filepath: string;

	public constructor(filepath?: string) {
		this.filepath = filepath || OS.tmpdir();
	}

	public async fetchNode(node_key: string): Promise<Node | undefined> {
		const node_filepath = this.buildNodeFilepath(node_key);
		const node_string = await readFile(node_filepath, 'utf8');
		const node_data = JSON.parse(node_string);

		return node_data as Node;
	}

	public storeNode(node_key: string, node: Node): Promise<Node> {
		throw new Error('die');
	}

	public setField(
		node_key: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node> {
		throw new Error('die');
	}

	public addValueToSet(
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		throw new Error('die');
	}

	public removeValueFromSet(
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		throw new Error('die');
	}

	public addValueToList(
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		throw new Error('die');
	}

	public removeValueFromList(
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		throw new Error('die');
	}

	public fetchAccountId(
		username: string,
		password: string
	): Promise<string | undefined> {
		throw new Error('die');
	}

	public storeAccountId(
		username: string,
		password: string,
		account_id: string
	): Promise<void> {
		throw new Error('die');
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
