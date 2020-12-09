import SystemKey from 'system/enum/key';
import SystemNodeGenerator from 'system/node-generator';

class AnonymousAccountGenerator extends SystemNodeGenerator {
	protected getTypeKey(): string {
		return SystemKey.ACCOUNT_TYPE;
	}

	protected getNodeKey(): string {
		return SystemKey.ANONYMOUS_ACCOUNT;
	}
}

export default AnonymousAccountGenerator;
