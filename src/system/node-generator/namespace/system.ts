import SystemKey from 'system/enum/key';
import SystemNodeGenerator from 'system/node-generator';

class SystemNamespaceGenerator extends SystemNodeGenerator {
	protected getTypeKey(): string {
		return SystemKey.NAMESPACE_TYPE;
	}

	protected getNodeKey(): string {
		return SystemKey.SYSTEM_NAMESPACE;
	}
}

export default SystemNamespaceGenerator;
