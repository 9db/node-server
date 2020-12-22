import Node from 'type/node';
import FieldValue from 'type/field-value';
import Operation, {OperationInput} from 'operation';

interface NodeInput {
	readonly id: string;
	readonly type_id: string;
	readonly [key: string]: FieldValue;
}

interface Input extends OperationInput {
	readonly node: NodeInput;
}

class CreateNodeOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const node = await this.buildNode();
		const repository = this.getRepository();

		return repository.storeNode(node);
	}

	private async buildNode(): Promise<Node> {
		const node_input = this.getNodeInput();
		const creator = this.getAccountUrl();
		const created_at = Date.now();
		const updated_at = created_at;

		return {
			...node_input,
			creator,
			created_at,
			updated_at,
			changes: []
		};
	}

	private getNodeInput(): NodeInput {
		const input = this.getInput();

		return input.node;
	}

	private getAccountUrl(): string {
		const account = this.getAccount();
		const repository = this.getRepository();

		return repository.buildNodeUrl(account);
	}
}

export default CreateNodeOperation;
