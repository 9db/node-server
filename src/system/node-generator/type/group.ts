import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class GroupTypeGenerator extends SystemNodeGenerator {
	public generate(): Node {
		const node = super.generate();
		const accounts = this.getAccountsTypeUrl();

		return {
			...node,
			accounts
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.GROUP_TYPE
		};
	}

	private getAccountsTypeUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.ACCOUNT_SET_TYPE
		});
	}
}

export default GroupTypeGenerator;
