import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class GroupTypeBuilder extends SystemNodeBuilder {
	public build(): Node {
		const node = super.build();
		const accounts = this.getAccountsTypeUrl();

		return {
			...node,
			accounts
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.GROUP_TYPE
		};
	}

	protected getInstanceUrls(): string[] {
		return [
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.ADMIN_GROUP),
			this.buildUrl(SystemId.GENERIC_TYPE, SystemId.EVERYONE_GROUP)
		];
	}

	private getAccountsTypeUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.ACCOUNT_LIST_TYPE);
	}
}

export default GroupTypeBuilder;
