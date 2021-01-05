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
		const value = this.getValueUrl();
		const previous_value = this.getPreviousValueUrl();
		const approver = this.getApproverUrl();

		return {
			...node,
			status,
			change_type,
			field,
			value,
			previous_value,
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

	private getValueUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.STRING_TYPE
		});
	}

	private getPreviousValueUrl(): string {
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
