import SystemId from 'system/enum/id';
import ActionType from 'enum/action-type';
import PermissionNode from 'type/node/permission';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class AdminCreatePermissionGenerator extends SystemNodeGenerator {
	public generate(): PermissionNode {
		const node = super.generate();
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
			id: SystemId.ADMIN_CREATE_PERMISSION
		};
	}

	private getEveryoneGroupUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GROUP_TYPE,
			id: SystemId.ADMIN_GROUP
		});
	}
}

export default AdminCreatePermissionGenerator;
