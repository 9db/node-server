import Node from 'type/node';
import SystemId from 'system/enum/id';
import PermissionNode from 'type/node/permission';
import PermissionType from 'enum/permission-type';
import UnauthorizedError from 'http/error/unauthorized';
import Operation, { OperationInput } from 'operation';
import FetchNodePermissionsOperation from 'operation/fetch-node-permissions';

interface Input extends OperationInput {
	readonly node: Node;
	readonly permission_type: PermissionType;
}

class CheckNodePermissionOperation extends Operation<Input, void> {
	protected async performInternal(): Promise<void> {
		const permissions = await this.fetchNodePermissions();

		if (this.hasRequiredPermission(permissions)) {
			return;
		}

		throw new UnauthorizedError();
	}

	private fetchNodePermissions(): Promise<PermissionNode[]> {
		const node = this.getNode();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node,
			repository,
			account
		};

		const operation = new FetchNodePermissionsOperation(input);

		return operation.perform();
	}

	private hasRequiredPermission(permissions: PermissionNode[]): boolean {
		return permissions.some((permission) => {
			return this.isRequiredPermission(permission);
		});
	}

	private isRequiredPermission(permission: PermissionNode): boolean {
		const permission_type = this.getPermissionType();

		if (permission.permission_type !== permission_type) {
			return false;
		}

		if (permission.group === SystemId.EVERYONE_GROUP) {
			return true;
		}

		// TODO: Check the actual group members...

		return true;
	}

	private getPermissionType(): PermissionType {
		const input = this.getInput();

		return input.permission_type;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default CheckNodePermissionOperation;
