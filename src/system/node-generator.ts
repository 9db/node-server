import Node from 'type/node';
import Adapter from 'interface/adapter';
import NodeParameters from 'type/node-parameters';
import GroupTypeBuilder from 'system/node-builder/type/group';
import getNodeParameters from 'utility/get-node-parameters';
import ChangeTypeBuilder from 'system/node-builder/type/change';
import StringTypeBuilder from 'system/node-builder/type/string';
import AdminGroupBuilder from 'system/node-builder/group/admin';
import SystemGroupBuilder from 'system/node-builder/group/system';
import SessionTypeBuilder from 'system/node-builder/type/session';
import GenericTypeBuilder from 'system/node-builder/type/generic';
import AccountTypeBuilder from 'system/node-builder/type/account';
import EveryoneGroupBuilder from 'system/node-builder/group/everyone';
import SystemAccountBuilder from 'system/node-builder/account/system';
import PermissionTypeBuilder from 'system/node-builder/type/permission';
import AnonymousAccountBuilder from 'system/node-builder/account/anonymous';
import AdminCreatePermissionBuilder from 'system/node-builder/permission/admin-create';
import EveryoneReadPermissionBuilder from 'system/node-builder/permission/everyone-read';
import SystemCreatePermissionBuilder from 'system/node-builder/permission/system-create';

const BUILDER_CONSTRUCTORS = [
	// Types
	GroupTypeBuilder,
	ChangeTypeBuilder,
	StringTypeBuilder,
	AccountTypeBuilder,
	GenericTypeBuilder,
	SessionTypeBuilder,
	PermissionTypeBuilder,

	// Groups
	AdminGroupBuilder,
	EveryoneGroupBuilder,
	SystemGroupBuilder,

	// Accounts
	SystemAccountBuilder,
	AnonymousAccountBuilder,

	// Permissions
	AdminCreatePermissionBuilder,
	EveryoneReadPermissionBuilder,
	SystemCreatePermissionBuilder
];

class SystemNodeGenerator {
	private adapter: Adapter;

	public constructor(adapter: Adapter) {
		this.adapter = adapter;
	}

	public async generate(): Promise<void> {
		const nodes = this.getNodes();

		let index = 0;

		while (index < nodes.length) {
			const node = nodes[index];

			index++;

			await this.persistNodeIfNecessary(node);
		}
	}

	private getNodes(): Node[] {
		return BUILDER_CONSTRUCTORS.map((builder_constructor) => {
			const builder = new builder_constructor();

			return builder.build();
		});
	}

	private async persistNodeIfNecessary(node: Node): Promise<void> {
		const parameters = getNodeParameters(node.url);
		const node_key = this.getNodeKey(parameters);
		const adapter = this.getAdapter();

		const existing_node = await adapter.fetchNode(node_key);

		if (existing_node !== undefined) {
			return;
		}

		console.log(`Generating initial system node: ${node_key}`);

		await adapter.storeNode(node_key, node);
	}

	private getNodeKey(node_parameters: NodeParameters): string {
		return `${node_parameters.type_id}/${node_parameters.id}`;
	}

	private getAdapter(): Adapter {
		return this.adapter;
	}
}

export default SystemNodeGenerator;
