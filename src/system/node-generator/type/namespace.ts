import SystemKey from 'system/enum/key';
import SystemNodeGenerator from 'system/node-generator';

class NamespaceTypeGenerator extends SystemNodeGenerator {
	protected getTypeKey(): string {
		return SystemKey.GENERIC_TYPE;
	}

	protected getNodeKey(): string {
		return SystemKey.NAMESPACE_TYPE;
	}
}

export default NamespaceTypeGenerator;
