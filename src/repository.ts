import Node from 'type/node';
import Adapter from 'interface/adapter';
import SystemCache from 'system/cache';
import buildNodeUrl from 'utility/build-node-url';
import transformNode from 'repository/utility/transform-node';
import NodeParameters from 'type/node-parameters';
import transformValue from 'repository/utility/transform-value';
import standardizeUrl from 'repository/utility/standardize-url';
import unstandardizeUrl from 'repository/utility/unstandardize-url';
import FieldValue, { PrimitiveValue } from 'type/field-value';

class Repository {
	private hostname: string;
	private adapter: Adapter;
	private system_cache: SystemCache;

	public constructor(hostname: string, adapter: Adapter) {
		this.hostname = hostname;
		this.adapter = adapter;

		this.system_cache = new SystemCache(hostname);
	}

	public async fetchNode(
		namespace_key: string,
		type_key: string,
		node_key: string
	): Promise<Node | undefined> {
		const system_node = this.fetchSystemNode(namespace_key, type_key, node_key);

		if (system_node !== undefined) {
			// NOTE: No transformation happens on system nodes, for performance
			// reasons. They are generated upfront to use the correct hostname.
			return Promise.resolve(system_node);
		}

		const adapter = this.getAdapter();
		const node = await adapter.fetchNode(namespace_key, type_key, node_key);

		if (node === undefined) {
			return undefined;
		}

		return this.unstandardizeNode(node);
	}

	public async storeNode(node: Node): Promise<Node> {
		const adapter = this.getAdapter();
		const standardized_node = this.standardizeNode(node);

		await adapter.storeNode(standardized_node);

		return node;
	}

	public async setField(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node> {
		const standardized_value = this.standardizeValue(field_value);
		const adapter = this.getAdapter();

		const node = await adapter.setField(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async addValueToSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.addValueToSet(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async removeValueFromSet(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.removeValueFromSet(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async addValueToList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.addValueToList(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value,
			position
		);

		return this.unstandardizeNode(node);
	}

	public async removeValueFromList(
		namespace_key: string,
		type_key: string,
		node_key: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.removeValueFromList(
			namespace_key,
			type_key,
			node_key,
			field_key,
			standardized_value,
			position
		);

		return this.unstandardizeNode(node);
	}

	public buildNodeUrl(node: Node): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, node);
	}

	public isLocalUrl(url: string): boolean {
		const hostname = this.getHostname();

		return url.startsWith(hostname);
	}

	public getNodeParametersForUrl(url: string): NodeParameters | undefined {
		const hostname = this.getHostname();
		const suffix = url.replace(hostname, '');
		const match = suffix.match(/^\/([^\/]+)\/([^\/]+)\/([^\/]+)$/);

		if (match === null) {
			return undefined;
		}

		const namespace_key = match[1];
		const type_key = match[2];
		const key = match[3];

		return {
			namespace_key,
			type_key,
			key
		};
	}

	public async fetchAccountKey(
		username: string,
		password: string
	): Promise<string | undefined> {
		const adapter = this.getAdapter();

		return adapter.fetchAccountKey(username, password);
	}

	private fetchSystemNode(
		namespace_key: string,
		type_key: string,
		node_key: string
	): Node | undefined {
		const system_cache = this.getSystemCache();

		return system_cache.fetchNode(namespace_key, type_key, node_key);
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

		return transformValue(value, hostname, standardizeUrl);
	}

	private standardizePrimitiveValue(value: PrimitiveValue): PrimitiveValue {
		const hostname = this.getHostname();

		return standardizeUrl(value, hostname);
	}

	private getHostname(): string {
		return this.hostname;
	}

	private getAdapter(): Adapter {
		return this.adapter;
	}

	private getSystemCache(): SystemCache {
		return this.system_cache;
	}
}

export default Repository;
