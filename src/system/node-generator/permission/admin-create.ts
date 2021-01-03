import SystemId from 'system/enum/id';
import PermissionType from 'enum/permission-type';
import PermissionNode from 'type/node/permission';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class AdminCreatePermissionGenerator extends SystemNodeGenerator {
	public generate(): PermissionNode {
		const node = super.generate();
		const group = this.getEveryoneGroupUrl();
		const permission_type = PermissionType.CREATE;

		return {
			...node,
			group,
			permission_type
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
