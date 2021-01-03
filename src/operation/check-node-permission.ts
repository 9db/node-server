import Node from 'type/node';
import AccountNode from 'type/node/account';
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
	private anonymous_account: AccountNode | undefined;

	protected async performInternal(): Promise<void> {
		const permissions = await this.fetchNodePermissions();

		await this.fetchAnonymousAccount();

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

		const anonymous_account = this.getAnonymousAccount();

		if (permission.account === anonymous_account.url) {
			return true;
		}

		const account = this.getAccount();

		if (permission.account !== account.url) {
			return false;
		}

		return true;
	}

	private async fetchAnonymousAccount(): Promise<void> {
		const repository = this.getRepository();
		const account = await repository.fetchAnonymousAccount();

		this.anonymous_account = account;
	}

	private getAnonymousAccount(): AccountNode {
		if (this.anonymous_account === undefined) {
			throw new Error('Tried to read anonymous account, but it was not set');
		}

		return this.anonymous_account;
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
