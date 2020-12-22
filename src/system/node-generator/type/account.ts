import SystemId from 'system/enum/id';
import SystemNodeGenerator from 'system/node-generator';

class AccountTypeGenerator extends SystemNodeGenerator {
	protected getTypeId(): string {
		return SystemId.GENERIC_TYPE;
	}

	protected getNodeId(): string {
		return SystemId.ACCOUNT_TYPE;
	}
}

export default AccountTypeGenerator;
