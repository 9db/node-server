import SystemId from 'system/enum/id';
import SystemNodeGenerator from 'system/node-generator';

class StringTypeGenerator extends SystemNodeGenerator {
	protected getTypeId(): string {
		return SystemId.GENERIC_TYPE;
	}

	protected getNodeId(): string {
		return SystemId.STRING_TYPE;
	}
}

export default StringTypeGenerator;
