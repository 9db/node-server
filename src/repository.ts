import Node from 'type/node';
import Adapter from 'interface/adapter';
import SystemId from 'system/enum/id';
import FieldValue from 'type/field-value';
import SystemCache from 'system/cache';
import NotFoundError from 'http/error/not-found';
import transformNode from 'repository/utility/transform-node';
import NodeParameters from 'type/node-parameters';
import standardizeUrl from 'repository/utility/standardize-url';
import unstandardizeUrl from 'repository/utility/unstandardize-url';
import getNodeParameters from 'utility/get-node-parameters';

class Repository {
	private hostname: string;
	private adapter: Adapter;
	private system_cache: SystemCache;

	public constructor(hostname: string, adapter: Adapter) {
		this.hostname = hostname;
		this.adapter = adapter;

		this.system_cache = new SystemCache(hostname);
	}

	public async fetchNode(parameters: NodeParameters): Promise<Node | undefined> {
		const system_node = this.fetchSystemNode(parameters);

		if (system_node !== undefined) {
			// NOTE: No transformation happens on system nodes, for performance
			// reasons. They are generated upfront to use the correct hostname.
			return Promise.resolve(system_node);
		}

		const adapter = this.getAdapter();
		const node_key = this.getNodeKey(parameters);
		const node = await adapter.fetchNode(node_key);

		if (node === undefined) {
			return undefined;
		}

		return this.unstandardizeNode(node);
	}

	public async storeNode(node: Node): Promise<Node> {
		const parameters = getNodeParameters(node.url);
		const node_key = this.getNodeKey(parameters);
		const adapter = this.getAdapter();
		const standardized_node = this.standardizeNode(node);

		await adapter.storeNode(node_key, standardized_node);

		return node;
	}

	public async setField(
		parameters: NodeParameters,
		field_key: string,
		field_value: FieldValue
	): Promise<Node> {
		const node_key = this.getNodeKey(parameters);
		const standardized_value = this.standardizeValue(field_value);
		const adapter = this.getAdapter();

		const node = await adapter.setField(
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async addValueToSet(
		parameters: NodeParameters,
		value: FieldValue
	): Promise<void> {
		const node_key = this.getNodeKey(parameters);
		const standardized_value = this.standardizeValue(value);
		const adapter = this.getAdapter();

		await adapter.addValueToSet(node_key, standardized_value);
	}

	public async removeValueFromSet(
		parameters: NodeParameters,
		value: FieldValue
	): Promise<void> {
		const node_key = this.getNodeKey(parameters);
		const standardized_value = this.standardizeValue(value);
		const adapter = this.getAdapter();

		await adapter.removeValueFromSet(node_key, standardized_value);
	}

	public async fetchValuesFromSet(
		parameters: NodeParameters,
		offset: number,
		limit: number
	): Promise<FieldValue[]> {
		const node_key = this.getNodeKey(parameters);
		const adapter = this.getAdapter();

		const values = await adapter.fetchValuesFromSet(node_key, offset, limit);

		return values.map((value) => {
			return this.unstandardizeValue(value);
		});
	}

	public async addValueToList(
		parameters: NodeParameters,
		value: FieldValue,
		position?: number
	): Promise<void> {
		const node_key = this.getNodeKey(parameters);
		const standardized_value = this.standardizeValue(value);
		const adapter = this.getAdapter();

		await adapter.addValueToList(node_key, standardized_value, position);
	}

	public async removeValueFromList(
		parameters: NodeParameters,
		value: FieldValue,
		position?: number
	): Promise<void> {
		const node_key = this.getNodeKey(parameters);
		const standardized_value = this.standardizeValue(value);
		const adapter = this.getAdapter();

		await adapter.removeValueFromList(node_key, standardized_value, position);
	}

	public async fetchValuesFromList(
		parameters: NodeParameters,
		offset: number,
		limit: number
	): Promise<FieldValue[]> {
		const node_key = this.getNodeKey(parameters);
		const adapter = this.getAdapter();

		const values = await adapter.fetchValuesFromList(node_key, offset, limit);

		return values.map((value) => {
			return this.unstandardizeValue(value);
		});
	}

	public isLocalUrl(url: string): boolean {
		const hostname = this.getHostname();

		return url.startsWith(hostname);
	}

	public async fetchAccountId(
		username: string,
		password: string
	): Promise<string | undefined> {
		const adapter = this.getAdapter();

		return adapter.fetchAccountId(username, password);
	}

	public async fetchAnonymousAccount(): Promise<Node> {
		const node = await this.fetchNode({
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.ANONYMOUS_ACCOUNT
		});

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	public async fetchSystemAccount(): Promise<Node> {
		const node = await this.fetchNode({
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.SYSTEM_ACCOUNT
		});

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	// TODO: Make this private again.
	public getHostname(): string {
		return this.hostname;
	}

	private getNodeKey(parameters: NodeParameters): string {
		return `${parameters.type_id}/${parameters.id}`;
	}

	private fetchSystemNode(parameters: NodeParameters): Node | undefined {
		const system_cache = this.getSystemCache();

		return system_cache.fetchNode(parameters);
	}

	private standardizeNode(node: Node): Node {
		const hostname = this.getHostname();

		return transformNode(node, hostname, standardizeUrl);
	}

	private unstandardizeNode(node: Node): Node {
		const hostname = this.getHostname();

		return transformNode(node, hostname, unstandardizeUrl);
	}

	private standardizeValue(value: FieldValue): FieldValue {
		const hostname = this.getHostname();

		return standardizeUrl(value, hostname);
	}

	private unstandardizeValue(value: FieldValue): FieldValue {
		const hostname = this.getHostname();

		return unstandardizeUrl(value, hostname);
	}

	private getAdapter(): Adapter {
		return this.adapter;
	}

	private getSystemCache(): SystemCache {
		return this.system_cache;
	}
}

export default Repository;
