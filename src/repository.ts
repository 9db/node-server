import Node from 'type/node';
import Adapter from 'interface/adapter';
import SystemId from 'system/enum/id';
import SystemCache from 'system/cache';
import buildNodeUrl from 'utility/build-node-url';
import NotFoundError from 'http/error/not-found';
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
		type_id: string,
		node_id: string
	): Promise<Node | undefined> {
		const system_node = this.fetchSystemNode(type_id, node_id);

		if (system_node !== undefined) {
			// NOTE: No transformation happens on system nodes, for performance
			// reasons. They are generated upfront to use the correct hostname.
			return Promise.resolve(system_node);
		}

		const adapter = this.getAdapter();
		const node_key = `${type_id}/${node_id}`;
		const node = await adapter.fetchNode(node_key);

		if (node === undefined) {
			return undefined;
		}

		return this.unstandardizeNode(node);
	}

	public async storeNode(node: Node): Promise<Node> {
		const node_key = `${node.type_id}/${node.id}`;
		const adapter = this.getAdapter();
		const standardized_node = this.standardizeNode(node);

		await adapter.storeNode(node_key, standardized_node);

		return node;
	}

	public async setField(
		type_id: string,
		node_id: string,
		field_key: string,
		field_value: FieldValue
	): Promise<Node> {
		const node_key = `${type_id}/${node_id}`;
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
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node_key = `${type_id}/${node_id}`;
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.addValueToSet(
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async removeValueFromSet(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue
	): Promise<Node> {
		const node_key = `${type_id}/${node_id}`;
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.removeValueFromSet(
			node_key,
			field_key,
			standardized_value
		);

		return this.unstandardizeNode(node);
	}

	public async addValueToList(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node_key = `${type_id}/${node_id}`;
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.addValueToList(
			node_key,
			field_key,
			standardized_value,
			position
		);

		return this.unstandardizeNode(node);
	}

	public async removeValueFromList(
		type_id: string,
		node_id: string,
		field_key: string,
		value: PrimitiveValue,
		position?: number
	): Promise<Node> {
		const node_key = `${type_id}/${node_id}`;
		const standardized_value = this.standardizePrimitiveValue(value);
		const adapter = this.getAdapter();

		const node = await adapter.removeValueFromList(
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
		const match = suffix.match(/^\/([^\/]+)\/([^\/]+)$/);

		if (match === null) {
			return undefined;
		}

		const type_id = match[1];
		const id = match[2];

		return {
			id,
			type_id
		};
	}

	public async fetchAccountId(
		username: string,
		password: string
	): Promise<string | undefined> {
		const adapter = this.getAdapter();

		return adapter.fetchAccountId(username, password);
	}

	public async fetchAnonymousAccount(): Promise<Node> {
		const node = await this.fetchNode(
			SystemId.ACCOUNT_TYPE,
			SystemId.ANONYMOUS_ACCOUNT
		);

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	public async fetchSystemAccount(): Promise<Node> {
		const node = await this.fetchNode(
			SystemId.ACCOUNT_TYPE,
			SystemId.SYSTEM_ACCOUNT
		);

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	private fetchSystemNode(type_id: string, node_id: string): Node | undefined {
		const system_cache = this.getSystemCache();

		return system_cache.fetchNode(type_id, node_id);
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
