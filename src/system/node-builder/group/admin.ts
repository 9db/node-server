import SystemId from 'system/enum/id';
import GroupNode from 'type/node/group';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class AdminGroupBuilder extends SystemNodeBuilder {
	public build(): GroupNode {
		const node = super.build();
		const accounts: string[] = [];

		return {
			...node,
			accounts
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GROUP_TYPE,
			id: SystemId.ADMIN_GROUP
		};
	}
}

export default AdminGroupBuilder;
