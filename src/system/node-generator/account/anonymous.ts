import SystemId from 'system/enum/id';
import SystemNodeGenerator from 'system/node-generator';

class AnonymousAccountGenerator extends SystemNodeGenerator {
	protected getTypeId(): string {
		return SystemId.ACCOUNT_TYPE;
	}

	protected getNodeId(): string {
		return SystemId.ANONYMOUS_ACCOUNT;
	}
}

export default AnonymousAccountGenerator;
