import Node from 'type/node';
import SystemId from 'system/enum/id';
import PermissionNode from 'type/node/permission';
import BadRequestError from 'http/error/bad-request';
import getNodeParameters from 'utility/get-node-parameters';
import StaticPermissionSet from 'enum/static-permission-set';
import Operation, { OperationInput } from 'operation';
import FetchListFieldNodesOperation from 'operation/fetch-list-field-nodes';

interface Input extends OperationInput {
	readonly node: Node;
}

class FetchNodePermissionsOperation extends Operation<Input, PermissionNode[]> {
	protected async performInternal(): Promise<PermissionNode[]> {
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
			case StaticPermissionSet.EVERYONE_READ:
				return this.fetchEveryoneReadPermissions();
			default:
				throw new BadRequestError();
		}
	}

	private async fetchEveryoneReadPermissions(): Promise<PermissionNode[]> {
		const repository = this.getRepository();

		const everyone_read_promise = repository.fetchNode({
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.EVERYONE_READ_PERMISSION
		});

		const admin_create_promise = repository.fetchNode({
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.ADMIN_CREATE_PERMISSION
		});

		const promises = [everyone_read_promise, admin_create_promise];
		const results = await Promise.all(promises);

		const nodes = results.filter((result) => {
			return result !== undefined;
		});

		return nodes as PermissionNode[];
	}

	private getPermissionSetId(): string {
		const node = this.getNode();
		const permissions_url = node.permissions;
		const parameters = getNodeParameters(permissions_url);

		return parameters.id;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default FetchNodePermissionsOperation;
