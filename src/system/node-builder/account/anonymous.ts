import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class AnonymousAccountBuilder extends SystemNodeBuilder {
	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.ANONYMOUS_ACCOUNT
		};
	}
}

export default AnonymousAccountBuilder;
