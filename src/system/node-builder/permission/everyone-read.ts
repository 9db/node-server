import SystemId from 'system/enum/id';
import ActionType from 'enum/action-type';
import PermissionNode from 'type/node/permission';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class EveryoneReadPermissionBuilder extends SystemNodeBuilder {
	public build(): PermissionNode {
		const node = super.build();
		const group = this.getEveryoneGroupUrl();
		const action_type = ActionType.READ;

		return {
			...node,
			group,
			action_type
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.EVERYONE_READ_PERMISSION
		};
	}

	private getEveryoneGroupUrl(): string {
		return this.buildUrl(SystemId.GROUP_TYPE, SystemId.EVERYONE_GROUP);
	}
}

export default EveryoneReadPermissionBuilder;
