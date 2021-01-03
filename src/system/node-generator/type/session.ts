import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class SessionTypeGenerator extends SystemNodeGenerator {
	public generate(): Node {
		const node = super.generate();
		const account = this.getAccountTypeUrl();

		return {
			...node,
			account
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.SESSION_TYPE
		};
	}

	private getAccountTypeUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.ACCOUNT_TYPE
		});
	}
}

export default SessionTypeGenerator;
