import SystemId from 'system/enum/id';
import GroupNode from 'type/node/group';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class SystemGroupBuilder extends SystemNodeBuilder {
	public build(): GroupNode {
		const node = super.build();
		const accounts = this.getAccountUrls();

		return {
			...node,
			accounts
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GROUP_TYPE,
			id: SystemId.SYSTEM_GROUP
		};
	}

	private getAccountUrls(): string[] {
		return [this.getSystemAccountUrl()];
	}
}

export default SystemGroupBuilder;
