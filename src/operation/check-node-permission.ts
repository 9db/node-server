import Node from 'type/node';
import SystemId from 'system/enum/id';
import ActionType from 'enum/action-type';
import PermissionNode from 'type/node/permission';
import UnauthorizedError from 'http/error/unauthorized';
import getNodeParameters from 'utility/get-node-parameters';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';
import Operation, { OperationInput } from 'operation';
import FetchNodePermissionsOperation from 'operation/fetch-node-permissions';
import FetchListFieldValuesOperation from 'operation/fetch-list-field-values';

interface Input extends OperationInput {
	readonly node: Node;
	readonly action_type: ActionType;
}

class CheckNodePermissionOperation extends Operation<Input, void> {
	protected async performInternal(): Promise<void> {
		const permission = await this.fetchRequiredPermission();

		if (permission === undefined) {
			throw new UnauthorizedError();
		}

		await this.ensureAccountExistsInGroup(permission.group);
	}

	private async fetchRequiredPermission(): Promise<PermissionNode | undefined> {
		const permissions = await this.fetchNodePermissions();
		const action_type = this.getActionType();

		return permissions.find((permission) => {
			return permission.action_type === action_type;
		});
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

	private async ensureAccountExistsInGroup(group_url: string): Promise<void> {
		if (this.isEveryoneGroup(group_url)) {
			return;
		}

		const repository = this.getRepository();
		const account = this.getAccount();

		const load_node_operation = new LoadNodeFromUrlOperation({
			url: group_url,
			repository,
			account
		});

		const node = await load_node_operation.perform();
		const field_key = 'accounts';

		const list_values_operation = new FetchListFieldValuesOperation({
			node,
			field_key,
			repository,
			account
		});

		const values = await list_values_operation.perform();
		const account_urls = values as string[];

		if (account_urls.includes(account.url)) {
			return;
		}

		throw new UnauthorizedError();
	}

	private isEveryoneGroup(group_url: string): boolean {
		const parameters = getNodeParameters(group_url);
		const id = parameters.id;

		return id === SystemId.EVERYONE_GROUP;
	}

	private getActionType(): ActionType {
		const input = this.getInput();

		return input.action_type;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default CheckNodePermissionOperation;
