import SystemId from 'system/enum/id';
import GroupNode from 'type/node/group';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class EveryoneGroupGenerator extends SystemNodeGenerator {
	public generate(): GroupNode {
		const node = super.generate();
		const accounts = this.getAccountsUrl();

		return {
			...node,
			accounts
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GROUP_TYPE,
			id: SystemId.EVERYONE_GROUP
		};
	}

	private getAccountsUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.ACCOUNT_SET_TYPE,
			id: SystemId.EVERYONE_GROUP
		});
	}
}

export default EveryoneGroupGenerator;
