import SystemKey from 'system/enum/key';
import SystemNodeGenerator from 'system/node-generator';

class GenericTypeGenerator extends SystemNodeGenerator {
	protected getTypeKey(): string {
		return SystemKey.GENERIC_TYPE;
	}

	protected getNodeKey(): string {
		return SystemKey.GENERIC_TYPE;
	}
}

export default GenericTypeGenerator;
