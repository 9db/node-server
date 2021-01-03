import Node from 'type/node';
import SystemId from 'system/enum/id';
import buildNodeUrl from 'utility/build-node-url';
import NodeParameters from 'type/node-parameters';
import StaticPermissionSet from 'enum/static-permission-set';

abstract class SystemNodeGenerator {
	private hostname: string;

	public constructor(hostname: string) {
		this.hostname = hostname;
	}

	public generate(): Node {
		let node: Node = {
			url: this.getNodeUrl(),
			type: this.getTypeUrl(),
			creator: this.getCreatorUrl(),
			created_at: 0,
			updated_at: 0,
			changes: this.getChangesUrl(),
			permissions: this.getPermissionsUrl()
		};

		if (this.isTypeNode()) {
			node = {
				...node,
				instances: this.getInstancesUrl(),
				child_types: this.getChildTypesUrl(),
				parent_type: this.getParentTypeUrl()
			};
		}

		return node;
	}

	protected getCreatorUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.SYSTEM_ACCOUNT
		});
	}

	protected buildNodeUrl(parameters: NodeParameters): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, parameters);
	}

	private getNodeUrl(): string {
		const parameters = this.getNodeParameters();

		return this.buildNodeUrl(parameters);
	}

	private getTypeUrl(): string {
		const type_id = this.getTypeId();

		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: type_id
		});
	}

	private getChangesUrl(): string {
		const node_id = this.getNodeId();

		return this.buildNodeUrl({
			type_id: SystemId.CHANGE_LIST_TYPE,
			id: `${node_id}-changes`
		});
	}

	private getPermissionsUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.PERMISSION_SET_TYPE,
			id: StaticPermissionSet.PUBLIC_READ
		});
	}

	private getInstancesUrl(): string {
		const node_id = this.getNodeId();

		return this.buildNodeUrl({
			type_id: `${node_id}-set`,
			id: `${node_id}-instances`
		});
	}

	private getChildTypesUrl(): string {
		const node_id = this.getNodeId();

		return this.buildNodeUrl({
			type_id: SystemId.TYPE_SET_TYPE,
			id: `${node_id}-child-types`
		});
	}

	private getParentTypeUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.GENERIC_TYPE
		});
	}

	private isTypeNode(): boolean {
		const type_id = this.getTypeId();

		return type_id === SystemId.GENERIC_TYPE;
	}

	private getNodeId(): string {
		const parameters = this.getNodeParameters();

		return parameters.id;
	}

	private getTypeId(): string {
		const parameters = this.getNodeParameters();

		return parameters.type_id;
	}

	private getHostname(): string {
		return this.hostname;
	}

	protected abstract getNodeParameters(): NodeParameters;
}

export interface GeneratorConstructor {
	new (hostname: string): SystemNodeGenerator;
}

export default SystemNodeGenerator;
