import SystemId from 'system/enum/id';
import ActionType from 'enum/action-type';
import PermissionNode from 'type/node/permission';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class SystemCreatePermissionBuilder extends SystemNodeBuilder {
	public build(): PermissionNode {
		const node = super.build();
		const group = this.getEveryoneGroupUrl();
		const action_type = ActionType.CREATE;

		return {
			...node,
			group,
			action_type
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.SYSTEM_CREATE_PERMISSION
		};
	}

	private getEveryoneGroupUrl(): string {
		return this.buildUrl(SystemId.GROUP_TYPE, SystemId.SYSTEM_GROUP);
	}
}

export default SystemCreatePermissionBuilder;
