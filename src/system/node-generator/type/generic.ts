import SystemId from 'system/enum/id';
import SystemNodeGenerator from 'system/node-generator';

class GenericTypeGenerator extends SystemNodeGenerator {
	protected getTypeId(): string {
		return SystemId.GENERIC_TYPE;
	}

	protected getNodeId(): string {
		return SystemId.GENERIC_TYPE;
	}
}

export default GenericTypeGenerator;
