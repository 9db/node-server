import SystemId from 'system/enum/id';
import NodeBuilder from 'system/node-builder';
import NodeParameters from 'type/node-parameters';

class AccountTypeBuilder extends NodeBuilder {
	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.ACCOUNT_TYPE
		};
	}

	protected getInstanceUrls(): string[] {
		return [this.getSystemAccountUrl(), this.getAnonymousAccountUrl()];
	}
}

export default AccountTypeBuilder;
