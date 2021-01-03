import SystemId from 'system/enum/id';
import PermissionType from 'enum/permission-type';
import PermissionNode from 'type/node/permission';
import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class PublicReadPermissionGenerator extends SystemNodeGenerator {
	public generate(): PermissionNode {
		const node = super.generate();
		const account = this.getAnonymousUrl();
		const permission_type = PermissionType.READ;

		return {
			...node,
			account,
			permission_type
		};
	}

	protected getNodeParameters(): NodeParameters {
		return {
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.PUBLIC_READ_PERMISSION
		};
	}

	private getAnonymousUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.ANONYMOUS_ACCOUNT
		});
	}
}

export default PublicReadPermissionGenerator;
