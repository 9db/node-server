import Node from 'type/node';
import NotFoundError from 'http/error/not-found';
import PermissionType from 'enum/permission-type';
import CheckNodePermissionOperation from 'operation/check-node-permission';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly id: string;
	readonly type_id: string;
}

class FetchNodeOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const node = await this.fetchNode();

		await this.checkNodePermission(node);

		return node;
	}

	private async fetchNode(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		const node = await repository.fetchNode({
			type_id: input.type_id,
			id: input.id
		});

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	private checkNodePermission(node: Node): Promise<void> {
		const permission_type = PermissionType.READ;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node,
			permission_type,
			repository,
			account
		};

		const operation = new CheckNodePermissionOperation(input);

		return operation.perform();
	}
}

export default FetchNodeOperation;
