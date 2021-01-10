import SystemId from 'system/enum/id';
import GroupNode from 'type/node/group';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class AdminGroupGenerator extends SystemNodeGenerator {
	public generate(): GroupNode {
		const node = super.generate();
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

export default AdminGroupGenerator;
