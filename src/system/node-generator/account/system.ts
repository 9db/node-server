import SystemKey from 'system/enum/key';
import SystemNodeGenerator from 'system/node-generator';

class SystemAccountGenerator extends SystemNodeGenerator {
	protected getTypeKey(): string {
		return SystemKey.ACCOUNT_TYPE;
	}

	protected getNodeKey(): string {
		return SystemKey.SYSTEM_ACCOUNT;
	}
}

export default SystemAccountGenerator;
