import Node from 'type/node';
import Adapter from 'interface/adapter';
import FieldValue from 'type/field-value';
import NotFoundError from 'http/error/not-found';

interface NodeCache {
	[key: string]: Node;
}

interface AccountIds {
	[key: string]: string;
}

class MemoryAdapter implements Adapter {
	private node_cache: NodeCache;
	private account_ids: AccountIds;

	public constructor() {
		this.node_cache = {};
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
			throw new NotFoundError(`Node not found: ${node_key}`);
		}

		return node;
	}

	private getNodeCache(): NodeCache {
		return this.node_cache;
	}

	private getAccountIds(): AccountIds {
		return this.account_ids;
	}
}

export default MemoryAdapter;
