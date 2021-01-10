import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class GenericTypeBuilder extends SystemNodeBuilder {
	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.GENERIC_TYPE
		};
	}

	protected getInstanceUrls(): string[] {
		return [
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.ACCOUNT_TYPE),
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.CHANGE_TYPE),
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.GROUP_TYPE),
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.PERMISSION_TYPE),
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.SESSION_TYPE),
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.STRING_TYPE)
		];
	}
}

export default GenericTypeBuilder;
