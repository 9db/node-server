import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class SystemAccountBuilder extends SystemNodeBuilder {
	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.SYSTEM_ACCOUNT
		};
	}
}

export default SystemAccountBuilder;
