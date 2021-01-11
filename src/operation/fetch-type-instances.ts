import TypeNode from 'type/type-node';
import InstanceNode from 'type/instance-node';
import FetchListFieldNodesOperation from 'operation/fetch-list-field-nodes';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly type_node: TypeNode;
}

class FetchTypeInstancesOperation extends Operation<Input, InstanceNode[]> {
	protected async performInternal(): Promise<InstanceNode[]> {
		const type_node = this.getTypeNode();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node: type_node,
			field_key: 'instances',
			repository,
			account
		};

		const operation = new FetchListFieldNodesOperation(input);
		const nodes = await operation.perform();

		return nodes as InstanceNode[];
	}

	private getTypeNode(): TypeNode {
		const input = this.getInput();

		return input.type_node;
	}
}

export default FetchTypeInstancesOperation;
