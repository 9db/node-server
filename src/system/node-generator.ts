import Node from 'type/node';
import SystemId from 'system/enum/id';
import buildNodeUrl from 'utility/build-node-url';
import NodeParameters from 'type/node-parameters';

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
			changes: [],
			permissions: this.getPermissionsList()
		};

		if (this.isTypeNode()) {
			node = {
				...node,
				instances: [],
				child_types: [],
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

	protected getPermissionsList(): string[] {
		const everyone_read_url = this.buildNodeUrl({
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.EVERYONE_READ_PERMISSION
		});

		return [everyone_read_url];
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
