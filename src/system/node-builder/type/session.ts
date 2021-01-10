import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class SessionTypeBuilder extends SystemNodeBuilder {
	public build(): Node {
		const node = super.build();
		const account = this.getAccountTypeUrl();

		return {
			...node,
			account
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.SESSION_TYPE
		};
	}

	private getAccountTypeUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.ACCOUNT_TYPE);
	}
}

export default SessionTypeBuilder;
