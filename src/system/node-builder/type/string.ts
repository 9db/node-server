import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class StringTypeBuilder extends SystemNodeBuilder {
	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.STRING_TYPE
		};
	}
}

export default StringTypeBuilder;
