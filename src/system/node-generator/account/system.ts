import SystemId from 'system/enum/id';
import SystemNodeGenerator from 'system/node-generator';

class SystemAccountGenerator extends SystemNodeGenerator {
	protected getTypeId(): string {
		return SystemId.ACCOUNT_TYPE;
	}

	protected getNodeId(): string {
		return SystemId.SYSTEM_ACCOUNT;
	}
}

export default SystemAccountGenerator;
