import Node from 'type/node';
import PermissionNode from 'type/node/permission';
import Operation, { OperationInput } from 'operation';
import FetchListFieldNodesOperation from 'operation/fetch-list-field-nodes';

interface Input extends OperationInput {
	readonly node: Node;
}

class FetchNodePermissionsOperation extends Operation<Input, PermissionNode[]> {
	protected async performInternal(): Promise<PermissionNode[]> {
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

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default FetchNodePermissionsOperation;
