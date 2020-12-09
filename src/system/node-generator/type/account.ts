import SystemKey from 'system/enum/key';
import SystemNodeGenerator from 'system/node-generator';

class AccountTypeGenerator extends SystemNodeGenerator {
	protected getTypeKey(): string {
		return SystemKey.GENERIC_TYPE;
	}

	protected getNodeKey(): string {
		return SystemKey.ACCOUNT_TYPE;
	}
}

export default AccountTypeGenerator;
