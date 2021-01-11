import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class ChangeTypeBuilder extends SystemNodeBuilder {
	public build(): Node {
		const node = super.build();
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

	protected getPermissionUrls(): string[] {
		const urls = super.getPermissionUrls();

		const system_create_url = this.buildUrl(
			SystemId.PERMISSION_TYPE,
			SystemId.SYSTEM_CREATE_PERMISSION
		);

		return [...urls, system_create_url];
	}

	private getStatusUrl(): string {
		// TODO: Codify this type
		return this.buildUrl(SystemId.GENERIC_TYPE, 'change-status');
	}

	private getChangeTypeUrl(): string {
		// TODO: Codify this type
		return this.buildUrl(SystemId.GENERIC_TYPE, 'change-type');
	}

	private getFieldUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.STRING_TYPE);
	}

	private getOldValueUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.STRING_TYPE);
	}

	private getNewValueUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.STRING_TYPE);
	}

	private getApproverUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.ACCOUNT_TYPE);
	}
}

export default ChangeTypeBuilder;
