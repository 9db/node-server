import Node from 'type/node';
import SystemId from 'system/enum/id';
import GroupNode from 'type/node/group';
import ActionType from 'enum/action-type';
import PermissionNode from 'type/node/permission';
import getNodeParameters from 'utility/get-node-parameters';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';
import Operation, { OperationInput } from 'operation';
import FetchNodePermissionsOperation from 'operation/fetch-node-permissions';

interface Input extends OperationInput {
	readonly node: Node;
}

class FetchAvailableActionTypesOperation extends Operation<
	Input,
	ActionType[]
> {
	protected async performInternal(): Promise<ActionType[]> {
		if (this.accountIsCreator()) {
			const result = this.getAllAvailableActionTypes();

			return Promise.resolve(result);
		}

		const permissions = await this.fetchNodePermissions();
		const action_types: ActionType[] = [];

		let index = 0;

		while (index < permissions.length) {
			const permission = permissions[index];

			index++;

			const covers_account = await this.permissionCoversAccount(permission);

			if (covers_account) {
				action_types.push(permission.action_type);
			}
		}

		return action_types;
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

	private async permissionCoversAccount(
		permission: PermissionNode
	): Promise<boolean> {
		const url = permission.group;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			url,
			repository,
			account
		};

		const operation = new LoadNodeFromUrlOperation(input);
		const node = await operation.perform();
		const group = node as GroupNode;

		return group.accounts.includes(account.url);
	}

	private accountIsCreator(): boolean {
		const account = this.getAccount();
		const node = this.getNode();

		return account.url === node.creator;
	}

	private getAllAvailableActionTypes(): ActionType[] {
		const action_types = [
			ActionType.READ,
			ActionType.UPDATE,
			ActionType.DELETE,
			ActionType.PROPOSE
		];

		if (this.isTypeNode()) {
			action_types.push(ActionType.CREATE);
		}

		return action_types;
	}

	private isTypeNode(): boolean {
		const node = this.getNode();
		const parameters = getNodeParameters(node.url);

		return parameters.type_id === SystemId.GENERIC_TYPE;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default FetchAvailableActionTypesOperation;
