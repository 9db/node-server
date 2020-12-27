import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class AnonymousAccountGenerator extends SystemNodeGenerator {
	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.ANONYMOUS_ACCOUNT
		};
	}
}

export default AnonymousAccountGenerator;
