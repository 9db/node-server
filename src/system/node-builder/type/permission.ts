import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class PermissionTypeBuilder extends SystemNodeBuilder {
	public build(): Node {
		const node = super.build();
		const group = this.getGroupTypeUrl();
		const action_type = this.getActionTypeUrl();

		return {
			...node,
			group,
			action_type
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.PERMISSION_TYPE
		};
	}

	protected getInstanceUrls(): string[] {
		return [
			this.buildUrl(SystemId.PERMISSION_TYPE, SystemId.ADMIN_CREATE_PERMISSION),
			this.buildUrl(SystemId.PERMISSION_TYPE, SystemId.EVERYONE_READ_PERMISSION)
		];
	}

	private getGroupTypeUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.GROUP_TYPE);
	}

	private getActionTypeUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.STRING_TYPE);
	}
}

export default PermissionTypeBuilder;
