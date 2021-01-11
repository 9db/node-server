import Node from 'type/node';
import Adapter from 'interface/adapter';
import SystemId from 'system/enum/id';
import FieldValue from 'type/field-value';
import AccountNode from 'type/node/account';
import NotFoundError from 'http/error/not-found';
import transformNode from 'repository/utility/transform-node';
import transformValue from 'repository/utility/transform-value';
import NodeParameters from 'type/node-parameters';
import standardizeUrl from 'repository/utility/standardize-url';
import BadRequestError from 'http/error/bad-request';
import ListTypeBuilder from 'system/node-builder/type/list';
import getListInnerType from 'utility/get-list-inner-type';
import unstandardizeUrl from 'repository/utility/unstandardize-url';
import getNodeParameters from 'utility/get-node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class Repository {
	private hostname: string;
	private adapter: Adapter;
	private system_node_promise: Promise<void>;

	public constructor(hostname: string, adapter: Adapter) {
		this.hostname = hostname;
		this.adapter = adapter;

		const generator = new SystemNodeGenerator(adapter);

		this.system_node_promise = generator.generate();
	}

	public async fetchNode(
		parameters: NodeParameters
	): Promise<Node | undefined> {
		await this.generateSystemNodes();

		if (this.isListTypeNode(parameters)) {
			return this.getListTypeNode(parameters);
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
		old_value: FieldValue,
		new_value: FieldValue
	): Promise<Node> {
		const node_key = this.getNodeKey(parameters);
		const standardized_old_value = this.standardizeValue(old_value);
		const standardized_new_value = this.standardizeValue(new_value);
		const adapter = this.getAdapter();

		const node = await adapter.setField(
			node_key,
			field_key,
			standardized_old_value,
			standardized_new_value
		);

		return this.unstandardizeNode(node);
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

	public async fetchAnonymousAccount(): Promise<AccountNode> {
		const type_id = SystemId.ACCOUNT_TYPE;
		const id = SystemId.ANONYMOUS_ACCOUNT;

		const node = await this.fetchNode({
			type_id,
			id
		});

		if (node === undefined) {
			throw new NotFoundError(`Unable to find node: ${type_id}/${id}`);
		}

		return node as AccountNode;
	}

	public async fetchSystemAccount(): Promise<AccountNode> {
		const type_id = SystemId.ACCOUNT_TYPE;
		const id = SystemId.SYSTEM_ACCOUNT;

		const node = await this.fetchNode({
			type_id,
			id
		});

		if (node === undefined) {
			throw new NotFoundError(`Unable to find node: ${type_id}/${id}`);
		}

		return node as AccountNode;
	}

	// TODO: Make this private again.
	public getHostname(): string {
		return this.hostname;
	}

	private isListTypeNode(parameters: NodeParameters): boolean {
		const { type_id, id } = parameters;

		if (type_id !== SystemId.GENERIC_TYPE) {
			return false;
		}

		const inner_type_id = getListInnerType(id);

		if (inner_type_id === null) {
			return false;
		}

		return true;
	}

	private getListTypeNode(parameters: NodeParameters): Node {
		const inner_type_id = getListInnerType(parameters.id);

		if (inner_type_id === null) {
			throw new BadRequestError(`
				Unable to determine inner type for type id: ${parameters.id}
			`);
		}

		const builder = new ListTypeBuilder(inner_type_id);
		const node = builder.build();

		return this.unstandardizeNode(node);
	}

	private getNodeKey(parameters: NodeParameters): string {
		return `${parameters.type_id}/${parameters.id}`;
	}

	private generateSystemNodes(): Promise<void> {
		return this.system_node_promise;
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

	private getAdapter(): Adapter {
		return this.adapter;
	}
}

export default Repository;
