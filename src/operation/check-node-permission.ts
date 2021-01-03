import Node from 'type/node';
import SystemId from 'system/enum/id';
import AccountNode from 'type/node/account';
import ServerError from 'http/error/server-error';
import PermissionNode from 'type/node/permission';
import PermissionType from 'enum/permission-type';
import BadRequestError from 'http/error/bad-request';
import UnauthorizedError from 'http/error/unauthorized';
import getNodeParameters from 'utility/get-node-parameters';
import StaticPermissionSet from 'enum/static-permission-set';
import Operation, {OperationInput} from 'operation';
import FetchListFieldNodesOperation from 'operation/fetch-list-field-nodes';

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

	private async fetchNodePermissions(): Promise<PermissionNode[]> {
		if (this.hasStaticPermissions()) {
			return this.fetchStaticPermissions();
		}

		const node = this.getNode();
		const field_key = 'permissions';
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node,
			field_key,
			repository,
			account
		};

		const operation = new FetchListFieldNodesOperation(input);
		const nodes = await operation.perform();

		return nodes as PermissionNode[];
	}

	private hasStaticPermissions(): boolean {
		const permission_set_id = this.getPermissionSetId();
		const static_permissions = Object.values(StaticPermissionSet) as string[];

		return static_permissions.includes(permission_set_id);
	}

	private fetchStaticPermissions(): Promise<PermissionNode[]> {
		const permission_set_id = this.getPermissionSetId();

		switch (permission_set_id) {
			case StaticPermissionSet.PUBLIC_READ:
				return this.fetchPublicReadPermissions();
			default:
				throw new BadRequestError();
		}
	}

	private async fetchPublicReadPermissions(): Promise<PermissionNode[]> {
		const repository = this.getRepository();
		const node = await repository.fetchNode({
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.PUBLIC_READ_PERMISSION
		});

		if (node === undefined) {
			throw new ServerError('Unable to find public read permission');
		}

		const permission_node = node as PermissionNode;

		return [permission_node];
	}

	private getPermissionSetId(): string {
		const node = this.getNode();
		const permissions_url = node.permissions;
		const parameters = getNodeParameters(permissions_url);

		return parameters.id;
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
