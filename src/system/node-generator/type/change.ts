import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class ChangeTypeGenerator extends SystemNodeGenerator {
	public generate(): Node {
		const node = super.generate();
		const status = this.getStatusUrl();
		const change_type = this.getChangeTypeUrl();
		const field = this.getFieldUrl();
		const old_value = this.getOldValueUrl();
		const new_value = this.getNewValueUrl();
		const approver = this.getApproverUrl();

		return {
			...node,
			status,
			change_type,
			field,
			old_value,
			new_value,
			approver
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.CHANGE_TYPE
		};
	}

	private getStatusUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: 'change-status'
		});
	}

	private getChangeTypeUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: 'change-type'
		});
	}

	private getFieldUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.STRING_TYPE
		});
	}

	private getOldValueUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.STRING_TYPE
		});
	}

	private getNewValueUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.STRING_TYPE
		});
	}

	private getApproverUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.ACCOUNT_TYPE
		});
	}
}

export default ChangeTypeGenerator;
