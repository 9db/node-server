import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class StringTypeGenerator extends SystemNodeGenerator {
	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.STRING_TYPE
		};
	}
}

export default StringTypeGenerator;
